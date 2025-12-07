from peewee import CharField, ForeignKeyField, DateTimeField, BooleanField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timedelta, timezone
from src.Model import User

from datetime import datetime

from src.Validator.UserValidator import generate_uuid

class Session(BaseModel):
    id         : str  | CharField       = CharField(default=generate_uuid, max_length=36, primary_key=True)
    usuario    : str  | ForeignKeyField = ForeignKeyField(User.User, backref="sessoes", null=False)
    ip         : str  | CharField       = CharField(max_length=39, null=False)
    refresh    : bool | BooleanField    = BooleanField(default=False, null=False)
    valido_ate : str  | DateTimeField   = DateTimeField(default=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat(), null=False)
    criado_em  : str  | DateTimeField   = DateTimeField(default=(datetime.now(timezone.utc)).isoformat(), null=False)

    @property
    def valido_ate_datetime(self) -> datetime:
        return datetime.fromisoformat(str(self.valido_ate))
    
    @property
    def valido_ate_iso_str(self) -> str:
        return str(self.valido_ate)
    
    @property
    def is_expired(self) -> bool:
        return bool(self.valido_ate_datetime.astimezone(timezone.utc) <= datetime.now(timezone.utc))
    
    @property
    def is_refresh(self):
        return bool(self.refresh)
    
    def ip_equals(self, ip: str) -> bool:
        return bool(self.ip == ip)

    class Meta:
        table_name = "sessao"
