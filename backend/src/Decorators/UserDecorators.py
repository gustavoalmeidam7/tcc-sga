from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Model.UserSession import Session
from src.Decorators import get_user_auth_user, get_user_auth_session, get_user_auth_session_or_none

async def token_get_user(request: Request, token: TOKEN_SCHEME) -> User:
    return await get_user_auth_user(request, token)

async def get_user_session(request: Request, token: TOKEN_SCHEME) -> Session:
    return await get_user_auth_session(request, token)

async def get_user_session_or_none(request: Request, token: TOKEN_SCHEME) -> Session | None:
    return await get_user_auth_session_or_none(request, token)

GET_AUTHENTICATED_USER = Annotated[User, Depends(token_get_user)]
GET_AUTHENTICATED_SESSION = Annotated[Session, Depends(get_user_session)]
GET_AUTHENTICATED_SESSION_OR_NONE = Annotated[Session | None, Depends(get_user_session_or_none)]