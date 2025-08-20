from pydantic import BaseModel

from uuid import UUID

class RevokeSessionSchema(BaseModel):
    session_id: UUID
