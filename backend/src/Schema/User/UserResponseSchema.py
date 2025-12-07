from src.Schema.BaseModel import BaseModel

from typing import Annotated
from pydantic import Field, EmailStr

from datetime import date

from src.Schema.User.UserRoleEnum import UserRole

from src.Validator import UserValidator
from uuid import UUID

class UserResponseSchema(BaseModel):
    id:         Annotated[UUID,     Field(examples=[UserValidator.generate_uuid()])]
    nome:       Annotated[str,      Field(examples=["Ronaldo de Assis Moreira"])]
    nascimento: Annotated[date,     Field(examples=[date(1980, 3, 21)])]
    email:      Annotated[EmailStr, Field(examples=["ronaldo@mail.com"])]
    cargo:      Annotated[int,      Field(examples=[UserRole.USER])]
