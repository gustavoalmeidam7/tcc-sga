from src.Schema.BaseModel import BaseModel
from pydantic import Field

from typing import Annotated
from datetime import datetime, timezone, timedelta

from src.Schema.Travel.TravelPatientStateEnum import PatientState

class TravelCreateSchema(BaseModel):
    inicio          : Annotated[datetime,     Field(examples=[datetime.now(timezone.utc) + timedelta(days=1)])]
    fim             : Annotated[datetime,     Field(examples=[datetime.now(timezone.utc) + timedelta(days=1, hours=3)])]
    cpf_paciente    : Annotated[str,          Field(min_length=11, max_length=11, examples=["12345678925"])]
    estado_paciente : Annotated[PatientState, Field(examples=[1])]
    observacoes     : Annotated[str | None,   Field(max_length=100, examples=["Precisa de suporte para subir na ambulância"])] = None
    lat_inicio      : Annotated[float,        Field(decimal_max_digits=9, decimal_max_places=7, examples=[-22.011433])]
    long_inicio     : Annotated[float,        Field(decimal_max_digits=9, decimal_max_places=7, examples=[-47.913322])]
    end_inicio      : Annotated[str,          Field(max_length=350, examples=["Parque Faber II, São Carlos, Região Imediata de São Carlos, Região Geográfica Intermediária de Araraquara, São Paulo, Região Sudeste, 13562-020, Brasil"])]
    lat_fim         : Annotated[float,        Field(decimal_max_digits=9, decimal_max_places=7, examples=[-21.996293])]
    long_fim        : Annotated[float,        Field(decimal_max_digits=9, decimal_max_places=7, examples=[-47.915033])]
    end_fim         : Annotated[str,          Field(max_length=350, examples=["Rua Doutor João Navarro Siquerolli, Jardim Acapulco, São Carlos, Região Imediata de São Carlos, Região Geográfica Intermediária de Araraquara, São Paulo, Região Sudeste, 13562-190, Brasil"])]
