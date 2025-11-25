from fastapi import APIRouter, status, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from typing import Annotated

from src.Schema.User.UserResponseSchema import UserResponseSchema

from src.Schema.Auth.RevokeSessionSchema import RevokeSessionSchema
from src.Schema.Auth.UserSessionListSchema import UserSessionListSchema
from src.Schema.Auth.TokenResponseSchema import TokenResponseSchema

from src.Service.SessionService import TOKEN_SCHEME
from src.Service import SessionService

from src.Decorators import UserDecorators

AUTH_ROUTER = APIRouter(
    prefix="/token",
    tags=[
        "Token"
    ]
)

OAUTH2_FORM = Annotated[OAuth2PasswordRequestForm, Depends()]

@AUTH_ROUTER.post("/revoke", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_token(user: UserDecorators.GET_AUTHENTICATED_USER, token: TOKEN_SCHEME, token_to_revoke: RevokeSessionSchema) -> None:
    """
    Revoga uma sessão de acesso pelo seu ID:

    **acesso**: `USER` \n
    **parâmetro**: Body: \n
        `RevokeSessionSchema` \n
    **retorno**: 204 No Content
    """
    SessionService.revoke_session(token, token_to_revoke)

@AUTH_ROUTER.get("/sessions")
async def retrieve_sessions(user: UserDecorators.GET_AUTHENTICATED_USER, token: TOKEN_SCHEME) -> UserSessionListSchema:
    """
    Encontra todas sessões do usuário atual:

    **acesso**: `USER` \n
    **parâmetro**: Sem parâmetros \n
    **retorno**: devolve: \n
        `UserSessionListSchema`
    """
    return SessionService.get_user_sessions(token)

@AUTH_ROUTER.post("/", responses={
    status.HTTP_200_OK: {
        "description": "Token criado com sucesso",
        "content": {
            "application/json": {
                "example": TokenResponseSchema.model_json_schema()
            }
        }
    }
})
async def generate_token(request: Request, formdata: OAUTH2_FORM) -> Response:
    """
    Cria uma nova sessão de autenticação de usuário:

    **acesso**: `DRIVER` \n
    **parâmetro**: Formdata: \n
        `username` \n
        `password` \n
    **retorno**: devolve: \n
        `TokenResponseSchema`
    """

    # userIP = get_remote_address(request)

    # session = SessionService.create_session(
    #     formdata.username, formdata.password, userIP
    # )

    # token = SessionService.encode_jwt_token(session.id)

    # return TokenResponseSchema.model_validate({"access_token": token, "token_type": "bearer"})

    return SessionService.generate_access_token(request, formdata)

@AUTH_ROUTER.post("/refresh-token", responses={
    status.HTTP_200_OK: {
        "description": "Token criado com sucesso",
        "content": {
            "application/json": {
                "example": TokenResponseSchema.model_json_schema()
            }
        }
    }
})
async def refresh_token(request: Request) -> Response:
    """
    Realiza a atualização do token de acesso do atual usuário pelo seu refresh token:

    **acesso**: `USER` \n
    **parâmetro**:No Params \n
    **retorno**: devolve: \n
        `TokenResponseSchema`
    """

    return SessionService.refresh_access_token(request)
