from peewee import CharField, ForeignKeyField, DateTimeField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timedelta, timezone
from src.Model import User

import uuid

from src.Validator.UserValidator import validate_uuid

class Session(BaseModel):
    id         = CharField(max_length=32, default=validate_uuid(uuid.uuid4()), primary_key=True)
    usuario    = ForeignKeyField(User.User, backref="sessoes", null=False)
    ip         = CharField(max_length=39, null=False)
    valido_ate = DateTimeField(default=datetime.now(timezone.utc) + timedelta(minutes=30), null=False)
    criado_em  = DateTimeField(default=datetime.now(timezone.utc), null=False)

    class Meta:
        table_name = "sessao"
