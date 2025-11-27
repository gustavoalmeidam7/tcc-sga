from src.Schema.BaseModel import BaseModel, Field

from typing import Annotated

from uuid import UUID, uuid4

class EquipmentResponseSchema(BaseModel):
    id            : Annotated[UUID, Field(examples=[uuid4()])]
    id_ambulancia : Annotated[UUID, Field(examples=[uuid4()])]
    equipamento   : Annotated[str , Field(examples=["Maca"])]
    descricao     : Annotated[str , Field(examples=["Maca retrátil funcional"])]
