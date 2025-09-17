from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from src.Utils.env import get_env_var

from src.Controller.UserController import USER_ROUTER
from src.Controller.AuthController import AUTH_ROUTER

from src.Error.ErrorClass import ErrorClass

from src.Model import User, Driver, Travel, UserSession

from src.Utils.env import get_env_var

from src.DB import db

env = get_env_var("environment", "DEV")

isDebug = (env == "DEV")

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
    db.create_tables([User.User, Driver.Driver, Travel.Travel, UserSession.Session])
    yield
    db.close()

app = FastAPI(debug=isDebug, title="Gerenciamento de ambulância API", description="Api para gerenciamento de ambulâncias - TCC", version="1.0.0", root_path="/api", lifespan=lifespan)

app.include_router(USER_ROUTER)
app.include_router(AUTH_ROUTER)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https://.*\.tcc-sga\.pages\.dev|http://localhost:5173)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if get_env_var("ENVIRONMENT", "DEV") != "DEV":
    app.add_middleware(HTTPSRedirectMiddleware)

@app.exception_handler(ErrorClass)
def error_handler(request: Request, error: ErrorClass):
    return JSONResponse(
        status_code=error.statusCode,
        content={"Erros": error.errors}
    )
