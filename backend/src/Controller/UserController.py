from typing import Annotated, Any
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema

from src.Decorators.UserDecorators import token_get_user
from src.Model.User import User

from src.Service import UserService

TOKEN_SCHEME = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]

USER_ROUTER = APIRouter(
    prefix="/user",
    tags=["user"]
)

@USER_ROUTER.post("/")
async def create_user(user: UserCreateSchema) -> 'UserResponseSchema':
    user = UserService.create(user)

    return user

@USER_ROUTER.delete("/")
async def delete_user(token: TOKEN_SCHEME):
    pass

# Change reponse schema to response patch schema and create schema to patch schema
@USER_ROUTER.patch("/")
async def update_user(token: TOKEN_SCHEME, userUpdate: UserCreateSchema):
    pass

@USER_ROUTER.get("/")
async def get_user(user: Annotated[Any, Depends(token_get_user)]) -> 'UserResponseSchema':
    return UserResponseSchema.model_validate(user)

@USER_ROUTER.get("/getusers")
async def get_users(page: int = 1, pagesize: int = 15) -> 'list[UserResponseSchema]':
    return UserService.find_all_page_dict(int(page), int(pagesize))

