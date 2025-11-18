from fastapi import status

class NotFoundError(Exception):
    def __init__(self, resouce: str) -> None:
        self.statusCode = status.HTTP_404_NOT_FOUND
        self.error = "recurso_nao_encontrado"
        self.userMessage = f"O recurso {resouce} não foi encontrado."
        
        self.resource = resouce
        
        super().__init__(self.error, self.userMessage)
