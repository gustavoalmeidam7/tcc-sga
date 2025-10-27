from peewee import Proxy
import sys
from src.DB import postgres, sqlite
from src.Utils.env import get_env_var
from src.Utils.singleton import singleton

db = Proxy()

class connection(metaclass=singleton):
    def __init__(self):
        self.environment = get_env_var("environment", "DEV")

        self.database =    get_env_var("Database_Name", "database.db")
        self.password =    get_env_var("Database_Password")
        self.ip =          get_env_var("Database_IP_Address")
        self.port =        get_env_var("Database_Port")
        self.user =        get_env_var("Database_User")

is_pytest = any(arg.startswith('pytest') for arg in sys.argv)

selected_db = None

if not is_pytest:
    databases = {
        "PROD": postgres.Database(connection()),
        "DEV" : sqlite.Database(connection())
    }
    env = get_env_var("environment", "DEV")
    if env in databases:
        selected_db = databases[env].db

    if selected_db is None:
        raise RuntimeError("Erro a o selecionar banco de dados!")

    db.initialize(selected_db)
else:
    print("***Running in test mode***")
