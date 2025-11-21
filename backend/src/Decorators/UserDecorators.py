from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Decorators import get_user_auth_user

async def token_get_user(request: Request, token: TOKEN_SCHEME) -> User:
    return await get_user_auth_user(request, token)

GET_AUTHENTICATED_USER = Annotated[User, Depends(token_get_user)]
