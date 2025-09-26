from typing import Annotated
from pydantic import BaseModel, Field, AfterValidator, EmailStr, ConfigDict
from datetime import date

from src.Validator.UserValidator import unmask_number, validate_birthday

class UserCreateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nome:       Annotated[str,      Field(max_length=50)]                                = "Ronaldo de Assis Moreira"
    cpf:        Annotated[str,      Field(max_length=11), AfterValidator(unmask_number)] = "12345678915"
    nascimento: Annotated[date,     Field(), AfterValidator(validate_birthday)]          = date(1980, 3, 21)
    email:      Annotated[EmailStr, Field(max_length=100)]                               = "ronaldo@mail.com"
    telefone :  Annotated[str,      Field(max_length=12), AfterValidator(unmask_number)] = "51991234567"
    senha:      Annotated[str,      Field()]                                             = "SenhaSegura123"
