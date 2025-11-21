from src.Schema.BaseModel import BaseModel, Field

from pydantic import BeforeValidator

from typing import Annotated

from src.Validator.GenericValidator import mask_uuid

from uuid import UUID, uuid4

class EquipmentResponseSchema(BaseModel):
    id            : Annotated[UUID, Field(examples=[uuid4()])]
    id_ambulancia : Annotated[UUID, Field(examples=[uuid4()]), BeforeValidator(mask_uuid)]
    equipamento   : Annotated[str , Field(examples=["Maca"])]
    descricao     : Annotated[str , Field(examples=["Maca retrátil funcional"])]
