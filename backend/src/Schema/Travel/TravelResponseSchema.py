from src.Schema.BaseModel import BaseModel
from pydantic import Field, BeforeValidator

from src.Schema.Travel.TravelRealizedEnum import TravelRealizedEnum

from uuid import UUID, uuid4
from typing import Annotated

from datetime import datetime, timedelta, timezone

class TravelResponseSchema(BaseModel):
    id            : Annotated[UUID,            Field(example=uuid4())]
    realizado     : Annotated[int,             Field(example=TravelRealizedEnum.EM_PROGRESSO)]
    inicio        : Annotated[datetime,        Field(example=datetime.now(timezone.utc) + timedelta(days=1))]
    fim           : Annotated[datetime | None, Field(example=datetime.now(timezone.utc) + timedelta(days=1, hours=3))]
    id_paciente   : Annotated[UUID,            Field(example=uuid4()), BeforeValidator(lambda id: UUID(str(id)))]
    id_motorista  : Annotated[UUID | None,     Field(example=uuid4()), BeforeValidator(lambda id: UUID(str(id)) if id else None)]
    id_ambulancia : Annotated[UUID | None,     Field(example=uuid4()), BeforeValidator(lambda id: UUID(str(id)) if id else None)]
    local_inicio  : Annotated[str,             Field(example="Rua: José bonifacio N: 230")]
    local_fim     : Annotated[str,             Field(example="Rua: Herbert Richers N: 369 - Hospital escola")]
    criado_em     : Annotated[datetime,        Field(example=datetime.now(timezone.utc))]
