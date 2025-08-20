from fastapi import Request
from fastapi.responses import JSONResponse
from src.Error.ErrorClass import ErrorClass
from src.Model import User, Driver, Travel, UserSession

from src.Controller import app

from src.DB import db

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

