from peewee import CharField, ForeignKeyField
from src.Model.BaseModel import BaseModel

from src.Model import Ambulance

import uuid

from src.Validator.UserValidator import generate_uuid

class Equipment(BaseModel):
    id            = CharField(default=generate_uuid, max_length=32, primary_key=True)
    id_ambulancia = ForeignKeyField(Ambulance.Ambulance, backref="equipamentos", null=False)
    equipamento   = CharField(max_length=50, null=False)
    descricao     = CharField(max_length=100, null=False)
    
    class Meta:
        table_name = "equipamento"
    