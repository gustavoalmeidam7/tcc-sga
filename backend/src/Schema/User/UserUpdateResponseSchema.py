from pydantic import Field, EmailStr
from src.Schema.BaseModel import BaseModel

from src.Schema.User.UserRoleEnum import UserRole

from typing import Annotated
from uuid import uuid4, UUID

class UserUpdateResponseSchema(BaseModel):
    id        : Annotated[UUID,     Field(example=uuid4)]
    email     : Annotated[EmailStr, Field(example="ronaldo@mail.com", max_length=45)]
    nome      : Annotated[str,      Field(example="Ronaldo de Assis Moreira", max_length=50)]
    telefone  : Annotated[str,      Field(example="51991234567", max_length=12)]
