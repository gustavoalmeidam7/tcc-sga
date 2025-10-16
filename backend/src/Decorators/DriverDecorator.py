from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Service.SessionService import get_current_user

from src.Service import DriverService

async def token_get_driver(token: TOKEN_SCHEME) -> 'User':
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais de usuário, tente entrar novamente",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    currentUser = get_current_user(token)

    if not DriverService.is_user_driver(currentUser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário autenticado não possui permissão para acessar esse recurso",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return currentUser

GET_AUTENTHICATED_DRIVER = Annotated[User, Depends(token_get_driver)]
