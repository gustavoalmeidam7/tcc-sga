from pydantic import Field, EmailStr
from src.Schema.BaseModel import BaseModel

from src.Schema.User.UserRoleEnum import UserRole

from typing import Annotated
from datetime import date
import uuid

class UserUpdateResponseSchema(BaseModel):
    id        : Annotated[uuid.UUID,Field()]              = uuid.uuid4()
    email     : Annotated[EmailStr, Field(max_length=45)] = "ronaldo@mail.com"
    nome      : Annotated[str,      Field(max_length=50)] = "Ronaldo de Assis Moreira"
    telefone  : Annotated[str,      Field(max_length=12)] = "51991234567"
    cargo     : Annotated[int,      Field()]              = UserRole.USER
