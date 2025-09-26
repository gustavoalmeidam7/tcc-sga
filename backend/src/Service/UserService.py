from src.Error.ErrorClass import ErrorClass

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.User.UserUpdateResponseSchema import UserUpdateResponseSchema
from src.Model.User import User

from src.Validator.UserValidator import UserValidator

from src.Repository import UserRepository

from src.Service import SessionService

def create(userSchema: UserCreateSchema) -> 'UserResponseSchema':
    ## TODO VALIDAR MELHOR CPF E TELEFONE
    userModel = User(**userSchema.model_dump())
    userModel.senha = SessionService.get_password_hash(userModel.senha)

    validatorResult = UserValidator().validate(userModel)
    if(not validatorResult.is_valid):
        raise ErrorClass(statusCode=409 ,errors=validatorResult.errors)

    createdUser = UserRepository.create(userModel)

    return UserResponseSchema.model_validate(createdUser)

def delete_by_id(id: int) -> None:
    """ Deleta um usuário pelo seu id """
    SessionService.revoke_all_sessions_by_user_id(id)
    UserRepository.delete_by_id(id)

def delete_all() -> None:
    """ Deleta todos usuários (usado apenas em testes) """
    UserRepository.delete_all()

def find_all_page_dict(page: int = 0, pageSize: int = 25) -> 'list[UserResponseSchema]':
    """ Busta todos usuários usando sistema de páginação """
    page = page or 1        # Transforma page em 1 se o valor for None ou 0
    pageSize = pageSize or 1

    pageSize = max(1, min(pageSize, 50))
    page = max(1, page)

    return list(map(UserResponseSchema.model_validate, UserRepository.find_all_with_page(page, pageSize)))

def update_user(user: User, updateFields: dict) -> UserUpdateResponseSchema:
    """ Atualiza um usuário do banco de dados """
    return UserUpdateResponseSchema.model_validate(user)
