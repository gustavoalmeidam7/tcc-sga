from src.Model.User import User
from src.Repository.UserRepository import UserRepository

class UserValidationResult:
    def __init__(self, errors: list[dict] = None):
        self.errors = errors or []

    def add_error(self, error: dict):
        self.errors.append(error)

    @property
    def is_valid(self) -> 'bool':
        return len(self.errors) == 0


class UserValidator:
    def __init__(self) -> None:
        self.userValidationResult = UserValidationResult()
        self.userRepository = UserRepository()

    def validate(self, userModel: User) -> 'UserValidationResult':
        self.is_email_unique(userModel.email)
        self.is_phone_number_unique(userModel.phone_number)
        self.is_cpf_unique(userModel.cpf)

        return self.userValidationResult

    def is_email_unique(self, email: str) -> 'None':
        if self.userRepository.exists_by_email(email):
            self.userValidationResult.errors.append({"Email" : "Email já existe"})

    def is_phone_number_unique(self, phone_number: str) -> 'str':
        if self.userRepository.exists_by_phone_number(phone_number):
            self.userValidationResult.errors.append({"Telefone" : "Número de telefone já existe"})

    def is_cpf_unique(self, cpf: str) -> 'str':
        if self.userRepository.exists_by_cpf(cpf):
            self.userValidationResult.errors.append({"CPF" : "CPF já existe"})
