from peewee import ForeignKeyField, Model, AutoField, CharField, DateField
from src.DB import db

class User(Model):
    id              = AutoField(primary_key=True)
    email           = CharField(max_length=45, unique=True, null=False)
    cpf             = CharField(max_length=11, unique=True, null=False)
    phone_number    = CharField(max_length=14, unique=True, null=False)
    username        = CharField(max_length=35, null=False)
    birthday        = DateField(null=False)
    password        = CharField(null=False)

    def __repr__(self) -> str:
        return (
            f"<User(id={self.id}, username={self.username}, cpf={self.cpf}, birthday={self.birthday}, "
            f"email={self.email}, phone_number={self.phone_number}, password=******)>"
        )

    class Meta:
        database = db
        table_name = "users"
