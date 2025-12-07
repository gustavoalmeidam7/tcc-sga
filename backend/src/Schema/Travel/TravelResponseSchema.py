from src.Schema.BaseModel import BaseModel
from pydantic import Field, BeforeValidator

from src.Schema.Travel.TravelRealizedEnum import TravelRealized
from src.Schema.Travel.TravelPatientStateEnum import PatientState

from uuid import UUID, uuid4
from typing import Annotated

from datetime import datetime, timedelta, timezone

class TravelResponseSchema(BaseModel):
    id              : Annotated[UUID,            Field(examples=[uuid4()])]
    realizado       : Annotated[int,             Field(examples=[TravelRealized.EM_PROGRESSO])]
    inicio          : Annotated[datetime,        Field(examples=[datetime.now(timezone.utc) + timedelta(days=1)])]
    fim             : Annotated[datetime | None, Field(examples=[datetime.now(timezone.utc) + timedelta(days=1, hours=3)])] = None
    id_paciente     : Annotated[UUID,            Field(examples=[uuid4()]), BeforeValidator(lambda id: UUID(str(id)))]
    cpf_paciente    : Annotated[str,             Field(examples=["12345678925"])]
    estado_paciente : Annotated[int,             Field(examples=[PatientState.WHELL_CHAIR])]
    observacoes     : Annotated[str | None,      Field(examples=["Precisa de suporte para subir na ambulância"])] = None
    id_motorista    : Annotated[UUID | None,     Field(examples=[uuid4()]), BeforeValidator(lambda id: UUID(str(id)) if id else None)] = None
    id_ambulancia   : Annotated[UUID | None,     Field(examples=[uuid4()]), BeforeValidator(lambda id: UUID(str(id)) if id else None)] = None
    lat_inicio      : Annotated[float,           Field(examples=[-22.011433])]
    long_inicio     : Annotated[float,           Field(examples=[-47.913322])]
    end_inicio      : Annotated[str,             Field(examples=["Parque Faber II, São Carlos, Região Imediata de São Carlos, Região Geográfica Intermediária de Araraquara, São Paulo, Região Sudeste, 13562-020, Brasil, Alameda dos Curios, 156"])]
    lat_fim         : Annotated[float,           Field(examples=[-21.996346])]
    long_fim        : Annotated[float,           Field(examples=[-47.915132])]
    end_fim         : Annotated[str,             Field(examples=["R. Dr. João Navarro Siquerolli, s/n - Parque Santa Felicia Jardim, São Carlos - SP, 13563-714, UPA Santa Felícia"])]
    cancelada       : Annotated[bool,            Field(examples=[False])]
    criado_em       : Annotated[datetime,        Field(examples=[datetime.now(timezone.utc)])]


TRAVEL_EXAMPLE = TravelResponseSchema.model_validate({
    "id"              : uuid4(),
    "realizado"       : TravelRealized.EM_PROGRESSO,
    "inicio"          : datetime.now(timezone.utc) + timedelta(days=1),
    "fim"             : datetime.now(timezone.utc) + timedelta(days=1, hours=3),
    "id_paciente"     : uuid4(),
    "cpf_paciente"    : "12345678925",
    "estado_paciente" : PatientState.WHELL_CHAIR,
    "observacoes"     : "Precisa de suporte para subir na ambulância",
    "id_motorista"    : uuid4(),
    "id_ambulancia"   : uuid4(),
    "lat_inicio"      : -22.011433,
    "long_inicio"     : -47.913322,
    "end_inicio"      : "Parque Faber II, São Carlos, Região Imediata de São Carlos, Região Geográfica Intermediária de Araraquara, São Paulo, Região Sudeste, 13562-020, Brasil, Alameda dos Curios, 156",
    "lat_fim"         : -22.011002,
    "long_fim"        : -47.890185,
    "end_fim"         : "R. Dr. João Navarro Siquerolli, s/n - Parque Santa Felicia Jardim, São Carlos - SP, 13563-714, UPA Santa Felícia",
    "cancelada"       : False,
    "criado_em"       : datetime.now(timezone.utc)
})
