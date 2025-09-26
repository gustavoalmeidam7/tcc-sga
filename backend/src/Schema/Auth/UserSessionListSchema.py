from datetime import datetime, timedelta
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.Schema.User.UserResponseSchema import UserResponseSchema

class session(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    ip: str = "192.168.1.125"
    valido_ate: datetime = datetime.now() + timedelta(minutes=30)
    criado_em: datetime = datetime.now()

class UserSessionListSchema(BaseModel):
    usuario: UserResponseSchema
    sessoes: list[session]
