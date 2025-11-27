from src.Schema.BaseModel import BaseModel, Field

from pydantic import EmailStr

from typing import Annotated

class UserRestorePasswordSchema(BaseModel):
    userEmail : Annotated[EmailStr, Field(examples=["ronaldo@mail.com"])]
