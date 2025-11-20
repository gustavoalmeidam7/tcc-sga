from src.Schema.BaseModel import BaseModel, Field

from typing import Annotated

class EquipmentUpdateSchema(BaseModel):
    equipamento   : Annotated[str, Field(examples=["Maca"])]
    descricao     : Annotated[str, Field(examples=["Maca retrátil funcional"])]
