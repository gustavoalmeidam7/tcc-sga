from src.DB import postgres, sqlite

from src.Utils.env import get_env_var
from src.Utils.singleton import singleton

class connection(metaclass=singleton):
    def __init__(self):
        self.environment = get_env_var("environment")

        self.database = get_env_var("Database_Name")
        self.password = get_env_var("Database_Password")
        self.ip = get_env_var("Database_IP_Address")
        self.port = get_env_var("Database_Port")
        self.user = get_env_var("Database_User")

databases = {
    "PROD": postgres.Database(connection()),
    "DEV" : sqlite.Database(connection())
}

db = databases[connection().environment].db
