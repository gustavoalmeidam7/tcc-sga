from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field, AfterValidator, EmailStr

from datetime import date

from src.User.Service.Utils import validate_birthday

class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int = 1
    username: Annotated[str, Field(max_length=35)] = "Ronaldo de Assis Moreira"
    birthday: Annotated[date, Field(), AfterValidator(validate_birthday)] = date(1980, 3, 21)
    email:    Annotated[EmailStr, Field(data="email", max_length=45)] = "ronaldo@mail.com"
