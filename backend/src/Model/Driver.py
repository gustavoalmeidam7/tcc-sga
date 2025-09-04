from peewee import AutoField, CharField
from src.Model.BaseModel import BaseModel

class Driver(BaseModel):
    id             = AutoField(primary_key=True)
    name           = CharField(max_length=50, null=False)
    cpf            = CharField(max_length=14, unique=True, null=False)
    email          = CharField(max_length=35, unique=True, null=False)
    phone          = CharField(max_length=15, null=False)
    cnh_number     = CharField(max_length=12, null=False)

    def __repr__(self) -> str:
        return (
            f"<Driver(id={self.id}, name={self.name}, cpf={self.cpf}, email={self.email}, "
            f"phone={self.phone}, cnh_number={self.cnh_number})>"
        )

    class Meta:
        table_name = "driver"