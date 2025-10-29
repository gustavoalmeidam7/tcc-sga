from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from src.Utils.env import get_env_var

from src.Controller import AuthController, DriverController, TravelController, UserController, ManagerController, UpgradeTokenController
from src.Model import User, Driver, Travel, UserSession, Ambulance, Equipment, Manager, UpgradeToken

from src.Error.ErrorClass import ErrorClass

from src.Service.ManagerService import generate_manager_token_list

from src.DB import db, is_pytest

from src.Logging import Logging, Level
from src.Validator.GenericValidator import mask_uuid


routers = [
    AuthController.AUTH_ROUTER,
    DriverController.DRIVER_ROUTER,
    TravelController.TRAVEL_ROUTER,
    UserController.USER_ROUTER,
    ManagerController.MANAGER_ROUTER,
    UpgradeTokenController.UPGRADE_TOKEN_ROUTER
]

env = get_env_var("environment", "DEV")

isDebug = (env == "DEV")

@asynccontextmanager
async def lifespan(app: FastAPI):
    Logging.log("Iniciando aplicação", Level.LOG)
    db.connect()

    if not is_pytest:
        db.create_tables([User.User, Driver.Driver, Travel.Travel, UserSession.Session, Ambulance.Ambulance, Equipment.Equipment, Manager.Manager, UpgradeToken.UpgradeToken])

    tokens = generate_manager_token_list(int(get_env_var("TOKENS", "5")))

    Logging.log(f"Tokens para gerente: {[mask_uuid(t.id) for t in tokens if not t.usado and t.fator_cargo == 2]}", Level.SENSITIVE)
    
    Logging.log("Aplicação iniciada", Level.LOG)
    yield
    Logging.log("Fechando aplicação", Level.LOG)
    db.close()

    Logging.log("Aplicação fechada", Level.LOG)

app = FastAPI(debug=isDebug, title="Gerenciamento de ambulância API", description="Api para gerenciamento de ambulâncias - TCC", version="1.0.0", root_path="/api", lifespan=lifespan)

for route in routers:
  app.include_router(route)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https://.*\.tcc-sga\.pages\.dev|http://localhost:5173)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if env != "DEV":
    app.add_middleware(HTTPSRedirectMiddleware)

@app.exception_handler(ErrorClass)
def error_handler(request: Request, error: ErrorClass):
    return JSONResponse(
        status_code=error.statusCode,
        content={"Erros": error.errors}
    )
