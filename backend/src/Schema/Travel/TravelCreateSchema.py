from src.Schema.BaseModel import BaseModel
from pydantic import Field

from typing import Annotated
from datetime import datetime, timezone, timedelta

class TravelCreateSchema(BaseModel):
    inicio        : Annotated[datetime, Field(example=datetime.now(timezone.utc) + timedelta(days=1))]
    fim           : Annotated[datetime, Field(example=datetime.now(timezone.utc) + timedelta(days=1, hours=3))]
    lat_inicio    : Annotated[float,    Field(example=-22.011433)]
    long_inicio   : Annotated[float,    Field(example=-47.913322)]
    lat_fim       : Annotated[float,    Field(example=-22.011002)]
    long_fim      : Annotated[float,    Field(example=-47.890185)]
