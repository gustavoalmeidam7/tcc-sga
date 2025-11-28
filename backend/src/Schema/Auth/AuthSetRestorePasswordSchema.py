from src.Schema.BaseModel import BaseModel, Field, Annotated

from pydantic import BeforeValidator

from uuid import UUID

from src.Validator.UserValidator import validate_password

class AuthSetRestorePasswordSchema(BaseModel):
    restoreCode: Annotated[UUID, Field(examples=[])]
    newPassword: Annotated[str, Field(examples=[]), BeforeValidator(validate_password)]
