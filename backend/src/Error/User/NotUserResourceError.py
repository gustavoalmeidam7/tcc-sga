from src.Error.Base.ErrorClass import ErrorClass
from fastapi import status

class NotUserResource(ErrorClass):
    def __init__(self, customMessage: str = "O usuário não pode alterar este recurso.") -> None:
        super().__init__("not_user_resource", customMessage, status.HTTP_403_FORBIDDEN)
