from peewee import CharField, DateTimeField, BooleanField, IntegerField
from src.Model.BaseModel import BaseModel

from datetime import datetime, timezone

from src.Validator.GenericValidator import generate_uuid

class UpgradeToken(BaseModel):
    id          = CharField(default=generate_uuid, max_length=32, primary_key=True)
    fator_cargo = IntegerField(default=1, null=False)
    usado       = BooleanField(default=False, null=False)
    usuario     = CharField(default=None, null=True)
    criado_em   = DateTimeField(default=datetime.now(timezone.utc), null=False)
    revogado_em = DateTimeField(default=None, null=True)

    class Meta:
        table_name = "atualizar_token"
