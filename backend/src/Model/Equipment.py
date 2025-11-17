from peewee import CharField, ForeignKeyField
from src.Model.BaseModel import BaseModel

from src.Model import Ambulance

from src.Validator.UserValidator import generate_uuid

class Equipment(BaseModel):
    id            : str | CharField       = CharField(default=generate_uuid, max_length=32, primary_key=True)
    id_ambulancia : str | ForeignKeyField = ForeignKeyField(Ambulance.Ambulance, backref="equipamentos", null=False)
    equipamento   : str | CharField       = CharField(max_length=50, null=False)
    descricao     : str | CharField       = CharField(max_length=100, null=False)
    
    class Meta:
        table_name = "equipamento"
    