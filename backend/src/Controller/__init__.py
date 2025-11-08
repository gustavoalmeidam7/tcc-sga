from fastapi import FastAPI

from src.Utils import env

from src.Controller import AuthController, DriverController, TravelController, UserController, ManagerController, UpgradeTokenController

app = None

def initialize_controller() -> FastAPI:
    isDebug = env.get_env_var("environment", "DEV") == "DEV"

    routers = [
        AuthController.AUTH_ROUTER,
        DriverController.DRIVER_ROUTER,
        TravelController.TRAVEL_ROUTER,
        UserController.USER_ROUTER,
        ManagerController.MANAGER_ROUTER,
        UpgradeTokenController.UPGRADE_TOKEN_ROUTER
    ]

    __app__ = FastAPI(debug=isDebug, title="Gerenciamento de ambulância API", description="Api para gerenciamento de ambulâncias - TCC", version="1.0.0", root_path="/api") # lifespan=lifespan

    for route in routers:
      __app__.include_router(route)

    global app
    app = __app__

    return __app__
