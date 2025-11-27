from src.Schema.BaseModel import BaseModel

from pydantic import Field, BeforeValidator
from typing import Annotated

from src.Validator.GenericValidator import unmask_uuid

from uuid import UUID, uuid4
from datetime import datetime, timedelta

class DriverResponseFullSchema(BaseModel):
    id            : Annotated[UUID,     Field(example=uuid4()), BeforeValidator(unmask_uuid)]
    id_ambulancia : Annotated[UUID | None,     Field(example=uuid4())] = None
    em_viagem     : Annotated[bool,     Field(example=True)]
    cnh           : Annotated[str,      Field(example="34526745623")]
    vencimento    : Annotated[datetime, Field(example=datetime.now() + timedelta(days=230))]
