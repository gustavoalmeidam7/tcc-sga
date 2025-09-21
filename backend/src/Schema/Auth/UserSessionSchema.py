from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

from src.Schema.User.UserResponseSchema import UserResponseSchema

class UserSessionListSchema(BaseModel):
    user: UserResponseSchema
    id: UUID
    ip: str
    valido_ate: datetime
    criado_em: datetime
