from src.Schema.BaseModel import BaseModel, Field

from typing import Annotated

class EquipmentUpdateSchema(BaseModel):
    equipamento   : Annotated[str | None, Field(examples=["Maca"])] = None
    descricao     : Annotated[str | None, Field(examples=["Maca retrátil funcional"])] = None
