from peewee import SqliteDatabase

class Database:
    def __init__(self, connection):
        self.db = SqliteDatabase(connection.database)
