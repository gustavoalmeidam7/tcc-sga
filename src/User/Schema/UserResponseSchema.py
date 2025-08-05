from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator, EmailStr

from datetime import date

from src.User.Service.Utils import validate_birthday

from src.Model.User import User

class UserResponseSchema(BaseModel):
    id: int
    username: Annotated[str, Field(max_length=35)]
    birthday: Annotated[date, Field(), AfterValidator(validate_birthday)]
    email:    Annotated[EmailStr, Field(data="email", max_length=45)]

    @staticmethod
    def from_user_model(user: User) -> 'UserResponseSchema':
        return UserResponseSchema(
            id=user.id,
            username=user.username,
            birthday=user.birthday,
            email=user.email
        )
