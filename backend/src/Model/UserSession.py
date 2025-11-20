from peewee import CharField, ForeignKeyField, DateTimeField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timedelta, timezone
from src.Model import User

from datetime import datetime

from src.Validator.UserValidator import generate_uuid

class Session(BaseModel):
    id         : str | CharField = CharField(default=generate_uuid, max_length=36, primary_key=True)
    usuario    : str | ForeignKeyField = ForeignKeyField(User.User, backref="sessoes", null=False)
    ip         : str | CharField = CharField(max_length=39, null=False)
    valido_ate : str | DateTimeField = DateTimeField(default=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat(), null=False)
    criado_em  : str | DateTimeField = DateTimeField(default=(datetime.now(timezone.utc)).isoformat(), null=False)

    @property
    def valido_ate_datetime(self) -> datetime:
        return datetime.fromisoformat(str(self.valido_ate))
    
    @property
    def valido_ate_iso_str(self) -> str:
        return str(self.valido_ate)

    class Meta:
        table_name = "sessao"
