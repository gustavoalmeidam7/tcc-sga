from typing import Annotated
from pydantic import BaseModel, Field, BeforeValidator, EmailStr, ConfigDict, PastDate
from datetime import datetime

from src.Validator.UserValidator import unmask_number

class UserCreateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nome       : Annotated[str,          Field(examples=["Ronaldo de Assis Moreira"], max_length=50)]
    cpf        : Annotated[str,          Field(examples=["12345678915"], max_length=11, min_length=11), BeforeValidator(unmask_number)]
    nascimento : Annotated[PastDate,     Field(examples=[datetime(1980, 3, 21)])]
    email      : Annotated[EmailStr,     Field(examples=["ronaldo@mail.com"], max_length=100)]
    telefone   : Annotated[str,          Field(examples=["51991234567"], min_length=11, max_length=12), BeforeValidator(unmask_number)]
    senha      : Annotated[str,          Field(examples=["SenhaSegura123"], min_length=8)]
