from uuid import UUID
from src.Model.UserSession import Session

from src.Utils.singleton import singleton

from typing import List
from uuid import UUID

class SessionRepository(metaclass=singleton):
    def find_all(self) -> List[Session]:
        return list(Session.select())

    def find_by_id(self, id: UUID) -> Session | None:
        return Session.get_by_id(id)

    def insert_session(self, session: Session) -> Session | None:
        session = session.save(force_insert=True)
        return session
