from peewee import CharField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Validator.UserValidator import generate_uuid

class Ambulance(BaseModel):
    id     = CharField(default=generate_uuid, max_length=32, primary_key=True)
    status = IntegerField(null=False)
    placa  = CharField(max_length=8, null=False)
    tipo   = IntegerField(null=False)
    
    class Meta:
        table_name = "ambulance"
    