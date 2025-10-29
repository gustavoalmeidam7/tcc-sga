from src.Repository import ManagerRepository, UserRepository

from src.Model.UpgradeToken import UpgradeToken

from fastapi import HTTPException, status

from src.Model.User import User
from src.Model.Manager import Manager

from src.Validator.GenericValidator import unmask_uuid

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema

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
    
def upgrade_account_to_manager(user: User, tokenId: UUID) -> UserResponseFullSchema:
    """ Atualiza um usuário para gerente usando token """

    token = ManagerRepository.find_token_by_id(unmask_uuid(tokenId))

    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token não existe")
    
    if token.usado:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token já utilizado")
    
    if user.cargo == 2:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário já é gerente")
    
    userUpdated = None

    with db.atomic():
        userUpdated = UserRepository.update_user_by_id(unmask_uuid(user.id), cargo=2)
        manager = ManagerRepository.find_manager_by_id(unmask_uuid(user.id))

        if manager is None:
            ManagerRepository.create_manager(Manager(id=user.id))
        
        ManagerRepository.update_token_by_id(
            unmask_uuid(tokenId),
            usado=True,
            revogado_em=datetime.now(),
            usuario=user.id
        )

    if userUpdated is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Erro no servidor, tente novamente mais tarde")

    return UserResponseFullSchema.model_validate(userUpdated)
