from fastapi import Request
from fastapi.responses import JSONResponse
from src.Error.ErrorClass import ErrorClass
from src.Model import User, Driver, Travel, UserSession
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
from src.Utils.env import get_env_var

from src.Controller import app

from src.DB import db

origins = [
    "https://*.tcc-sga.pages.dev",
    "http://*.tcc-sga.pages.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if get_env_var("ENVIRONMENT", "dev") != "dev":
    app.add_middleware(HTTPSRedirectMiddleware)

@app.exception_handler(ErrorClass)
def error_handler(request: Request, error: ErrorClass):
    return JSONResponse(
        status_code=error.statusCode,
        content={"Erros": error.errors}
    )

@app.on_event("startup")
def main():
    db.connect()
    db.create_tables([User.User, Driver.Driver, Travel.Travel, UserSession.Session])
