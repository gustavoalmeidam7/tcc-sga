from fastapi import status
from typing import Mapping, Any

class ErrorClass(Exception):
    def __init__(self, error: str, userMessage: str, statusCode: int, headers: Mapping[str, str] | None = None, additionalField: dict[str, Any] | None = None) -> None:
        self.statusCode = statusCode
        self.error = error
        self.userMessage = userMessage

        self.headers = headers
        self.additionalField = additionalField

        self.jsonObject = {
            "erro": self.error,
            "mensagem": self.userMessage,
        }

        if self.additionalField:
            self.jsonObject.update(self.additionalField)

        super().__init__(error, userMessage)
