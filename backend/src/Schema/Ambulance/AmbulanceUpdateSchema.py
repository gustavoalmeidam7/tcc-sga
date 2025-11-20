from src.Schema.BaseModel import BaseModel, Field

from pydantic import BeforeValidator

from typing import Annotated

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType

from src.Validator.AmbulanceValidator import validate_ambulance_license_plate

class AmbulanceUpdateSchema(BaseModel):
    status : Annotated[AmbulanceStatus, Field(examples=[AmbulanceStatus.ative])]
    tipo   : Annotated[AmbulanceType  , Field(examples=[AmbulanceType.A])]
