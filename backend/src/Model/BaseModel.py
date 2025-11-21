from peewee import Model
from src.DB import db

from src.Validator.GenericValidator import mask_uuid, unmask_uuid

from uuid import UUID

class BaseModel(Model):
    @property
    def str_id(self) -> str:
        return str(self.id)
    
    @property
    def uuid_id(self) -> UUID | None:
        return mask_uuid(str(self.id))
    
    def compare_uuid(self, compared_uuid: UUID | str) -> bool:
        return self.str_id == unmask_uuid(compared_uuid)

    class Meta:
        database = db