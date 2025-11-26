from typing import Mapping
from src.Error.Base.ErrorClass import ErrorClass, status

class AlreadyExists(ErrorClass):
    def __init__(self, resource: str = "resource") -> None:
        super().__init__("resource_already_exists", f"O recurso {resource} já existe" , status.HTTP_400_BAD_REQUEST, None)
