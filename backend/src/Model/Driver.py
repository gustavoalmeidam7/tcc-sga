from peewee import ForeignKeyField, BooleanField, CharField, DateField
from src.Model.BaseModel import BaseModel

from src.Validator.GenericValidator import mask_uuid, unmask_uuid
from uuid import UUID

from src.Model import User, Ambulance

from datetime import date

class Driver(BaseModel):
    id             : str  | ForeignKeyField = ForeignKeyField(User.User, primary_key=True, null=False)
    id_ambulancia  : str  | ForeignKeyField = ForeignKeyField(Ambulance.Ambulance, null=True)
    em_viagem      : bool | BooleanField    = BooleanField(default=False, null=False)
    cnh            : str  | CharField       = CharField(max_length=11, null=False)
    vencimento     : date | DateField       = DateField(null=False)

    @property
    def str_id(self) -> str:
        return str(self.id)
    
    @property
    def uuid_id(self) -> UUID | None:
        return mask_uuid(str(self.id))
    
    def compare_uuid(self, compared_uuid: UUID | str) -> bool:
        return self.str_id == unmask_uuid(compared_uuid)
    
    class Meta:
        table_name = "motorista"
