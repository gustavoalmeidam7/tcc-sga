from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from src.Utils.singleton import singleton
from src.Utils.env import get_env_var

from src.Repository.UserRepository import UserRepository
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema

from src.Model.UserSession import Session

from playhouse.shortcuts import model_to_dict

from src.Repository.SessionRepository import SessionRepository

from typing import Annotated

import jwt
from passlib.context import CryptContext
from uuid import UUID

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

class SessionService(metaclass=singleton):
    def __init__(self):
        self.sessionRepository = SessionRepository()
        self.userRepositoty = UserRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        self.SECRET_KEY = get_env_var("secret_key_jwt", "CHANGEME")
        self.ALGORITHM = get_env_var("algorithm_jwt", "HS256")

    def get_password_hash(self, password: str) -> str:
        """ Gera um hash da senha para ser armazenada no banco de dados """
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hash_password: str) -> bool:
        """ Verifica o hash da senha comparando o hash da senha atual
        com a armazenada no banco de dados """
        return self.pwd_context.verify(plain_password, hash_password)

    def create_session(self, userEmail: str, plain_password: str, userIP: str) -> Session:
        """ Cria uma nova sessão """
        userModel = self.userRepositoty.find_by_email(userEmail)
        credentialsException = HTTPException(status.HTTP_401_UNAUTHORIZED, "Email ou senha incorretos")
        userNotExists = HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não registrado")
        
        if not userModel:
            raise userNotExists
        
        if not self.verify_password(plain_password, userModel.password):
            raise credentialsException

        session = Session().create(
            user=userModel,
            ip=userIP
        )

        return session

    def generate_jwt_token(self, id: UUID) -> dict:
        """ Encoda em JWT uma sessão pelo ID da mesma """
        content = {"sub": str(id)}
        return jwt.encode(content, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def get_current_user(self, token: TOKEN_SCHEME) -> UserResponseSchema:
        """ Pega o user pelo token """

        credentialsException = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais de usuário, tente entrar novamente",
            headers={"WWW-Authenticate": "Bearer"}
        )

        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            id = payload.get("sub")
        except:
            raise credentialsException
        
        userSession = self.sessionRepository.find_by_id(id)

        if not userSession:
            raise credentialsException

        user = userSession.user

        return UserResponseSchema.model_validate(model_to_dict(user))

    def get_user_sessions(self, token: TOKEN_SCHEME) -> UserSessionListSchema:
        """ Encontra as sessões de um usuário """

        user = self.get_current_user(token)
        return UserSessionListSchema.model_validate({
            "user": user,
            "sessions": self.sessionRepository.find_all_by_user(user)
        })

    def revoke_session(self, token: TOKEN_SCHEME, sessionId: RevokeSessionSchema) -> None:
        """ Revoga uma sessão pelo id da mesma """

        mySessionId = jwt.decode(token, self.SECRET_KEY, self.ALGORITHM).get("sub")

        if UUID(mySessionId) == sessionId.session_id:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Impossível revogar o próprio token")
        
        user = self.get_current_user(token)
        sessionToRevoke = self.sessionRepository.find_by_id(sessionId.session_id)

        if sessionToRevoke.user == user.id:
            self.sessionRepository.delete_token_by_id(sessionId.session_id)
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token não encontrado")
