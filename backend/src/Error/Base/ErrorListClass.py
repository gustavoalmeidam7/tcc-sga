from fastapi import status

class ErrorListClass(Exception):
    def __init__(self, errors: list[dict], statusCode: int) -> None:
        self.statusCode = statusCode
        self.errors = errors
        super().__init__(errors)
