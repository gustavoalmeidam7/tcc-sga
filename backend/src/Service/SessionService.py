from fastapi import HTTPException, status, Depends, Response, Request
from slowapi.util import get_ipaddr
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.Utils.env import get_env_var
from src.Utils import env

from src.Repository import UserRepository, RestorePasswordRepository

from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema

from src.Schema.Auth.TokenResponseSchema import TokenResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Auth.AuthSetRestorePasswordSchema import AuthSetRestorePasswordSchema
from src.Schema.Auth.AuthRestorePasswordSchema import AuthRestorePasswordSchema
from src.Schema.Auth.RestorePasswordResponseSchema import RestorePasswordResponseSchema

from src.Error.User.UserInvalidCredentials import invalidCredentials
from src.Error.Server.InternalServerError import InternalServerError
from src.Error.Resource.NotFoundResourceError import NotFoundResource
from src.Error.Server.TryAgainLater import TryAgainLater

from src.Model.UserSession import Session
from src.Model.RestorePassword import RestorePassword
from src.Model.User import User

from src.Repository import SessionRepository

from typing import Annotated

import jwt
from passlib.context import CryptContext
from uuid import UUID

from src.Error.User.UserRBACError import UserRBACError
from src.Error.Resource.NotFoundResourceError import NotFoundResource
from src.Error.User.UserInvalidCredentials import invalidCredentials

from src.Validator.GenericValidator import unmask_uuid

from datetime import datetime, timezone, timedelta

from src.Utils import env
import httpx

from pydantic import EmailStr

from src.Logging import Logging, Level

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = get_env_var("secret_key_jwt", "CHANGEME")
ALGORITHM = get_env_var("algorithm_jwt", "HS256")

"""
    Helpers
"""

def get_password_hash(password: str) -> str:
    """ Gera um hash da senha para ser armazenada no banco de dados """
    return PWD_CONTEXT.hash(password)

def verify_password(plain_password: str, hash_password: str) -> bool:
    """ Verifica o hash da senha comparando o hash da senha atual
    com a armazenada no banco de dados """
    return PWD_CONTEXT.verify(plain_password, hash_password)

def create_session(userEmail: str, plain_password: str, userIP: str, is_refresh: bool = False) -> Session:
    """ Cria uma nova sessão """
    userModel = UserRepository.find_by_email(userEmail)
    credentialsException = HTTPException(status.HTTP_401_UNAUTHORIZED, "Email ou senha incorretos")
    userNotExists = HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não registrado")
    
    if userModel is None:
        raise userNotExists
    
    if not verify_password(plain_password, userModel.senha):
        raise credentialsException

    time = {"days" if is_refresh else "minutes": 7 if is_refresh else 30}

    valid_until = (datetime.now(timezone.utc) + timedelta(**time)).isoformat()

    sessionModel = Session(
        usuario=userModel,
        ip=userIP,
        refresh=is_refresh,
        valido_ate=valid_until
    )

    SessionRepository.insert_session(sessionModel)

    return sessionModel

def get_refresh_session(refreshToken: str, userIP: str) -> Session:
    """ Da refresh na sessão atual """
    userModel = get_current_user(refreshToken)

    if not userModel:
        raise invalidCredentials()

    valid_until = (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()

    sessionModel = Session(
        usuario=userModel,
        ip=userIP,
        refresh=False,
        valido_ate=valid_until
    )

    SessionRepository.insert_session(sessionModel)

    return sessionModel

def encode_jwt_token(id: str) -> str:
    """ Encoda em JWT uma sessão pelo ID da mesma """
    content = {"sub": id}
    return jwt.encode(content, SECRET_KEY, algorithm=ALGORITHM)

def datetime_to_http_datetime(date: datetime) -> str:
    return date.strftime("%a, %d %b %Y %H:%M:%S GMT")

def is_debug() -> bool:
    return bool(env.get_env_var_not_none("environment", "DEV") == "DEV")

def set_http_only_cookie(response: Response, key: str, value: str, expires: datetime) -> Response:
    if is_debug():
        response.set_cookie(key=key, value=value, expires=datetime_to_http_datetime(expires), path="/", secure=False, httponly=True, samesite="lax")
    else:
        response.set_cookie(key=key, value=value, expires=datetime_to_http_datetime(expires), path="/", secure=True, httponly=True, samesite="none")
    return response

def create_restore_password_code(userEmail: EmailStr) -> tuple[RestorePassword, User]:
    user = UserRepository.find_by_email(userEmail)
    if not user:
        raise NotFoundResource("user", f"O usuário com email {userEmail} não foi encontrado.")
    
    RestorePasswordRepository.delete_all_user_restore_codes(user.str_id)
    
    restorePassword = RestorePasswordRepository.create_restore_password(RestorePassword(usuario= user))

    return (restorePassword, user)

def append_query_params(base: str, key: list[str], value: list[str]) -> str:
    last = base

    for (k, v) in zip(key, value):
        separator = "&" if last.find("?") > 0 else "?"
        last = "".join([last, separator, k, "=", v])

    return last


"""
    Criar
"""

async def send_restore_password_email(userRestore: AuthRestorePasswordSchema) -> RestorePasswordResponseSchema:
    (restoreCode, user) = create_restore_password_code(userRestore.userEmail)

    mailGunApiKey = env.get_env_var("MAILGUN_API_KEY")
    mailGunSandbox = env.get_env_var("MAILGUN_SANDBOX")
    urlBase = f"https://api.mailgun.net/v3/{mailGunSandbox}.mailgun.org/messages"
    mailGunFrom = f"Serviço SGA <postmaster@{mailGunSandbox}.mailgun.org>"
    frontendBaseUrl = env.get_env_var("FRONTEND_BASE_URL")
    frontendRestoreRoute = env.get_env_var("FRONTEND_RESTORE_ROUTE")

    if not mailGunApiKey or not mailGunSandbox or not frontendBaseUrl or not frontendRestoreRoute:
        Logging.log("Chaves para envio de email não foram configuradas!", Level.ERROR)
        raise InternalServerError()
    
    restoreUrl = f"{frontendBaseUrl}{frontendRestoreRoute}/{restoreCode.uuid_id}"

    keys = ["from", "to", "subject", "template", "h:X-Mailgun-Variables"]
    values = [
        mailGunFrom,
        userRestore.userEmail,
        "SGA Código de recuperação de senha",
        "password-restore",
        f"{{\"RESTORE_CODE\": \"{restoreCode.uuid_id}\",\"USERNAME\": \"{user.nome}\", \"RESTORE_LINK\": \"{restoreUrl}\"}}"
    ]

    url = append_query_params(urlBase, keys, values)
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers={"api": mailGunApiKey},
            auth=("api", mailGunApiKey)
        )

        if response.status_code != status.HTTP_200_OK:
            raise TryAgainLater("Erro no envio do email! tente novamente mais tarde")
        
    return RestorePasswordResponseSchema.model_validate({"userMessage":str(userRestore.userEmail)})
        
async def restore_user_password(userRestore: AuthSetRestorePasswordSchema) -> UserResponseFullSchema:
    restorePassword = RestorePasswordRepository.find_restore_password_by_id(unmask_uuid(userRestore.restoreCode))

    if not restorePassword:
        raise NotFoundResource("user_restore", "Não foi possível encontrar o usuário para restaurar a senha.")
    
    userId = restorePassword.usuario_str_id

    newPassword = get_password_hash(userRestore.newPassword)

    user = UserRepository.update_user_by_id(userId, senha=newPassword)

    if not user:
        raise InternalServerError()
    
    return UserResponseFullSchema.model_validate(user)

def generate_access_token(request: Request, formdata: OAuth2PasswordRequestForm) -> Response:
    userIP = get_ipaddr(request)

    accessSession = create_session(
        formdata.username, formdata.password, userIP
    )

    refreshSession = create_session(
        formdata.username, formdata.password, userIP, is_refresh=True
    )

    accessToken = encode_jwt_token(accessSession.str_id)
    refreshToken = encode_jwt_token(refreshSession.str_id)

    accessExpires = datetime.fromisoformat(str(accessSession.valido_ate))
    refreshExpires = datetime.fromisoformat(str(refreshSession.valido_ate))

    response = Response(
        content=TokenResponseSchema.model_validate({"access_token": accessToken, "token_type": "bearer", "expires_at": accessExpires.isoformat()}).model_dump_json(),
        media_type="application/json"
    )
    response = set_http_only_cookie(response, "Authorization", accessToken, accessExpires)
    response = set_http_only_cookie(response, "refreshToken", refreshToken, refreshExpires)

    return response

def refresh_access_token(request: Request) -> Response:
    userIP = get_ipaddr(request)
    cookies = request.cookies

    refreshToken = cookies.get("refreshToken")

    if not refreshToken:
        raise invalidCredentials()

    accessSession = get_refresh_session(refreshToken, userIP)

    accessToken = encode_jwt_token(accessSession.str_id)

    accessExpires = datetime.fromisoformat(str(accessSession.valido_ate))

    response = Response(
        content=TokenResponseSchema.model_validate({"access_token": accessToken, "token_type": "bearer", "expires_at": accessExpires.isoformat()}).model_dump_json(),
        media_type="application/json"
    )
    response = set_http_only_cookie(response, "Authorization", accessToken, accessExpires)

    return response

"""
    Ler
"""

def get_current_session_by_token(token: TOKEN_SCHEME | str) -> Session:
    """ Retorna a sessão pelo token """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
    except:
        raise invalidCredentials()
    

    sessionModel = SessionRepository.find_session_by_session_id(id)

    if sessionModel is None:
        raise invalidCredentials()

    return sessionModel

def get_current_user(token: TOKEN_SCHEME | str) -> User:
    """ Retorna o usuário pelo token """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
    except:
        raise invalidCredentials()
    

    userModel = SessionRepository.find_user_by_session_id(id)

    if userModel is None:
        raise invalidCredentials()

    return userModel

def get_user_sessions(token: TOKEN_SCHEME) -> UserSessionListSchema:
    """ Encontra as sessões de um usuário """

    user = get_current_user(token)
    return UserSessionListSchema.model_validate({
        "usuario": user,
        "sessoes": SessionRepository.find_all_by_user(user)
    })

"""
    Atualizar
"""

def logout(session: Session) -> Response:
    response = Response()
    response.delete_cookie("Authorization")
    response.delete_cookie("refreshToken")

    SessionRepository.delete_token_by_id(session.str_id)

    return response

"""
    Deletar
"""

def revoke_session(token: TOKEN_SCHEME, sessionSchema: RevokeSessionSchema) -> None:
    """ Revoga uma sessão pelo id da mesma """

    mySessionId = jwt.decode(token, SECRET_KEY, ALGORITHM).get("sub")

    if UUID(mySessionId) == sessionSchema.id_sessao:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Impossível revogar o próprio token")
    
    if SessionRepository.find_user_by_session_id(sessionSchema.id_sessao) is not None:
        SessionRepository.delete_token_by_id(sessionSchema.id_sessao)
    else:
        raise NotFoundResource("token", "Token não encontrado.")
    
def revoke_all_sessions_by_user_id(id: int) -> None:
    """ Revoga todas sessões de um usuário pelo token do mesmo """

    SessionRepository.delete_all_user_tokens_by_id(id)

def delete_invalid_sessions() -> None:
    """ revoga """
    SessionRepository.delete_expired_sessions()
