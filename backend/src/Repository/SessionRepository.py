from uuid import UUID

from src.Model.UserSession import Session
from src.Model.User import User

from src.Model.UserSession import Session

from typing import List
from uuid import UUID

def find_all() -> List[Session]:
    """ Retorna todas as sessões """
    return list(Session.select())

def find_all_by_user(user: User) -> list[Session]:
    """ Retorna todas sessões de um usuário  """
    return list(Session.select().where(Session.user == user.id))

def find_by_id(id: UUID) -> Session | None:
    """ Procuta sessão pelo id da mesma, se não for encontrada retorna None """
    return Session.select().where(Session.id == id).first()

def insert_session(session: Session) -> Session | None:
    """ Insere uma sessão no banco de dados """
    session = session.save(force_insert=True)
    return session

def delete_token_by_id(token: UUID) -> None:
    """ Deleta uma sessão pelo seu ID """
    Session.delete_by_id(token)

def delete_all_user_tokens_by_id(id: int) -> None:
    """ Deleta todas sessões associadas a um usuário pelo seu ID """
    Session.delete().where(Session.user == id).execute()
