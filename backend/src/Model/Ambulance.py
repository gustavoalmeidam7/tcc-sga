from peewee import CharField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType

from src.Validator.GenericValidator import mask_uuid, unmask_uuid
from uuid import UUID

from src.Validator.UserValidator import generate_uuid

class Ambulance(BaseModel):
    id     : str             | CharField = CharField(default=generate_uuid, max_length=32, primary_key=True)
    status : AmbulanceStatus | IntegerField = IntegerField(null=False)
    placa  : str             | CharField    = CharField(max_length=8, null=False, unique=True)
    tipo   : AmbulanceType   | IntegerField = IntegerField(null=False)

    @property
    def str_id(self) -> str:
        return str(self.id)
    
    @property
    def uuid_id(self) -> UUID | None:
        return mask_uuid(str(self.id))
    
    def compare_uuid(self, compared_uuid: UUID | str) -> bool:
        return self.str_id == unmask_uuid(compared_uuid)
    
    class Meta:
        table_name = "ambulance"
