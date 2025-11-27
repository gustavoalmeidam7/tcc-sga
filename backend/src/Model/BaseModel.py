from peewee import Model
from src.DB import db

class BaseModel(Model):
    class Meta:
        database = db