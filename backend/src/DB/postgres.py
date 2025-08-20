from peewee import PostgresqlDatabase

class Database:
    def __init__(self, connection):
        __database__ =  connection.database
        __password__ =  connection.password
        __ip__       =  connection.ip
        __port__     =  connection.port
        __user__     =  connection.user
    
        self.db = PostgresqlDatabase(f"postgresql://{__user__}:{__password__}@{__ip__}:{__port__}/{__database__}")
