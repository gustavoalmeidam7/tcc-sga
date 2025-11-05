from src.Schema.BaseModel import BaseModel

from pydantic import Field
from typing import Annotated
from uuid import UUID, uuid4
from datetime import datetime, timedelta, timezone

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema

from src.Schema.Travel.TravelRealizedEnum import TravelRealizedEnum

TRAVEL_EXAMPLE = TravelResponseSchema.model_validate({
    "id"            : uuid4(),
    "realizado"     : TravelRealizedEnum.EM_PROGRESSO,
    "inicio"        : datetime.now(timezone.utc) + timedelta(days=1),
    "fim"           : datetime.now(timezone.utc) + timedelta(days=1, hours=3),
    "id_paciente"   : uuid4(),
    "id_motorista"  : uuid4(),
    "id_ambulancia" : uuid4(),
    "lat_inicio"    : -22.011433,
    "long_inicio"   : -47.913322,
    "lat_fim"       : -22.011002,
    "long_fim"      : -47.890185,
    "criado_em"     : datetime.now(timezone.utc)
})

class TravelDeleteResponseSchema(BaseModel):
    id       : Annotated[UUID, Field(example=uuid4())]
    viagem   : Annotated[TravelResponseSchema, Field(example=TRAVEL_EXAMPLE)]
