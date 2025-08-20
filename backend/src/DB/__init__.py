from src.DB import postgres, sqlite

from src.Utils.env import get_env_var

class connection:
    database = get_env_var("Database_Name")
    password = get_env_var("Database_Password")
    ip = get_env_var("Database_IP_Address")
    port = get_env_var("Database_Port")
    user = get_env_var("Database_User")

databases = {
    "PROD": postgres.Database(connection),
    "DEV" : sqlite.Database(connection)
}

db = databases[get_env_var("environment")].db
