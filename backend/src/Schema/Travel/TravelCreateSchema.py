from src.Schema.BaseModel import BaseModel
from pydantic import Field

from typing import Annotated
from datetime import datetime, timezone, timedelta

class TravelCreateSchema(BaseModel):
    inicio        : Annotated[datetime, Field(example=datetime.now(timezone.utc) + timedelta(days=1))]
    fim           : Annotated[datetime, Field(example=datetime.now(timezone.utc) + timedelta(days=1, hours=3))]
    local_inicio  : Annotated[str,      Field(example="Rua: José bonifacio N: 230")]
    local_fim     : Annotated[str,      Field(example="Rua: Herbert Richers N: 369 - Hospital escola")]
