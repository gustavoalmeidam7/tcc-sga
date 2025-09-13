from peewee import UUIDField, CharField, ForeignKeyField
from src.Model.BaseModel import BaseModel

from src.Model import Ambulance

import uuid

class Equipament(BaseModel):
    id            = UUIDField(default=uuid.uuid4(), primary_key=True)
    id_ambulancia = ForeignKeyField(Ambulance.Ambulance, backref="equipamentos", null=False)
    equipamento   = CharField(max_length=50, null=False)
    descricao     = CharField(max_length=100, null=False)
    
    class Meta:
        table_name = "equipamento"
    