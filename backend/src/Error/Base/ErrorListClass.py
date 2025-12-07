from src.Error.Base.ErrorClass import ErrorClass

class ErrorListClass(ErrorClass):
    def __init__(self, errors: list[dict], statusCode: int, error: str = "multiple_errors", userMessage: str = f"Erro na validação dos campos 'erros'") -> None:
        self.errors = errors

        super().__init__(error, userMessage, statusCode, None, {"erros": self.errors})
