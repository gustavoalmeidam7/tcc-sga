from peewee import UUIDField, CharField, IntegerField
from src.Model.BaseModel import BaseModel

import uuid

class Ambulance(BaseModel):
    id     = UUIDField(default=uuid.uuid4(), primary_key=True)
    status = IntegerField(null=False)
    placa  = CharField(max_length=8, null=False)
    tipo   = IntegerField(null=False)
    
    class Meta:
        table_name = "ambulance"
    