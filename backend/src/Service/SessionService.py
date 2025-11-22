from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from src.Utils.env import get_env_var

from src.Repository import UserRepository

from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema

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

"""
    Criar
"""

def create_session(userEmail: str, plain_password: str, userIP: str) -> Session:
    """ Cria uma nova sessão """
    userModel = UserRepository.find_by_email(userEmail)
    credentialsException = HTTPException(status.HTTP_401_UNAUTHORIZED, "Email ou senha incorretos")
    userNotExists = HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não registrado")
    
    if userModel is None:
        raise userNotExists
    
    if not verify_password(plain_password, userModel.senha):
        raise credentialsException

    sessionModel = Session(
        usuario=userModel,
        ip=userIP
    )

    SessionRepository.insert_session(sessionModel)

    return sessionModel

def generate_jwt_token(id: str) -> dict:
    """ Encoda em JWT uma sessão pelo ID da mesma """
    content = {"sub": id}
    return jwt.encode(content, SECRET_KEY, algorithm=ALGORITHM)

"""
    Ler
"""

def get_current_session_by_token(token: TOKEN_SCHEME) -> Session:
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

def get_current_user(token: TOKEN_SCHEME) -> User:
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

"""
    Deletar
"""
