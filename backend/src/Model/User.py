from peewee import CharField, DateField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Validator.UserValidator import generate_uuid

class User(BaseModel):
    id              = CharField(default=generate_uuid, max_length=32, primary_key=True)
    email           = CharField(max_length=100, unique=True, null=False)
    senha           = CharField(max_length=60, null=False)
    nome            = CharField(max_length=50, null=False)
    nascimento      = DateField(null=False)
    cpf             = CharField(max_length=11, unique=True, null=False)
    telefone        = CharField(max_length=12, unique=True, null=False)
    cargo           = IntegerField(default=0, null=False)

    class Meta:
        table_name = "usuario"