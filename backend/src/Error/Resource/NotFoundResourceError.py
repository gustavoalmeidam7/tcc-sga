from src.Error.Base.NotFoundError import NotFoundError

class NotFoundResource(NotFoundError):
    def __init__(self, resource: str, userMessage: str = "O recurso não foi encontrado.") -> None:
        super().__init__(resource, userMessage)
