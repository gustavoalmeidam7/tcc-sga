from peewee import CharField, IntegerField
from src.Model.BaseModel import BaseModel

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType

from src.Validator.UserValidator import generate_uuid

class Ambulance(BaseModel):
    id     : str             | CharField    = CharField(default=generate_uuid, max_length=32, primary_key=True)
    status : AmbulanceStatus | IntegerField = IntegerField(null=False)
    placa  : str             | CharField    = CharField(max_length=8, null=False, unique=True)
    tipo   : AmbulanceType   | IntegerField = IntegerField(null=False)
    
    class Meta:
        table_name = "ambulance"
