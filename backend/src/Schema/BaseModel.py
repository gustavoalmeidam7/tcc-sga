from pydantic import BaseModel, ConfigDict

class BaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
