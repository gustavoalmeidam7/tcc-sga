from peewee import CharField, IntegerField
from src.Model.BaseModel import BaseModel

import uuid

from src.Validator.UserValidator import validate_uuid

class Ambulance(BaseModel):
    id     = CharField(max_length=32, default=validate_uuid(uuid.uuid4()), primary_key=True)
    status = IntegerField(null=False)
    placa  = CharField(max_length=8, null=False)
    tipo   = IntegerField(null=False)
    
    class Meta:
        table_name = "ambulance"
    