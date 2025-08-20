from fastapi import FastAPI

from src.Utils.env import get_env_var

from src.User.Controller.UserController import USER_ROUTER
from src.User.Auth.Controller.AuthController import AUTH_ROUTER
env = get_env_var("environment")

isDebug = (env == "DEV")

app = FastAPI(debug=isDebug, title="Gerenciamento de ambulância API", description="Api para gerenciamento de ambulâncias - TCC", version="1.0.0", root_path="/api")

app.include_router(USER_ROUTER)
app.include_router(AUTH_ROUTER)
