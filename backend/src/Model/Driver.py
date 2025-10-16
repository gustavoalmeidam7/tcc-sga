from peewee import ForeignKeyField, BooleanField
from src.Model.BaseModel import BaseModel

from src.Model import User, Ambulance

class Driver(BaseModel):
    id            = ForeignKeyField(User.User, primary_key=True, null=False)
    id_ambulancia = ForeignKeyField(Ambulance.Ambulance, null=True)
    em_viagem     = BooleanField(default=False, null=False)
    
    class Meta:
        table_name = "motorista"
