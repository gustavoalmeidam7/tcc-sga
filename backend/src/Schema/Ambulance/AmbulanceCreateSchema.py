from src.Schema.BaseModel import BaseModel

from typing import Annotated
from pydantic import Field, BeforeValidator

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType

from src.Validator.AmbulanceValidator import validate_ambulance_license_plate

class AmbulanceCreateSchema(BaseModel):
    status : Annotated[AmbulanceStatus, Field(examples=[AmbulanceStatus.ative])]
    placa  : Annotated[str            , Field(examples=["lab1b42"], min_length=7, max_length=8), BeforeValidator(validate_ambulance_license_plate)]
    tipo   : Annotated[AmbulanceType  , Field(examples=[AmbulanceType.A])]
