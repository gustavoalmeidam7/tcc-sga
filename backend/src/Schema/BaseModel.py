from pydantic import BaseModel, ConfigDict, Field

from typing import Annotated

class BaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
