from typing import Annotated
from fastapi import APIRouter, Header

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema

from src.Service.UserService import UserService

userService = UserService()

USER_ROUTER = APIRouter(
    prefix="/user",
    tags=["user"]
)

@USER_ROUTER.post("/create")
async def create_user(user: UserCreateSchema) -> 'UserResponseSchema':
    user = userService.create(user)

    return user

@USER_ROUTER.get("/getusers")
async def get_users(page: int = 1, pagesize: int = 15) -> 'list[UserResponseSchema]':
    return userService.find_all_page_dict(int(page), int(pagesize))

