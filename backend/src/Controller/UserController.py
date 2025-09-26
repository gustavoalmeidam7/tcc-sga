from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema

from src.Decorators.UserDecorators import GET_AUTENTHICATED_USER

from src.Service import UserService

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

USER_ROUTER = APIRouter(
    prefix="/user",
    tags=["user"]
)

@USER_ROUTER.post("/")
async def create_user(user: UserCreateSchema) -> 'UserResponseSchema':
    return UserService.create(user)

@USER_ROUTER.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: GET_AUTENTHICATED_USER):
    UserService.delete_by_id(user.id) # type: ignore

@USER_ROUTER.patch("/")
async def update_user(user: GET_AUTENTHICATED_USER, userUpdate: UserCreateSchema):
    # CHANGEME: Função mocada
    return UserService.update_user(user, [])

@USER_ROUTER.get("/")
async def get_user(user: GET_AUTENTHICATED_USER) -> 'UserResponseSchema':
    return UserResponseSchema.model_validate(user)

@USER_ROUTER.get("/getusers")
async def get_users(user: GET_AUTENTHICATED_USER, page: int = 1, pagesize: int = 15) -> 'list[UserResponseSchema]':
    return UserService.find_all_page_dict(int(page), int(pagesize))

