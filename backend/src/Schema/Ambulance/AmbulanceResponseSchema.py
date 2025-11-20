from src.Schema.BaseModel import BaseModel

from typing import Annotated
from pydantic import Field

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType

from src.Validator.GenericValidator import validate_uuid

from uuid import UUID, uuid4

class AmbulanceResponseSchema(BaseModel):
    id     : Annotated[UUID           , Field(examples=[uuid4()])]
    status : Annotated[AmbulanceStatus, Field(examples=[AmbulanceStatus.ative])]
    placa  : Annotated[str            , Field(examples=["lab1b42"], max_length=8)]
    tipo   : Annotated[AmbulanceType  , Field(examples=[AmbulanceType.A])]
