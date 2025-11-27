from src.Model.BaseModel import BaseModel

from peewee import CharField, DateTimeField, ForeignKeyField

from uuid import UUID
from datetime import datetime, timedelta, timezone

from src.Validator.GenericValidator import generate_uuid

from src.Model.User import User

class RestorePassword(BaseModel):
    id         : UUID     | CharField       = CharField(default=generate_uuid, max_length=36, primary_key=True)
    usuario    : User     | ForeignKeyField = ForeignKeyField(model=User, backref="restore_password", on_delete="CASCADE")
    valido_ate : datetime | DateTimeField   = DateTimeField(null=False, default=(datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat())

    @property
    def valido_ate_datetime(self) -> datetime:
        return datetime.fromisoformat(str(self.valido_ate))
    
    @property
    def is_expired(self) -> bool:
        return bool(datetime.now(timezone.utc) >= self.valido_ate_datetime.astimezone(timezone.utc))

    @property
    def usuario_str_id(self) -> str:
        return self.usuario.str_id

    class Meta:
        table_name = "restaurar_senha"
