from fastapi import status

class NotFoundError(Exception):
    def __init__(self, resource: str, userMessage: str = "O recurso não foi encontrado.") -> None:
        self.statusCode = status.HTTP_404_NOT_FOUND
        self.error = "resource_not_found"
        self.userMessage = userMessage

        self.resource = resource

        self.jsonObject = {
            "erro": self.error,
            "recurso": self.resource,
            "mensagem": self.userMessage
        }
        
        super().__init__(self.error, self.userMessage)
