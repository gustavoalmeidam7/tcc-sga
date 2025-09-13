from peewee import UUIDField, CharField, DateField, IntegerField
from src.Model.BaseModel import BaseModel

import uuid

class User(BaseModel):
    id              = UUIDField(primary_key=True, default=uuid.uuid4)
    email           = CharField(max_length=100, unique=True, null=False)
    senha           = CharField(max_length=60, null=False)
    nome            = CharField(max_length=50, null=False)
    nascimento      = DateField(null=False)
    cpf             = CharField(max_length=11, unique=True, null=False)
    telefone        = CharField(max_length=12, unique=True, null=False)
    cargo           = IntegerField(null=True)

    class Meta:
        table_name = "usuario"