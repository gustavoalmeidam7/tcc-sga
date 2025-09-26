from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field, AfterValidator, EmailStr

from datetime import date

from src.Validator.UserValidator import validate_birthday
from uuid import UUID

class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID = UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6")
    nome: Annotated[str, Field(max_length=35)] = "Ronaldo de Assis Moreira"
    nascimento: Annotated[date, Field(), AfterValidator(validate_birthday)] = date(1980, 3, 21)
    email:    Annotated[EmailStr, Field(max_length=45)] = "ronaldo@mail.com"
