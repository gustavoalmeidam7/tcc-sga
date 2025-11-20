from src.Error.Base.ErrorClass import ErrorClass, status

class InternalServerError(ErrorClass):
    def __init__(self, customMessage: str = "Erro interno no servidor.") -> None:
        super().__init__("internal_error", customMessage, status.HTTP_500_INTERNAL_SERVER_ERROR)
