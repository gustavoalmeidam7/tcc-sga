from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User

from src.Schema.User.UserRoleEnum import UserRole

from src.Decorators import get_user_auth_user
from src.Error.User.UserInvalidCredentials import invalidCredentials
from src.Error.User.UserRBACError import UserRBACError

def is_user_manager(user: User) -> bool:
    return bool(user.cargo == UserRole.MANAGER)

async def token_get_manager(request: Request, token: TOKEN_SCHEME) -> User:
    if not token:
        raise invalidCredentials()
    
    currentUser = await get_user_auth_user(request, token)

    if not is_user_manager(currentUser):
        raise UserRBACError()
    
    return currentUser

GET_AUTHENTICATED_MANAGER = Annotated[User, Depends(token_get_manager)]
