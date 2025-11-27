from fastapi import status

from src.Schema.User.UserCreateSchema import UserCreateSchema
from src.Schema.User.UserResponseSchema import UserResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.User.UserUpdateResponseSchema import UserUpdateResponseSchema
from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.User.UserUpdateSchema import UserUpdateSchema
from src.Schema.User.UserRestorePasswordSchema import UserRestorePasswordSchema

from src.Error.Server.InternalServerError import InternalServerError
from src.Error.Resource.NotFoundResourceError import NotFoundResource
from src.Error.Base.ErrorListClass import ErrorListClass
from src.Error.Server.TryAgainLater import TryAgainLater

from src.Model.User import User
from src.Model.RestorePassword import RestorePassword

from src.Validator.UserValidator import UserValidator
from src.Validator.GenericValidator import unmask_uuid

from uuid import UUID
from pydantic import EmailStr

from src.Utils import env

import re

from src.Repository import UserRepository, RestorePasswordRepository
from src.Service import SessionService

import httpx

"""
    Helpers
"""

def create_restore_password_code(userEmail: EmailStr) -> tuple[RestorePassword, User]:
    user = UserRepository.find_by_email(userEmail)
    if not user:
        raise NotFoundResource("user", f"O usuário com email {userEmail} não foi encontrado.")
    
    RestorePasswordRepository.delete_all_user_restore_codes(user.str_id)
    
    restorePassword = RestorePasswordRepository.create_restore_password(RestorePassword(usuario= user))

    return (restorePassword, user)

def append_query_params(base: str, key: list[str], value: list[str]) -> str:
    last = base

    for (k, v) in zip(key, value):
        separator = "&" if last.find("?") > 0 else "?"
        last = "".join([last, separator, k, "=", v])

    return last

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

async def send_restore_password_email(userRestore: UserRestorePasswordSchema) -> None:
    (restoreCode, user) = create_restore_password_code(userRestore.userEmail)

    mailGunApiKey = env.get_env_var("MAILGUN_API_KEY")
    mailGunSandbox = env.get_env_var("MAILGUN_SANDBOX")
    urlBase = f"https://api.mailgun.net/v3/{mailGunSandbox}.mailgun.org/messages"
    mailGunFrom = f"Serviço SGA <postmaster@{mailGunSandbox}.mailgun.org>"

    if not mailGunApiKey or not urlBase or not mailGunApiKey:
        raise InternalServerError()

    keys = ["from", "to", "subject", "template", "h:X-Mailgun-Variables"]
    values = [
        mailGunFrom,
        userRestore.userEmail,
        "SGA Código de recuperação de senha",
        "password-restore",
        f"{{\"RESTORE_CODE\": \"{restoreCode.str_id}\",\"USERNAME\": \"{user.nome}\"}}"
    ]

    url = append_query_params(urlBase, keys, values)
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers={"api": mailGunApiKey},
            auth=("api", mailGunApiKey)
        )

        if response.status_code != status.HTTP_200_OK:
            raise TryAgainLater("Erro no envio do email! tente novamente mais tarde")


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
