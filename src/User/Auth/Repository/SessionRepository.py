from uuid import UUID

from src.Model.UserSession import Session
from src.Model.User import User

from src.Utils.singleton import singleton

from src.Model.UserSession import Session

from typing import List
from uuid import UUID

class SessionRepository(metaclass=singleton):
    def find_all(self) -> List[Session]:
        return list(Session.select())
    
    def find_all_by_user(self, user: User) -> list[Session]:
        return list(Session.select().where(Session.user == user.id))

    def find_by_id(self, id: UUID) -> Session | None:
        """ Procuta sessão pelo id da mesma, se não for encontrada retorna None """
        return Session.select().where(Session.id == id).first()

    def insert_session(self, session: Session) -> Session | None:
        session = session.save(force_insert=True)
        return session
    
    def delete_token_by_id(self, token: UUID) -> None:
        Session.delete_by_id(token)
