from fastapi import APIRouter, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from slowapi.util import get_remote_address

from typing import Annotated

from src.Schema.User.UserResponseSchema import UserResponseSchema

from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema
from src.Schema.Auth.TokenResponseSchema import TokenResponseSchema

from src.Service.SessionService import TOKEN_SCHEME
from src.Service.SessionService import SessionService

sessionService = SessionService()

AUTH_ROUTER = APIRouter(
    prefix="/token",
    tags=[
        "Token"
    ]
)

@AUTH_ROUTER.get("/user")
async def test_token(token: TOKEN_SCHEME) -> UserResponseSchema:
    return sessionService.get_current_user(token)

@AUTH_ROUTER.post("/revoke", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_token(token: TOKEN_SCHEME, token_to_revoke: RevokeSessionSchema) -> None:
    sessionService.revoke_session(token, token_to_revoke)

@AUTH_ROUTER.get("/sessions")
async def retrive_sessions(token: TOKEN_SCHEME) -> UserSessionListSchema:
    return sessionService.get_user_sessions(token)

@AUTH_ROUTER.post("/", status_code=status.HTTP_201_CREATED)
async def generate_token(request: Request, formdata: Annotated[OAuth2PasswordRequestForm, Depends()]) -> TokenResponseSchema:
    userIP = get_remote_address(request)

    session = sessionService.create_session(
        formdata.username, formdata.password, userIP
    )

    token = sessionService.generate_jwt_token(session.id)

    return TokenResponseSchema.model_validate({"access_token": token, "token_type": "bearer"})
