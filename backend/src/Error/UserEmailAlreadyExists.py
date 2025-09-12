from src.Error.ErrorClass import ErrorClass

class UserEmailAlreadyExists(ErrorClass):
    def __init__(self) -> None:
        super().__init__([{"Email" : "Email já existe"}], 409)
