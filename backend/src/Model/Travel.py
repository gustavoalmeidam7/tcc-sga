from peewee import ForeignKeyField, CharField, DateTimeField, IntegerField
from src.Model import User, Driver, Ambulance
from src.Model.BaseModel import BaseModel

from datetime import datetime, timezone
from src.Validator.UserValidator import generate_uuid

class Travel(BaseModel):
    id            = CharField(default=generate_uuid, max_length=32, primary_key=True)
    realizado     = IntegerField(null=False)
    inicio        = DateTimeField(null=False)
    fim           = DateTimeField(null=True)
    id_paciente   = ForeignKeyField(User.User, backref="viagens", null=False)
    id_motorista  = ForeignKeyField(Driver.Driver, backref="viagens", null=True)
    id_ambulancia = ForeignKeyField(Ambulance.Ambulance, backref="viagens", null=True)
    local_inicio  = CharField(max_length=255, null=False)
    local_fim     = CharField(max_length=255, null=False)
    criado_em     = DateTimeField(default=datetime.now(timezone.utc), null=False)

    class Meta:
        table_name = "transporte"