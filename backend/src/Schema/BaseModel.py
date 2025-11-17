from pydantic import BaseModel, ConfigDict, Field

class BaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
