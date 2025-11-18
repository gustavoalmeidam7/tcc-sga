from peewee import ForeignKeyField, CharField, DateTimeField, IntegerField, FloatField, BooleanField
from src.Model import User, Driver, Ambulance
from src.Model.BaseModel import BaseModel

from src.Schema.Travel.TravelRealizedEnum import TravelRealized
from src.Schema.Travel.TravelPatientStateEnum import PatientState

from datetime import datetime, timezone
from src.Validator.UserValidator import generate_uuid

class Travel(BaseModel):
    id              : str            | CharField       = CharField(default=generate_uuid, max_length=32, primary_key=True)
    realizado       : TravelRealized | IntegerField    = IntegerField(null=False, default=2)
    inicio          : datetime       | DateTimeField   = DateTimeField(null=False)
    fim             : datetime       | DateTimeField   = DateTimeField(null=True)
    id_paciente     : str            | ForeignKeyField = ForeignKeyField(User.User, backref="viagens", null=False)
    cpf_paciente    : str            | CharField       = CharField(max_length=11, null=False)
    estado_paciente : PatientState   | IntegerField    = IntegerField(null=False, default=0)
    observacoes     : str            | CharField       = CharField(max_length=100, null=True)
    id_motorista    : str            | ForeignKeyField = ForeignKeyField(Driver.Driver, backref="viagens", null=True)
    id_ambulancia   : str            | ForeignKeyField = ForeignKeyField(Ambulance.Ambulance, backref="viagens", null=True)
    lat_inicio      : float          | FloatField      = FloatField(null=False)
    long_inicio     : float          | FloatField      = FloatField(null=False)
    end_inicio      : str            | CharField       = CharField(max_length=350, null=False)
    lat_fim         : float          | FloatField      = FloatField(null=False)
    long_fim        : float          | FloatField      = FloatField(null=False)
    end_fim         : str            | CharField       = CharField(max_length=350, null=False)
    cancelada       : bool           | BooleanField    = BooleanField(null=False, default=False)
    criado_em       : datetime       | DateTimeField   = DateTimeField(default=datetime.now(timezone.utc), null=False)

    class Meta:
        table_name = "transporte"