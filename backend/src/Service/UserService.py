from fastapi import status

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.User.UserUpdateResponseSchema import UserUpdateResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.User.UserUpdateSchema import UserUpdateSchema

from src.Error.Server.InternalServerError import InternalServerError
from src.Error.Base.ErrorListClass import ErrorListClass

from src.Model.User import User

from src.Validator.UserValidator import UserValidator
from src.Validator.GenericValidator import unmask_uuid

from uuid import UUID

from src.Repository import UserRepository
from src.Service import SessionService

"""
    Helpers
"""

"""
    Criar
"""

def create(userSchema: UserCreateSchema) -> UserResponseFullSchema:
    userModel = User(**userSchema.model_dump())
    userModel.senha = SessionService.get_password_hash(str(userModel.senha))

    validatorResult = UserValidator().validate(userModel)
    
    if not validatorResult.is_valid:
        raise ErrorListClass(statusCode=status.HTTP_409_CONFLICT ,errors=validatorResult.errors)

    createdUser = UserRepository.create(userModel)

    return UserResponseFullSchema.model_validate(createdUser)


"""
    Ler
"""

def find_all_page_dict(page: int = 0, pageSize: int = 25) -> list[UserResponseSchema]:
    """ Busca todos usuários usando sistema de páginação """
    page = page or 1        # Transforma page em 1 se o valor for None ou 0
    pageSize = pageSize or 1

    pageSize = max(1, min(pageSize, 50))
    page = max(1, page)

    return list(map(UserResponseSchema.model_validate, UserRepository.find_all_with_page(page, pageSize)))

def find_user_by_id(userId: UUID) -> UserResponseFullSchema | None:
    """ Busca um usuário pelo seu id """
    user = UserRepository.find_by_id(unmask_uuid(userId))
    
    if user is None:
        return None
    
    return UserResponseFullSchema.model_validate(user)

"""
    Atualizar
"""

def update_user(user: User, updateFields: UserUpdateSchema) -> UserUpdateResponseSchema:
    """ Atualiza um usuário do banco de dados """
    userId = str(user.id)

    user = UserRepository.update_user_by_id(userId, **updateFields.model_dump())
    UserRepository.create_role_by_user_id(userId, user.cargo)
    UserUpdateResponseSchema.model_validate(user)
    return UserUpdateResponseSchema.model_validate(user)

"""
    Deletar
"""

def delete_by_id(id: int) -> None:
    """ Deleta um usuário pelo seu id """
    SessionService.revoke_all_sessions_by_user_id(id)
    UserRepository.delete_by_id(id)

def delete_all() -> None:
    """ Deleta todos usuários (usado apenas em testes) """
    UserRepository.delete_all()
