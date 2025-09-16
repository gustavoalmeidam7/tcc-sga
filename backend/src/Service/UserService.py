from src.Error.ErrorClass import ErrorClass

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Model.User import User

from src.Validator.UserValidator import UserValidator

from src.Repository import UserRepository

from src.Service import SessionService

def create(userSchema: UserCreateSchema) -> 'UserResponseSchema':
    ## TODO VALIDAR MELHOR CPF E TELEFONE
    userModel = userSchema.to_model()
    userModel.password = SessionService.get_password_hash(userModel.password)

    validatorResult = UserValidator().validate(userModel)
    if(not validatorResult.is_valid):
        raise ErrorClass(statusCode=409 ,errors=validatorResult.errors)

    createdUser = UserRepository.create(userModel)

    return UserResponseSchema.model_validate(createdUser)

def delete_by_id(id: int) -> None:
    UserRepository.delete_by_id(id)

def delete_all() -> None:
    """ Deleta todos usuários (usado apenas em testes) """
    UserRepository.delete_all()

def find_all_page_dict(page: int = 0, pagesize: int = 25) -> 'list[UserResponseSchema]':
    page = page or 1        # Transforma page em 1 se o valor for None ou 0
    pagesize = pagesize or 1

    pagesize = max(1, min(pagesize, 50))
    page = max(1, page)

    return list(map(UserResponseSchema.model_validate, UserRepository.find_all_with_page(page, pagesize)))

# TODO Arrumar dps
def __get_user__(id: int) -> 'User':
    return UserRepository.find_by_id(id)
