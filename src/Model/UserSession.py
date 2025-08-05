from peewee import Model, UUIDField, CharField, ForeignKeyField, DateTimeField
from src.DB import db

from datetime import datetime, timedelta, timezone
from src.Model.User import User

import uuid

class Session(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    user = ForeignKeyField(User, backref="sessions")
    ip = CharField(max_length=39)
    validUntil = DateTimeField(default=datetime.now(timezone.utc))
    timestamp = DateTimeField(default=datetime.now(timezone.utc) + timedelta(minutes=30))

    class Meta:
        database = db
        table_name = "session"
