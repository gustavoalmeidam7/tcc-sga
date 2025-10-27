from src.Schema.BaseModel import BaseModel
from pydantic import Field
from typing import Annotated

from src.Schema.Travel.TravelRealizedEnum import TravelRealizedEnum
from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema

from uuid import uuid4

# __TRAVELS_EXAMPLE__ = [
# TravelResponseSchema.model_validate(
#     id            = uuid4(),
#     realizado     = 
#     inicio        =
#     fim           =
#     id_paciente   =
#     id_motorista  =
#     id_ambulancia =
#     local_inicio  =
#     local_fim     =
#     criado_em     =
# )
# ]

class TravelListResponseSchema(BaseModel):
    viagens: Annotated[list[TravelResponseSchema], Field(example=[])]
