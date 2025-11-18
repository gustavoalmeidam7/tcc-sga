from fastapi import status
from typing import Mapping

class ErrorClass(Exception):
    def __init__(self, error: str, userMessage: str, statusCode: int, headers: Mapping[str, str] | None = None) -> None:
        self.statusCode = statusCode
        self.error = error
        self.userMessage = userMessage
        self.headers = headers
        super().__init__(error, userMessage)
