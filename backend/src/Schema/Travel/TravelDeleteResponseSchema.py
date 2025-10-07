from src.Schema.BaseModel import BaseModel

from pydantic import Field
from typing import Annotated
from uuid import UUID, uuid4

class TravelDeleteResponseSchema(BaseModel):
    id       : Annotated[UUID, Field(example=uuid4())]
    deletado : Annotated[bool, Field(example=True)]
