from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from src.Utils.env import get_env_var

from src.Repository import UserRepository

from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema

from src.Model.UserSession import Session
from src.Model.User import User

from playhouse.shortcuts import model_to_dict
from peewee import DoesNotExist

from src.Repository import SessionRepository

from typing import Annotated

import jwt
from passlib.context import CryptContext
from uuid import UUID

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = get_env_var("secret_key_jwt", "CHANGEME")
ALGORITHM = get_env_var("algorithm_jwt", "HS256")

def get_password_hash(password: str) -> str:
    """ Gera um hash da senha para ser armazenada no banco de dados """
    return PWD_CONTEXT.hash(password)

def verify_password(plain_password: str, hash_password: str) -> bool:
    """ Verifica o hash da senha comparando o hash da senha atual
    com a armazenada no banco de dados """
    return PWD_CONTEXT.verify(plain_password, hash_password)

def create_session(userEmail: str, plain_password: str, userIP: str) -> Session:
    """ Cria uma nova sessão """
    userModel = UserRepository.find_by_email(userEmail)
    credentialsException = HTTPException(status.HTTP_401_UNAUTHORIZED, "Email ou senha incorretos")
    userNotExists = HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não registrado")
    
    if not userModel:
        raise userNotExists
    
    if not verify_password(plain_password, userModel.password):
        raise credentialsException

    session = Session().create(
        user=userModel,
        ip=userIP
    )

    return session

def generate_jwt_token(id: UUID) -> dict:
    """ Encoda em JWT uma sessão pelo ID da mesma """
    content = {"sub": str(id)}
    return jwt.encode(content, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: TOKEN_SCHEME) -> 'User':
    """ Retorn o usuário pelo token """

    credentialsException = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais de usuário, tente entrar novamente",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
    except:
        raise credentialsException
    

    userSession = SessionRepository.find_by_id(id)

    if userSession is None:
        raise credentialsException

    try:
        return userSession.user
    except DoesNotExist:
        raise credentialsException

def get_user_sessions(token: TOKEN_SCHEME) -> UserSessionListSchema:
    """ Encontra as sessões de um usuário """

    user = get_current_user(token)
    return UserSessionListSchema.model_validate({
        "user": user,
        "sessions": SessionRepository.find_all_by_user(user)
    })

def revoke_session(token: TOKEN_SCHEME, sessionId: RevokeSessionSchema) -> None:
    """ Revoga uma sessão pelo id da mesma """

    mySessionId = jwt.decode(token, SECRET_KEY, ALGORITHM).get("sub")

    if UUID(mySessionId) == sessionId.session_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Impossível revogar o próprio token")
    
    user = get_current_user(token)
    sessionToRevoke = SessionRepository.find_by_id(sessionId.session_id) or Session() 

    if sessionToRevoke.user.id == user.id:
        SessionRepository.delete_token_by_id(sessionId.session_id)
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token não encontrado")
    
def revoke_all_sessions_by_user_id(id: int) -> None:
    """ Revoga todas sessões de um usuário pelo token do mesmo """

    SessionRepository.delete_all_user_tokens_by_id(id)
