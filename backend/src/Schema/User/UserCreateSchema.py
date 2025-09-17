from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator, EmailStr
from datetime import date

from src.Model.User import User

from src.Validator.UserValidator import unmask_number, validate_birthday

class UserCreateSchema(BaseModel):
    username:      Annotated[str, Field(max_length=35)] = "Ronaldo de Assis Moreira"
    cpf:           Annotated[str, Field(max_length=11), AfterValidator(unmask_number)] = "12345678915"
    birthday:      Annotated[date, Field(), AfterValidator(validate_birthday)] = date(1980, 3, 21)
    email:         Annotated[EmailStr, Field(max_length=45)] = "ronaldo@mail.com"
    phone_number : Annotated[str, Field(max_length=14), AfterValidator(unmask_number)] = "51991234567"
    password:      Annotated[str, Field()] = "SenhaSegura123"

    def to_model(self) -> User:
        return User(
            nome=self.username,
            cpf=self.cpf,
            nascimento=self.birthday,
            email=self.email,
            telefone=self.phone_number,
            senha=self.password
        )
