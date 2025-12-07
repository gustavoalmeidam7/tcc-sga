from pydantic import BaseModel

from uuid import UUID

class RevokeSessionSchema(BaseModel):
    id_sessao: UUID
