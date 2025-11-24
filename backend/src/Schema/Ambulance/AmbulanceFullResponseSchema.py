from src.Schema.BaseModel import BaseModel

from typing import Annotated
from pydantic import Field

from src.Schema.Ambulance.AmbulanceStatusEnum import AmbulanceStatus
from src.Schema.Ambulance.AmbulanceTypeEnum import AmbulanceType
from src.Schema.Equipment.EquipmentResponseSchema import EquipmentResponseSchema, EQUIPMENT_EXAMPLE

from uuid import UUID, uuid4

class AmbulanceFullResponseSchema(BaseModel):
    id           : Annotated[UUID                         , Field(examples=[uuid4()])]
    status       : Annotated[AmbulanceStatus              , Field(examples=[AmbulanceStatus.ative])]
    placa        : Annotated[str                          , Field(examples=["lab1b42"], max_length=8)]
    tipo         : Annotated[AmbulanceType                , Field(examples=[AmbulanceType.A])]
    equipamentos : Annotated[list[EquipmentResponseSchema], Field(examples=[[]])]
    motorista_id : Annotated[UUID | None                  , Field(examples=[uuid4()])]

AMBULANCE_FULL_EXAMPLE = AmbulanceFullResponseSchema.model_validate({
    "id"           : uuid4(),
    "status"       : AmbulanceStatus.ative,
    "placa"        : "lab1b42",
    "tipo"         : AmbulanceType.A,
    "equipamentos" : [EQUIPMENT_EXAMPLE],
    "motorista_id" : uuid4(),
})
