from src.Error.Base.ErrorClass import ErrorClass
from fastapi import status

class UserRBACError(ErrorClass):
    def __init__(self, customMessage: str = "O usuário não possui acesso a este recurso.") -> None:
        super().__init__("user_dont_have_access", customMessage, status.HTTP_403_FORBIDDEN)
