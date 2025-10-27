from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field, AfterValidator, EmailStr

from datetime import date

from src.Schema.User.UserRoleEnum import UserRole

from src.Validator import UserValidator
from uuid import UUID

class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id:         Annotated[UUID,     Field(example=UserValidator.generate_uuid())]
    nome:       Annotated[str,      Field(example="Ronaldo de Assis Moreira", max_length=35)]
    nascimento: Annotated[date,     Field(example=date(1980, 3, 21)), AfterValidator(UserValidator.validate_birthday)]
    email:      Annotated[EmailStr, Field(example="ronaldo@mail.com", max_length=45)]
    cargo:      Annotated[int,      Field(example=UserRole.USER)]
