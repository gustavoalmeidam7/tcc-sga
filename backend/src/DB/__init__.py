from peewee import Proxy
from src.DB import postgres, sqlite
from src.Utils.env import get_env_var
from src.Utils.singleton import singleton

# Define o proxy que os modelos usarão.
db = Proxy()

# Lógica existente para obter detalhes da conexão.
class connection(metaclass=singleton):
    def __init__(self):
        self.environment = get_env_var("environment", "DEV")

        self.database =    get_env_var("Database_Name", "database.db")
        self.password =    get_env_var("Database_Password")
        self.ip =          get_env_var("Database_IP_Address")
        self.port =        get_env_var("Database_Port")
        self.user =        get_env_var("Database_User")

# Lógica para criar instâncias de banco de dados.
databases = {
    "PROD": postgres.Database(connection()),
    "DEV" : sqlite.Database(connection())
}

# Em tempo de importação, inicializa o proxy com o banco de dados correto baseado no ambiente.
# O conftest.py irá substituir isso durante os testes.
selected_db = databases[connection().environment].db
db.initialize(selected_db)