from src.Schema.BaseModel import BaseModel
from pydantic import Field
from typing import Annotated

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema, TRAVEL_EXAMPLE

class TravelListResponseSchema(BaseModel):
    viagens: Annotated[list[TravelResponseSchema], Field(examples=[[TRAVEL_EXAMPLE]])]
