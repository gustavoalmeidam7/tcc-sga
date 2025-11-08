from src.Error.Base import ErrorClass, ErrorListClass
from src.Error.Base import NotFoundError
from fastapi import responses, Request

def register_error_handlers(app):
    @app.exception_handler(ErrorListClass.ErrorListClass)
    def base_error_list_handler(request: Request, error: ErrorListClass.ErrorListClass):
        return responses.JSONResponse(
            status_code=error.statusCode,
            content={"erros": error.errors}
        )

    @app.exception_handler(ErrorClass.ErrorClass)
    def base_error_handler(request: Request, error: ErrorClass.ErrorClass):
        return responses.JSONResponse(
            status_code=error.statusCode,
            content={
                "erro": error.error,
                "mensagem": error.userMessage
            }
        )

    @app.exception_handler(NotFoundError.NotFoundError)
    def base_not_found_handler(request: Request, error: NotFoundError.NotFoundError):
        return responses.JSONResponse(
            status_code=error.statusCode,
            content={
                "erro": error.error,
                "recurso": error.resource,
                "mensagem": error.userMessage
            }
        )
