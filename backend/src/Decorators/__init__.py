from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from src.Error.User.UserInvalidCredentials import invalidCredentials

from slowapi.util import get_remote_address

from typing import Annotated

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token", auto_error=False))]

from src.Model.User import User
from src.Service import SessionService

async def get_user_auth_user(request: Request, token: TOKEN_SCHEME) -> User:
    """ Pega o usuário autenticado """

    userIP = get_remote_address(request)

    if not token:
        raise invalidCredentials()
    
    currentSession = SessionService.get_current_session_by_token(token)
    currentUser    = SessionService.get_current_user(token)

    if not currentSession.ip_equals(userIP):
        raise invalidCredentials()
    
    if currentSession.is_expired:
        raise invalidCredentials()

    if currentUser is None:
        raise invalidCredentials()
    
    return currentUser