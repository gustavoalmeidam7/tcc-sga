from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User

from src.Decorators import get_user_auth_user
from src.Error.User.UserRBACError import UserRBACError

async def token_get_driver(request: Request, token: TOKEN_SCHEME) -> User:
    currentUser = await get_user_auth_user(request, token)

    if not currentUser.is_driver:
        raise UserRBACError()
    
    return currentUser

async def token_get_driver_or_higher(request: Request, token: TOKEN_SCHEME) -> User:
    currentUser = await get_user_auth_user(request, token)

    if not currentUser.is_driver_or_higher:
        raise UserRBACError()
    
    return currentUser

GET_AUTHENTICATED_DRIVER = Annotated[User, Depends(token_get_driver)]
GET_AUTHENTICATED_DRIVER_OR_HIGHER = Annotated[User, Depends(token_get_driver_or_higher)]
