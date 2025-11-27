from src.Schema.BaseModel import BaseModel, Field

from pydantic import BeforeValidator

from typing import Annotated
from uuid import UUID, uuid4

from src.Validator.GenericValidator import validate_uuid

class EquipmentCreateSchema(BaseModel):
    id_ambulancia : Annotated[UUID, Field(examples=[uuid4()]), BeforeValidator(validate_uuid)]
    equipamento   : Annotated[str, Field(examples=["Maca"])]
    descricao     : Annotated[str, Field(examples=["Maca retrátil funcional"])]
