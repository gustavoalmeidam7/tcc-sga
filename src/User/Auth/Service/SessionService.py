from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from src.Utils.singleton import singleton
from src.Utils.env import get_env_var

from src.User.Repository.UserRepository import UserRepository
from src.User.Schema.UserResponseSchema import UserResponseSchema
from src.Model.User import User
from src.Model.UserSession import Session

from playhouse.shortcuts import model_to_dict

from src.User.Auth.Repository.SessionRepository import SessionRepository

from typing import Annotated

import jwt
from passlib.context import CryptContext
from uuid import UUID

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="token")

class SessionService(metaclass=singleton):
    def __init__(self):
        self.sessionRepository = SessionRepository()
        self.userRepositoty = UserRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        self.SECRET_KEY = get_env_var("secret_key_jwt")
        self.ALGORITHM = get_env_var("algorithm_jwt")

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hash_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hash_password)

    def auth_user(self, userEmail: str, plain_password: str) -> User:
        userModel = self.userRepositoty.find_by_email(userEmail)
        credentialsException = HTTPException(status.HTTP_401_UNAUTHORIZED, "Email ou senha incorretos")
        
        if not userModel:
            raise credentialsException
        
        if not self.verify_password(plain_password, userModel.password):
            raise credentialsException
        
        return userModel

    def create_session(self, userMail: str, userPassword: str, userIP: str) -> Session:
        user = self.auth_user(userMail, userPassword)

        session = Session().create(
            user=user,
            ip=userIP
        )

        return session

    def generate_jwt_token(self, id: UUID) -> dict:
        content = {"sub": str(id)}
        return jwt.encode(content, self.SECRET_KEY, algorithm=self.ALGORITHM)

    def get_current_user(self, token: Annotated[str, Depends(OAUTH2_SCHEME)]) -> User:
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

        user = userSession.user

        if not user:
            raise credentialsException

        return UserResponseSchema.model_validate(model_to_dict(user))
