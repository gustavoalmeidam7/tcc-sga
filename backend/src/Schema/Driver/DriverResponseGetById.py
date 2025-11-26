from src.Schema.BaseModel import BaseModel

from pydantic import Field, BeforeValidator
from typing import Annotated

from src.Validator.GenericValidator import unmask_uuid

from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema, AMBULANCE_FULL_EXAMPLE

from uuid import UUID, uuid4

class DriverResponseGetById(BaseModel):
    id            : Annotated[UUID,                               Field(examples=[uuid4()]), BeforeValidator(unmask_uuid)]
    ambulancia    : Annotated[AmbulanceFullResponseSchema | None, Field(examples=[AMBULANCE_FULL_EXAMPLE])] = None
    em_viagem     : Annotated[bool,                               Field(examples=[True])]
