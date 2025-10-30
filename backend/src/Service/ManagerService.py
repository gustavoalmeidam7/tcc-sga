from typing import Optional
from src.Repository import ManagerRepository, UserRepository, DriverRepository

from src.Model.UpgradeToken import UpgradeToken

from fastapi import HTTPException, status

from src.Model.User import User
from src.Model.Manager import Manager
from src.Model.Driver import Driver

from src.Validator.GenericValidator import unmask_uuid

from src.Schema.User.UserRoleEnum import UserRole

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema
from src.Schema.Driver.DriverCreateSchema import DriverCreateSchema

from src.DB import db

from datetime import datetime
from uuid import UUID

def get_token_info(upgradeTokenId: UUID) -> UpgradeTokenFullResponseSchema:
    token = ManagerRepository.find_token_by_id(unmask_uuid(upgradeTokenId))
    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token não existe")
    
    return UpgradeTokenFullResponseSchema.model_validate(token)

def generate_manager_token_list(tokenNumber: int) -> list[UpgradeToken]:
    """ Gera uma lista de tokens para atualizar para gerente """

    countToken = ManagerRepository.count_token()
    if countToken >= tokenNumber:
        return ManagerRepository.find_all_tokens()

    generateTokens = list(map(lambda n: UpgradeToken(fator_cargo=2), range(tokenNumber)))
    tokens = ManagerRepository.bulk_create_token(generateTokens)
    return tokens

def generate_driver_token() -> UpgradeTokenFullResponseSchema:
    """ Gera um token para atualizar o usuário para motorista """

    driverToken = UpgradeToken(fator_cargo=1)
    driverToken = ManagerRepository.create_token(driverToken)

    if driverToken is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Erro no servidor, tente novamente mais tarde")
    
    return UpgradeTokenFullResponseSchema.model_validate(driverToken)

def upgrade_to_driver_by_id(userId: UUID) -> UserResponseFullSchema:
    """ Atualiza um usuário para motorista pelo seu id """
    pass

def upgrade_user_with_token_id(user: User, tokenId: UUID, driverFields: Optional[DriverCreateSchema]) -> UserResponseFullSchema:
    """ Atualiza um usuário para o fator do respectivo UpgradeToken id """

    token = ManagerRepository.find_token_by_id(unmask_uuid(tokenId))

    upgrade_cargo = {
        UserRole.DRIVER: upgrade_user_to_driver,
        UserRole.MANAGER: upgrade_user_to_manager
    }

    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token não existe")
    
    if token.usado:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token já utilizado")

    return upgrade_cargo[token.fator_cargo](user, token, driverFields)

def upgrade_user_to_manager(user: User, token: UpgradeToken, driverFields: DriverCreateSchema) -> UserResponseFullSchema:
    """ Atualiza um usuário para gerente usando token """

    if user.cargo == UserRole.MANAGER:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário já é gerente")
    
    if token.fator_cargo != UserRole.MANAGER:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Impossível realizar ação com este token")
    
    userUpdated = None

    with db.atomic():
        userUpdated = UserRepository.update_user_by_id(unmask_uuid(user.id), cargo=UserRole.MANAGER)
        manager = ManagerRepository.find_manager_by_id(unmask_uuid(user.id))

        if manager is None:
            ManagerRepository.create_manager(Manager(id=user.id))
        
        ManagerRepository.update_token_by_id(
            unmask_uuid(token.id),
            usado=True,
            revogado_em=datetime.now(),
            usuario=user.id
        )

    if userUpdated is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Erro no servidor, tente novamente mais tarde")

    return UserResponseFullSchema.model_validate(userUpdated)

def upgrade_user_to_driver(user: User, token: UpgradeToken, driverFields: DriverCreateSchema) -> UserResponseFullSchema:
    """ Atualiza um usuário para motorista usando token """

    if user.cargo == UserRole.DRIVER:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário já é motorista")
    
    if token.fator_cargo != UserRole.DRIVER:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Impossível realizar ação com este token")
    
    userUpdated = None

    with db.atomic():
        userUpdated = UserRepository.update_user_by_id(unmask_uuid(user.id), cargo=UserRole.DRIVER)
        driver = DriverRepository.find_driver_by_id(unmask_uuid(userUpdated.id))

        if driver is None:
            driver = Driver(**{**driverFields.model_dump(), "id":userUpdated.id})
            DriverRepository.create_driver_by_id(driver)
        
        ManagerRepository.update_token_by_id(
            unmask_uuid(token.id),
            usado=True,
            revogado_em=datetime.now(),
            usuario=userUpdated.id
        )

    if userUpdated is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Erro no servidor, tente novamente mais tarde")

    return UserResponseFullSchema.model_validate(userUpdated)
