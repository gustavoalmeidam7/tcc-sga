from datetime import datetime
import re
import uuid
from typing import Any

class UserValidationResult:
    def __init__(self, errors: list[dict] = []):
        self.errors = errors or []

    def add_error(self, error: dict):
        self.errors.append(error)

    @property
    def is_valid(self) -> 'bool':
        return len(self.errors) == 0


class UserValidator:
    def __init__(self) -> None:
        self.userValidationResult = UserValidationResult()

    def validate(self, userModel: Any) -> 'UserValidationResult':
        self.is_email_unique(userModel.email)
        self.is_phone_number_unique(userModel.telefone)
        self.is_cpf_unique(userModel.cpf)

        return self.userValidationResult

    def is_email_unique(self, email: str) -> 'None':
        from src.Repository import UserRepository
        if UserRepository.exists_by_email(email):
            self.userValidationResult.errors.append({"Email" : "Email já existe"})

    def is_phone_number_unique(self, phone_number: str) -> 'None':
        from src.Repository import UserRepository
        if UserRepository.exists_by_phone_number(phone_number):
            self.userValidationResult.errors.append({"Telefone" : "Número de telefone já existe"})

    def is_cpf_unique(self, cpf: str) -> 'None':
        from src.Repository import UserRepository
        if UserRepository.exists_by_cpf(cpf):
            self.userValidationResult.errors.append({"CPF" : "CPF já existe"})

def phone_number_validator(number: str | int) -> str:
    if type(number) == int:
        number = str(number)
    
    return unmask_number(number)

def unmask_number(number: str) -> str:
    return re.sub(r"[^0-9]", "", number)

def validate_birthday(birthday: datetime) -> datetime:
    if birthday > datetime.today():
        raise ValueError("Data de nascimento deve ser antes de hoje")

    return birthday

def email_validator(email: str) -> str:
    return email

# TODO do a real validation with external tools
def validate_cpf(cpf: str) -> str:
    cpf = unmask_number(cpf)
    return cpf

def validate_uuid(uuid: uuid.UUID) -> str:
    """ Valida se uma string é um UUID válido """
    uuid_str = str(uuid).replace("-", "")
    return uuid_str

def generate_uuid() -> str:
    """ Gera um UUID válido em formato de string """
    return validate_uuid(uuid.uuid4())

def validate_password(password: str) -> str:
    """ Valida se a senha é valida para ser usada """
    if len(password) < 8:
        raise ValueError("A senha deve conter no mínimo 8 caracteres")

    return password
