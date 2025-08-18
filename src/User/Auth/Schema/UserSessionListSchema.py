from datetime import datetime
from typing import Self
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.Model.UserSession import Session
from src.Model.User import User

from src.User.Schema.UserResponseSchema import UserResponseSchema

class session(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    ip: str
    validUntil: datetime
    timestamp: datetime

class UserSessionListSchema(BaseModel):
    user: UserResponseSchema
    sessions: list[session]
