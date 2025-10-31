from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Service.SessionService import get_current_user

from src.Schema.User.UserRoleEnum import UserRole

from src.Service import DriverService

async def __get_user__(token: TOKEN_SCHEME) -> User:
    invalidCredentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais de usuário, tente entrar novamente",
        headers={"WWW-Authenticate": "Bearer"}
    )
    if not token:
        raise invalidCredentials
    
    currentUser = get_current_user(token)

    if currentUser is None:
        raise invalidCredentials
    
    return currentUser

async def token_get_driver(token: TOKEN_SCHEME) -> User:
    currentUser = await __get_user__(token)

    if currentUser.cargo != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário autenticado não possui permissão para acessar esse recurso",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return currentUser

async def token_get_driver_or_higer(token: TOKEN_SCHEME) -> User:
    currentUser = await __get_user__(token)

    if currentUser.cargo < UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário autenticado não possui permissão para acessar esse recurso",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return currentUser

GET_AUTENTHICATED_DRIVER = Annotated[User, Depends(token_get_driver)]
GET_AUTENTHICATED_DRIVER_OR_HIGER = Annotated[User, Depends(token_get_driver_or_higer)]
