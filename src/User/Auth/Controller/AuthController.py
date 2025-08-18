from fastapi import APIRouter, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from slowapi.util import get_remote_address

from typing import Annotated

from src.User.Schema import UserResponseSchema
from src.User.Auth.Schema.UserSessionListSchema import UserSessionListSchema
from src.User.Auth.Service.SessionService import TOKEN_SCHEME
from src.User.Auth.Service.SessionService import SessionService

sessionService = SessionService()

AUTH_ROUTER = APIRouter(
    prefix="/token",
    tags=[
        "Token"
    ]
)

# TODO See later why returning 'UserResponseSchema' raises a error
@AUTH_ROUTER.get("/test")
def test_token(token: TOKEN_SCHEME):
    return sessionService.get_current_user(token)

@AUTH_ROUTER.get("/sessions")
def retrive_sessions(token: TOKEN_SCHEME) -> UserSessionListSchema:
    return sessionService.get_user_sessions(token)

# TODO Move logic to service and give a proper schema
@AUTH_ROUTER.post("/", status_code=status.HTTP_201_CREATED)
def generate_token(request: Request, formdata: Annotated[OAuth2PasswordRequestForm, Depends()]) -> dict:
    userIP = get_remote_address(request)
    
    session = sessionService.create_session(
        userMail=formdata.username, userPassword=formdata.password, userIP=userIP
    )

    token = sessionService.generate_jwt_token(session.id)

    return {"access_token": token, "token_type": "bearer"}
