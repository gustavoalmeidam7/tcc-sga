from src.Schema.BaseModel import BaseModel

from typing import Annotated
from pydantic import Field, EmailStr

from datetime import datetime

from src.Schema.User.UserRoleEnum import UserRole

from src.Validator import UserValidator
from uuid import UUID

class UserResponseFullSchema(BaseModel):
    id          : Annotated[UUID,     Field(examples=[UserValidator.generate_uuid()])]
    nome        : Annotated[str,      Field(examples=["Ronaldo de Assis Moreira"])]
    nascimento  : Annotated[datetime, Field(examples=[datetime(1980, 3, 21)])]
    email       : Annotated[EmailStr, Field(examples=["ronaldo@mail.com"])]
    cpf         : Annotated[str,      Field(examples=["12345678910"])]
    telefone    : Annotated[str,      Field(examples=["1699542346785"])]
    cargo       : Annotated[int,      Field(examples=[UserRole.USER])]
