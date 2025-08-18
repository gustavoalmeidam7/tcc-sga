from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field, AfterValidator, EmailStr

from datetime import date

from src.User.Service.Utils import validate_birthday

class UserResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: Annotated[str, Field(max_length=35)]
    birthday: Annotated[date, Field(), AfterValidator(validate_birthday)]
    email:    Annotated[EmailStr, Field(data="email", max_length=45)]
