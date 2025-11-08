from fastapi import status

class ErrorClass(Exception):
    def __init__(self, error: str, userMessage: str, statusCode: int) -> None:
        self.statusCode = statusCode
        self.error = error
        self.userMessage = userMessage
        super().__init__(error, userMessage)
