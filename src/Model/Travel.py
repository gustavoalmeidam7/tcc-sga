from peewee import (
    AutoField, ForeignKeyField, Model, CharField, DateTimeField
)
from src.Model import User, Driver, Ambulance
from src.DB import db

class Travel(Model):
    travel_id    = AutoField(primary_key=True)
    user         = ForeignKeyField(User.User, backref="travels", null=False)
    driver       = ForeignKeyField(Driver.Driver, backref="travels", null=False)
    ambulance    = ForeignKeyField(Ambulance.Ambulance, backref="travels", null=False)
    origin       = CharField(max_length=70, null=False)
    destination  = CharField(max_length=70, null=False)
    datetime     = DateTimeField(null=False)
    status       = CharField(null=False) #TODO Change to Enum
    observations = CharField(max_length=150, null=True)

    def __repr__(self) -> str:
        return (
            f"<Travel(id={self.travel_id}, user_id={self.user.id}, driver_id={self.driver.id}, "
            f"ambulance_id={self.ambulance.id}, origin='{self.origin}', destination='{self.destination}', "
            f"datetime='{self.datetime}', status='{self.status}', observations='{self.observations}')>"
        )

    class Meta:
        database = db
        table_name = "travels"
