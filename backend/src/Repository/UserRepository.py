from src.Model.User import User
from src.Validator.UserValidator import validate_uuid
from uuid import UUID

def create(userModel: User) -> User:
    """ Cria um usuário """
    userModel.save(force_insert=True)
    return userModel


def find_by_id(id: int) -> User:
    """ Retorna um usuário pelo seu ID """
    return User.get(User.id == id)

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


def update(userModel: User) -> None:
    """ Atualiza um usuário pelo modelo"""
    User.update(username=userModel.nome, email=userModel.email, phone_number=userModel.telefone, password=userModel.senha).where(User.id == userModel.id)

def update_by_id(id: UUID, userModel: User) -> User:
    """ Atualiza um usuário pelo ID """
    # TODO: Adicionar validação dos campos
    id = validate_uuid(id)
    query = User.update(
        nome=userModel.nome,
        email=userModel.email,
        telefone=userModel.telefone,
        cargo=userModel.cargo
    ).where(
        User.id == id
    )
    query.execute()
    return userModel

def delete_by_id(id: int) -> None:
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
