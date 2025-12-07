from peewee import CharField, DateTimeField, BooleanField, IntegerField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timezone

from src.Validator.GenericValidator import generate_uuid

class UpgradeToken(BaseModel):
    id          : str      | CharField     = CharField(default=generate_uuid, max_length=32, primary_key=True)
    fator_cargo : int      | IntegerField  = IntegerField(default=1, null=False)
    usado       : bool     | BooleanField  = BooleanField(default=False, null=False)
    usuario     : str      | CharField     = CharField(default=None, null=True)
    criado_em   : datetime | DateTimeField = DateTimeField(default=datetime.now(timezone.utc), null=False)
    revogado_em : datetime | DateTimeField = DateTimeField(default=None, null=True)

    class Meta:
        table_name = "atualizar_token"
