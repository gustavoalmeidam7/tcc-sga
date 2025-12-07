from src.Error.Base import ErrorClass, ErrorListClass
from src.Error.Base import NotFoundError
from fastapi import responses, Request

def register_error_handlers(app):
    # @app.exception_handler(ErrorListClass.ErrorListClass)
    # def base_error_list_handler(request: Request, error: ErrorListClass.ErrorListClass):
    #     return responses.JSONResponse(
    #         status_code=error.statusCode,
    #         content=error.jsonObject
    #     )

    @app.exception_handler(ErrorClass.ErrorClass)
    def base_error_handler(request: Request, error: ErrorClass.ErrorClass):
        content={
            "erro": error.error,
            "mensagem": error.userMessage,
        }

        if error.additionalField:
            content.update(error.additionalField)
        
        return responses.JSONResponse(
            status_code=error.statusCode,
            content=content,
            headers=error.headers
        )

    @app.exception_handler(NotFoundError.NotFoundError)
    def base_not_found_handler(request: Request, error: NotFoundError.NotFoundError):
        return responses.JSONResponse(
            status_code=error.statusCode,
            content=error.jsonObject
        )
