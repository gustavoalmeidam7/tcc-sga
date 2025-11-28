from src.Schema.BaseModel import BaseModel, Field, Annotated

from pydantic import BeforeValidator

def validade_message(email: str) -> str:
    """ Auto generate message based on email """
    return f"Email enviado com sucesso a {email}."

class RestorePasswordResponseSchema(BaseModel):
    userMessage: Annotated[str, Field(examples=["Email enviado com sucesso a ronaldo@mail.com."]), BeforeValidator(validade_message)]
