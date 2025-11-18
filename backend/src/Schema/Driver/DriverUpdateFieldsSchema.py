from src.Schema.BaseModel import BaseModel

from pydantic import Field, FutureDate

from typing import Annotated

from uuid import UUID, uuid4
from datetime import datetime, timedelta

class DriverUpdateFieldsSchema(BaseModel):
    id_ambulancia : Annotated[UUID | None,       Field(example=uuid4())] = None
    em_viagem     : Annotated[bool | None,       Field(example=True)] = None
    vencimento    : Annotated[FutureDate | None, Field(example=datetime.now() + timedelta(days=230))] = None