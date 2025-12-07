from pydantic import Field, EmailStr

from src.Schema.User.UserRoleEnum import UserRole
from src.Schema.BaseModel import BaseModel
from src.Validator.UserValidator import email_validator, phone_number_validator
from typing import Annotated

class UserUpdateSchema(BaseModel):
    email     : Annotated[
        EmailStr,
        Field(max_length=45, example="ronaldo@mail.com"),
        email_validator
    ]

    nome      : Annotated[
        str,
        Field(max_length=50, example="Ronaldo de Assis Moreira")
    ]

    telefone  : Annotated[
        str,
        Field(max_length=12, example="51991234567"),
        phone_number_validator
    ]
