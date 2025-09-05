from peewee import AutoField, CharField, IntegerField
from src.Model.BaseModel import BaseModel

class Ambulance(BaseModel):
    id              = AutoField()
    number_plate    = CharField(max_length=8, null=False)
    ambulance_model = CharField(max_length=35, null=False)
    year            = IntegerField(null=False)
    document_number = CharField(max_length=15, null=False)

    def __repr__(self) -> str:
        return (
            f"<Ambulance(id={self.id}, number_plate={self.number_plate}, ambulance_model={self.ambulance_model}, year={self.year}, "
            f"document_number={self.document_number})>"
        )
    
    class Meta:
        table_name = "ambulance"
    