from fastapi import HTTPException, status, Depends, Response, Request
from slowapi.util import get_ipaddr
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.Utils.env import get_env_var

from src.Repository import UserRepository

from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema

from src.Schema.Auth.TokenResponseSchema import TokenResponseSchema

from src.Error.User.UserInvalidCredentials import invalidCredentials

from src.Model.UserSession import Session
from src.Model.User import User

from src.Repository import SessionRepository

from typing import Annotated

import jwt
from passlib.context import CryptContext
from uuid import UUID

from src.Error.User.UserRBACError import UserRBACError
from src.Error.Resource.NotFoundResourceError import NotFoundResource
from src.Error.User.UserInvalidCredentials import invalidCredentials

from datetime import datetime, timezone, timedelta

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

"""
    Criar
"""

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
    response.set_cookie(key="Authorization", value=accessToken, expires=datetime_to_http_datetime(accessExpires), path="/", secure=False ,httponly=True, samesite="strict")
    response.set_cookie(key="refreshToken", value=refreshToken, expires=datetime_to_http_datetime(refreshExpires), path="/", secure=False ,httponly=True, samesite="strict")

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
    response.set_cookie(key="Authorization", value=accessToken, expires=datetime_to_http_datetime(accessExpires), domain=get_env_var("FRONTEND_DOMAIN", "https://dev.tcc-sga.pages.dev/"), path="/", secure=False ,httponly=True, samesite="strict")

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
