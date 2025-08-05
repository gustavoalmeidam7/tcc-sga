from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator, EmailStr
from datetime import date

from src.Model.User import User

from src.User.Service.Utils import unmask_number, validate_birthday

class UserCreateSchema(BaseModel):
    username:      Annotated[str, Field(max_length=35)]
    cpf:           Annotated[str, Field(max_length=11), AfterValidator(unmask_number)]
    birthday:      Annotated[date, Field(), AfterValidator(validate_birthday)]
    email:         Annotated[EmailStr, Field(data="email", max_length=45)]
    phone_number : Annotated[str, Field(data="phone_number", max_length=14), AfterValidator(unmask_number)]
    password:      Annotated[str, Field()]

    def to_model(self) -> User:
        return User(
            username=self.username,
            cpf=self.cpf,
            birthday=self.birthday,
            email=self.email,
            phone_number=self.phone_number,
            password=self.password
        )
