from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

from src.User.Schema.UserResponseSchema import UserResponseSchema

class UserSessionListSchema(BaseModel):
    user: UserResponseSchema
    id: UUID
    ip: str
    validUntil: datetime
    timestamp: datetime
