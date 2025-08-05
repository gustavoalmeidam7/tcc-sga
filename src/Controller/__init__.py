from fastapi import FastAPI

from src.Utils.env import get_env_var

from src.User.Controller.UserController import USER_ROUTER
from src.User.Auth.Controller.AuthController import AUTH_ROUTER

try:
    env = get_env_var("environment")
except(KeyError):
    raise RuntimeError("Sem chaves de \"environment\" fornecidas no .env file, por favor adicione alguma (\"PROD\" ou \"DEV\")")

isDebug = (env == "DEV")

app = FastAPI(debug=isDebug, title="Gerenciamento de ambulância API", description="Api para gerenciamento de ambulâncias - TCC", version="1.0.0", docs_url="/docs")

app.include_router(USER_ROUTER)
app.include_router(AUTH_ROUTER)
