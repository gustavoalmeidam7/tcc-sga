from src.Error.Base.ErrorClass import ErrorClass, status
from typing import Mapping

class invalidCredentials(ErrorClass):
    def __init__(self, userMessage: str = "Não foi possível validar as credenciais de usuário, tente entrar novamente") -> None:
        super().__init__("invalid_credentials", userMessage, status.HTTP_401_UNAUTHORIZED, headers={"WWW-Authenticate": "Bearer"})
