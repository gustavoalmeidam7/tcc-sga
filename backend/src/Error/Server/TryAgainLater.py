from src.Error.Base.ErrorClass import ErrorClass, status

from typing import Any, Mapping

class TryAgainLater(ErrorClass):
    def __init__(self, customMessage: str = "Erro interno no servidor, tente novamente mais tarde!") -> None:
        super().__init__("try_again", customMessage, status.HTTP_500_INTERNAL_SERVER_ERROR, None, None)
