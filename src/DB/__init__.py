from src.DB import postgres, sqlite

from src.Utils.env import get_env_var

class connection:
    database = "application"
    password = "123456"
    ip = "localhost"
    port = "5432"
    user = "application"

databases = {
    "PROD": postgres.Database(connection),
    "DEV" : sqlite.Database(connection)
}

try:
    get_env_var("environment")
except(KeyError):
    raise RuntimeError("Sem chaves de \"environment\" fornecidas no .env file, por favor adicione alguma (\"PROD\" ou \"DEV\")")

db = databases[get_env_var("environment")].db
