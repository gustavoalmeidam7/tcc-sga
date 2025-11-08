from peewee import CharField, DateTimeField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Validator.UserValidator import generate_uuid

from datetime import datetime

class User(BaseModel):
    id         : str      | CharField     = CharField(default=generate_uuid, max_length=32, primary_key=True)
    email      : str      | CharField     = CharField(max_length=100, unique=True, null=False)
    senha      : str      | CharField     = CharField(max_length=60, null=False)
    nome       : str      | CharField     = CharField(max_length=50, null=False)
    nascimento : datetime | DateTimeField = DateTimeField(null=False)
    cpf        : str      | CharField     = CharField(max_length=11, unique=True, null=False)
    telefone   : str      | CharField     = CharField(max_length=12, unique=True, null=False)
    cargo      : int      | IntegerField  = IntegerField(default=0, null=False)

    class Meta:
        table_name = "usuario"