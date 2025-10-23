from src.Model.User import User
from src.Model.Manager import Manager
from src.Model.Driver import Driver
from src.Validator.UserValidator import validate_uuid

from src.Schema.User.UserRoleEnum import UserRole

from uuid import UUID

def create(userModel: User) -> User:
    """ Cria um usuário """
    userModel.save(force_insert=True)
    return userModel


def find_by_id(id: str) -> User | None:
    """ Retorna um usuário pelo seu ID """
    return User.select().where(User.id == id).first()

def find_by_email(email: str) -> User | None:
    """ Retorna um usuário pelo seu email """
    return User.select().where(User.email == email).first()

def find_by_cpf(cpf: str) -> User:
    """ Retorna um usuário pelo seu CPF """
    return User.get(User.cpf == cpf)

def find_all_with_page(pageNumber: int= 0, pageSize: int = 25) -> 'list[User]':
    """ Retorna uma lista de usuários pelo pageNumber que se divide pelo pageSize """
    return (User.select()
                .order_by(User.id.asc())
                .paginate(pageNumber, pageSize))


def update_user_by_id_ignore_none(userId: str, **args) -> User | None:
    """ Atualiza uma viagem ignorando valores nulos """

    filteredArgs = [x for x in args if x is not None]

    query = User.update(filteredArgs).where(User.id == userId)
    query.execute()

    return User.select().where(User.id == userId).first()

def update_user_by_id(userId: str, **args) -> User | None:
    """ Atualiza uma viagem """

    query = User.update(args).where(User.id == userId)
    query.execute()

    return User.select().where(User.id == userId).first()


def create_role_by_user_id(userId: str, role: UserRole) -> None:
    """ Cria a coluna auxiliar para o cargo respectivo """
    if role == UserRole.USER:
        return
    
    if role == UserRole.DRIVER:
        if Driver.select().where(Driver.id == userId).first() is not None:
            return
        Driver.create(id=userId, em_viagem=False)

    if role == UserRole.MANAGER:
        if Manager.select().where(Manager.id == userId).first() is not None:
            return
        Manager.create(id=userId)
    
def delete_by_id(id: str) -> None:
    """ Excluí um usuário pelo seu ID """
    User.delete_by_id(id)

def delete_all() -> None:
    """ Excluí todos usuários cadastrados (usar apenas em testes) """
    User.select().delete()


def exists_by_id(id: int) -> bool:
    """ Verifica se um usuário existe pelo seu ID """
    return User.select().where(User.id == id).exists()

def exists_by_email(email: str) -> bool:
    """ Verifica se um usuário existe pelo seu e-mail """
    return User.select().where(User.email == email).exists()

def exists_by_phone_number(phone_number: str) -> bool:
    """ Verifica se um usuário existe pelo seu número de telefone """
    return User.select().where(User.telefone == phone_number).exists()

def exists_by_cpf(cpf: str) -> bool:
    """ Verifica se um usuário existe pelo seu CPF """
    return User.select().where(User.cpf == cpf).exists()


def count() -> int:
    """ Retorna a quantidade de usuários cadastrados """
    return User.select().count()
