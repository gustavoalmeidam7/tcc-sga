from peewee import CharField, DateTimeField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Schema.User.UserRoleEnum import UserRole

from src.Validator.GenericValidator import generate_uuid

from datetime import datetime

class User(BaseModel):
    id         : str      | CharField     = CharField(default=generate_uuid, max_length=32, primary_key=True)
    email      : str      | CharField     = CharField(max_length=100, unique=True, null=False)
    senha      : str      | CharField     = CharField(max_length=60, null=False)
    nome       : str      | CharField     = CharField(max_length=50, null=False)
    nascimento : datetime | DateTimeField = DateTimeField(null=False)
    cpf        : str      | CharField     = CharField(max_length=11, unique=True, null=False)
    telefone   : str      | CharField     = CharField(max_length=12, unique=True, null=False)
    cargo      : UserRole | IntegerField  = IntegerField(default=0, null=False)
    
    @property
    def is_manager(self) -> bool:
        return bool(self.cargo == UserRole.MANAGER)
    
    @property
    def is_driver(self) -> bool:
        return bool(self.cargo == UserRole.DRIVER)
    
    @property
    def is_driver_or_higher(self) -> bool:
        return bool(self.cargo >= UserRole.DRIVER)

    class Meta:
        table_name = "usuario"