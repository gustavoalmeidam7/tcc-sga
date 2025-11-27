from uuid import UUID

from src.Validator.GenericValidator import validate_uuid
from src.Model.User import User

from src.Model.UserSession import Session

from typing import List
from uuid import UUID

def find_all() -> List[Session]:
    """ Retorna todas as sessões """
    return list(Session.select())

def find_all_by_user(user: User) -> list[Session]:
    """ Retorna todas sessões de um usuário  """
    return list(Session.select().where(Session.usuario == user.id))

def find_by_id(id: UUID) -> Session | None:
    """ Procuta sessão pelo id da mesma, se não for encontrada retorna None """
    return Session.select().where(Session.id == validate_uuid(id)).first()

def find_session_by_session_id(id: str | UUID) -> Session | None:
    """ Retorna uma sessão pela sessão do mesmo """
    if type(id) == UUID:
        id = validate_uuid(id)
    
    session = Session.select().where(Session.id == id).first()
    if session is None:
        return None

    return session

def find_user_by_session_id(id: str | UUID) -> User | None:
    """ Retorna o usuário pela sessão do mesmo """
    if type(id) == UUID:
        id = validate_uuid(id)
    
    userModel = Session.select().where(Session.id == id).first()
    if userModel is None:
        return None
    
    userModel = userModel.usuario
    
    return userModel

def insert_session(session: Session) -> None:
    """ Insere uma sessão no banco de dados """
    session.save(force_insert=True)

def delete_token_by_id(token: UUID) -> None:
    """ Deleta uma sessão pelo seu ID """
    Session.delete_by_id(validate_uuid(token))

def delete_all_user_tokens_by_id(id: int) -> None:
    """ Deleta todas sessões associadas a um usuário pelo seu ID """
    Session.delete().where(Session.usuario == id).execute()
