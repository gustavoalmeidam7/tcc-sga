from peewee import ForeignKeyField, BooleanField, CharField, DateField
from src.Model.BaseModel import BaseModel

from src.Model import User, Ambulance

from datetime import date

class Driver(BaseModel):
    id             : str  | ForeignKeyField = ForeignKeyField(User.User, primary_key=True, null=False)
    id_ambulancia  : str  | ForeignKeyField = ForeignKeyField(Ambulance.Ambulance, null=True)
    em_viagem      : bool | BooleanField    = BooleanField(default=False, null=False)
    cnh            : str  | CharField       = CharField(max_length=11, null=False)
    vencimento     : date | DateField       = DateField(null=False)

    @property
    def str_id_ambulancia(self):
        return self.id_ambulancia
    
    @property
    def fk_id_ambulancia(self) -> ForeignKeyField:
        return ForeignKeyField(self.id_ambulancia)
    
    @property
    def is_ambulancia_none(self) -> bool:
        return bool(self.id_ambulancia_id == '')
    
    class Meta:
        table_name = "motorista"
