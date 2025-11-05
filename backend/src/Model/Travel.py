from peewee import ForeignKeyField, CharField, DateTimeField, IntegerField, FloatField, BooleanField
from src.Model import User, Driver, Ambulance
from src.Model.BaseModel import BaseModel

from datetime import datetime, timezone
from src.Validator.UserValidator import generate_uuid

class Travel(BaseModel):
    id              = CharField(default=generate_uuid, max_length=32, primary_key=True)
    realizado       = IntegerField(null=False, default=2) # ENUM "realizado", "em_andamento" e "nao_realizado"
    inicio          = DateTimeField(null=False)
    fim             = DateTimeField(null=True)
    id_paciente     = ForeignKeyField(User.User, backref="viagens", null=False)
    cpf_paciente    = CharField(max_length=11, null=False)
    estado_paciente = IntegerField(null=False, default=0) # ENUM "cadeirante", "maca", "acamado"
    observacoes     = CharField(max_length=100, null=True)
    id_motorista    = ForeignKeyField(Driver.Driver, backref="viagens", null=True)
    id_ambulancia   = ForeignKeyField(Ambulance.Ambulance, backref="viagens", null=True)
    lat_inicio      = FloatField(null=False)
    long_inicio     = FloatField(null=False)
    end_inicio      = CharField(max_length=350, null=False)
    lat_fim         = FloatField(null=False)
    long_fim        = FloatField(null=False)
    end_fim         = CharField(max_length=350, null=False)
    cancelada       = BooleanField(null=False, default=False)
    criado_em       = DateTimeField(default=datetime.now(timezone.utc), null=False)

    class Meta:
        table_name = "transporte"