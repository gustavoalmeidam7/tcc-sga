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
    return UserService.create(user)

@USER_ROUTER.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: GET_AUTHENTICATED_USER) -> None:
    UserService.delete_by_id(user.id)

@USER_ROUTER.patch("/")
async def update_user(user: GET_AUTHENTICATED_USER, userUpdate: UserUpdateSchema) -> UserUpdateResponseSchema:
    return UserService.update_user(user, userUpdate)

@USER_ROUTER.get("/")
async def get_user(user: GET_AUTHENTICATED_USER) -> UserResponseFullSchema:
    return UserResponseFullSchema.model_validate(user)

@USER_ROUTER.get("/getusers")
async def get_users(user: GET_AUTHENTICATED_DRIVER_OR_HIGHER, page: int = 1, pagesize: int = 15) -> list[UserResponseSchema]:
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
    user = UserService.find_user_by_id(userId)
    if user is None:
        raise USER_NOT_FOUND_EXCEPTION
    
    return user
