from peewee import UUIDField, CharField, ForeignKeyField, DateTimeField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timedelta, timezone
from src.Model.User import User

import uuid

class Session(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    user = ForeignKeyField(User, backref="sessions")
    ip = CharField(max_length=39)
    validUntil = DateTimeField(default=datetime.now(timezone.utc) + timedelta(minutes=30))
    timestamp = DateTimeField(default=datetime.now(timezone.utc))

    class Meta:
        table_name = "session"
