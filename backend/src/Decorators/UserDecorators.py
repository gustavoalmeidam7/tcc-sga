from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

from src.Model.User import User
from src.Service.SessionService import get_current_user

async def token_get_user(token: TOKEN_SCHEME) -> 'User':
    return get_current_user(token)

GET_AUTENTHICATED_USER = Annotated[User, Depends(token_get_user)]
