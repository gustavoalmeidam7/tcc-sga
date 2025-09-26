from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Service.SessionService import get_current_user

async def token_get_user(token: TOKEN_SCHEME) -> 'User':
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível validar as credenciais de usuário, tente entrar novamente",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return get_current_user(token)

GET_AUTENTHICATED_USER = Annotated[User, Depends(token_get_user)]
