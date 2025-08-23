from datetime import datetime, timedelta
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.User.Schema.UserResponseSchema import UserResponseSchema

class session(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    ip: str = "192.168.1.125"
    validUntil: datetime = datetime.now() + timedelta(minutes=30)
    timestamp: datetime = datetime.now()

class UserSessionListSchema(BaseModel):
    user: UserResponseSchema
    sessions: list[session]
