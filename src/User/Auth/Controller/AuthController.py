from fastapi import APIRouter, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from slowapi.util import get_remote_address

from typing import Annotated

from src.User.Auth.Service.SessionService import OAUTH2_SCHEME
from src.User.Auth.Service.SessionService import SessionService, SessionRepository

sessionService = SessionService()

AUTH_ROUTER = APIRouter(
    prefix="/token",
    tags=[
        "Token"
    ]
)

@AUTH_ROUTER.get("/test-token")
def test_token(token: Annotated[str, Depends(OAUTH2_SCHEME)]):
    return sessionService.get_current_user(token)

@AUTH_ROUTER.post("/", status_code=status.HTTP_201_CREATED)
def generate_token(request: Request, formdata: Annotated[OAuth2PasswordRequestForm, Depends()]) -> dict:
    userIP = get_remote_address(request)
    
    session = sessionService.create_session(
        userMail=formdata.username, userPassword=formdata.password, userIP=userIP
    )

    token = sessionService.generate_jwt_token(session.id)

    return {"access_token": token, "token_type": "bearer"}

@AUTH_ROUTER.get("/all")
def get_all():
    return SessionRepository().find_all()
