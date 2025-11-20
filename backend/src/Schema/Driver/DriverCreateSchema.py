from src.Schema.BaseModel import BaseModel

from pydantic import Field
from typing import Annotated

from uuid import UUID, uuid4
from datetime import datetime, timedelta

class DriverCreateSchema(BaseModel):
    id_ambulancia : Annotated[UUID | None, Field(examples=[uuid4()])] = None
    cnh           : Annotated[str,         Field(examples=["76389245712"], max_length=11)]
    vencimento    : Annotated[datetime,    Field(examples=[datetime.now() + timedelta(days=365)])]
