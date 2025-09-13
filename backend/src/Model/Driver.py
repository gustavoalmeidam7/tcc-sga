from peewee import ForeignKeyField, UUIDField, BooleanField
from src.Model.BaseModel import BaseModel

from src.Model import User, Ambulance

class Driver(BaseModel):
    id = ForeignKeyField(User.User, field=UUIDField, primary_key=True, null=False)
    id_ambulancia = ForeignKeyField(Ambulance.Ambulance, field=UUIDField)
    em_viagem = BooleanField(default=False, null=False)
    
    class Meta:
        table_name = "motorista"
