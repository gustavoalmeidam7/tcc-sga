from src.Error.Base.ErrorClass import ErrorClass, status

class UserEmailAlreadyExists(ErrorClass):
    def __init__(self) -> None:
        super().__init__("Email já existe", "O email já foi usado para criar outra conta", status.HTTP_400_BAD_REQUEST)
