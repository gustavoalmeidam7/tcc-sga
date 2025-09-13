from peewee import ForeignKeyField, UUIDField
from src.Model.BaseModel import BaseModel

from src.Model import User

class Manager(BaseModel):
    id = ForeignKeyField(User.User, field=UUIDField, primary_key=True, null=False)
    
    class Meta:
        table_name = "gerente"
