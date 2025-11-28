from typing import Annotated
from fastapi import APIRouter, Depends, status, Response
from fastapi.security import OAuth2PasswordBearer

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.User.UserUpdateSchema import UserUpdateSchema
from src.Schema.User.UserUpdateResponseSchema import UserUpdateResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema

from src.Decorators.UserDecorators import GET_AUTHENTICATED_USER
from src.Decorators.DriverDecorator import GET_AUTHENTICATED_DRIVER, GET_AUTHENTICATED_DRIVER_OR_HIGHER

from src.Error.Resource.NotFoundResourceError import NotFoundResource

from src.Service import UserService

from uuid import UUID

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

USER_ROUTER = APIRouter(
    prefix="/user",
    tags=["user"]
)

USER_NOT_FOUND_EXCEPTION = NotFoundResource("usuário", "O usuário não foi encontrado")

@USER_ROUTER.post("/", responses={
    status.HTTP_409_CONFLICT: {
        "description": "Conflito a o criar usuário",
        "content": {
            "application/json": {
                "example": {"Telefone" : "Número de telefone já existe", "CPF" : "CPF já existe"}
            }
        }
    }
})
async def create_user(user: UserCreateSchema) -> UserResponseFullSchema:
    """
    Cadastra um novo usuário:

    **parâmetro**: Body: \n
        `UserCreateSchema` \n
    **retorno**: devolve: \n
        `UserResponseFullSchema`
    """
    return UserService.create(user)

@USER_ROUTER.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: GET_AUTHENTICATED_USER) -> None:
    """
    Deleta a conta do usuário:

    **acesso**: `USER` \n
    **parâmetro**: Sem parâmetros\n
    **retorno**: 204 No content
    """
    UserService.delete_by_id(user.id)

@USER_ROUTER.patch("/")
async def update_user(user: GET_AUTHENTICATED_USER, userUpdate: UserUpdateSchema) -> UserUpdateResponseSchema:
    """
    Atualiza os dados cadastrais de um usuário:

    **acesso**: `USER` \n
    **parâmetro**: Body: \n
        `UserUpdateSchema` \n
    **retorno**: devolve: \n
        `UserUpdateSchema`
    """
    return UserService.update_user(user, userUpdate)

@USER_ROUTER.get("/")
async def get_user(user: GET_AUTHENTICATED_USER) -> UserResponseFullSchema:
    """
    Encontra as informações cadastrais de um usuário:

    **acesso**: `USER` \n
    **parâmetro**: Sem parâmetros\n
    **retorno**: devolve: \n
        `UserResponseFullSchema`
    """
    return UserResponseFullSchema.model_validate(user)

@USER_ROUTER.get("/getusers")
async def get_users(user: GET_AUTHENTICATED_DRIVER_OR_HIGHER, page: int = 1, pagesize: int = 15) -> list[UserResponseSchema]:
    """
    Encontra todos usuários com paginação:

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Query params:\n
        `page` \n
        `pagesize` \n
    **retorno**: devolve: \n
        `list[UserResponseSchema]`
    """
    return UserService.find_all_page_dict(int(page), int(pagesize))


@USER_ROUTER.get("/{userId}", responses={
    status.HTTP_404_NOT_FOUND: {
        "description": "Usuário não encontrado",
        "content": {
            "application/json": {
                "example": USER_NOT_FOUND_EXCEPTION.jsonObject
            }
        }
    }
})
async def get_user_by_id(user: GET_AUTHENTICATED_DRIVER_OR_HIGHER, userId: UUID) -> UserResponseFullSchema:
    """
    Encontra um usuário pelo seu id:

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Route params: \n
        `userId` \n
    **retorno**: devolve: \n
        `UserResponseFullSchema`
    """
    user = UserService.find_user_by_id(userId)
    if user is None:
        raise USER_NOT_FOUND_EXCEPTION
    
    return user
