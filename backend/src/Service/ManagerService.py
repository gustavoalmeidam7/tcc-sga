from src.Repository import ManagerRepository, UserRepository, DriverRepository, TravelRepository, AmbulanceRepository
from typing import Optional

from src.Model.UpgradeToken import UpgradeToken

from fastapi import HTTPException, status

from src.Model.User import User
from src.Model.Manager import Manager
from src.Model.Driver import Driver

from src.Validator.GenericValidator import unmask_uuid
from src.Validator import ManagerValidator

from src.Schema.User.UserRoleEnum import UserRole

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema
from src.Schema.Driver.DriverCreateSchema import DriverCreateSchema
from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema

from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema
from src.Error.Resource.NotFoundResourceError import NotFoundError
from src.Service.DriverService import add_ambulance_atributes

from src.Error.User.UserRBACError import UserRBACError
from src.Error.Server.InternalServerError import InternalServerError
from src.Error.Resource.NotFoundResourceError import NotFoundResource

from src.DB import db

from datetime import datetime
from uuid import UUID

NOT_FOUND_AMBULANCE = NotFoundError("ambulance", "Não foi possível encontrar a ambulância.")
USER_ALREADY_MANAGER = HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário já é gerente")
USER_ALREADY_DRIVER = HTTPException(status.HTTP_400_BAD_REQUEST, "Usuário já é motorista")
INSUFFICIENT_TOKEN = HTTPException(status.HTTP_401_UNAUTHORIZED, "Impossível realizar ação com este token")


"""
    Criar
"""

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

"""
    Ler
"""

def get_token_info(upgradeTokenId: UUID) -> UpgradeTokenFullResponseSchema:
    token = ManagerRepository.find_token_by_id(unmask_uuid(upgradeTokenId))
    if token is None:
        raise NotFoundResource("token", "Token não encontrado")
    
    return UpgradeTokenFullResponseSchema.model_validate(token)

"""
    Atualizar
"""

def upgrade_user_with_token_id(user: User, tokenId: UUID, driverFields: Optional[DriverCreateSchema]) -> UserResponseFullSchema:
    """ Atualiza um usuário para o fator do respectivo UpgradeToken id """

    upgrade_cargo = {
        UserRole.DRIVER: upgrade_user_to_driver,
        UserRole.MANAGER: upgrade_user_to_manager
    }

    token = ManagerRepository.find_token_by_id(unmask_uuid(tokenId))

    ManagerValidator.validate_upgrade_token(token, driverFields)

    return upgrade_cargo[UserRole(token.fator_cargo)](user, token, driverFields)

def upgrade_user_to_manager(user: User, token: UpgradeToken, driverFields: DriverCreateSchema) -> UserResponseFullSchema:
    """ Atualiza um usuário para gerente usando token """

    if user.is_manager:
        raise USER_ALREADY_MANAGER
    
    if token.fator_cargo != UserRole.MANAGER:
        raise INSUFFICIENT_TOKEN
    
    userUpdated = None

    with db.atomic():
        userUpdated = UserRepository.update_user_by_id(user.str_id, cargo=UserRole.MANAGER)
        manager = ManagerRepository.find_manager_by_id(user.str_id)

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

    if user.is_driver:
        raise USER_ALREADY_DRIVER
    
    if token.fator_cargo != UserRole.DRIVER:
        raise INSUFFICIENT_TOKEN
    
    userUpdated = None

    with db.atomic():
        userUpdated = UserRepository.update_user_by_id(user.str_id, cargo=UserRole.DRIVER)

        if not userUpdated:
            raise InternalServerError()
        
        userUpdated: User = userUpdated

        driver = DriverRepository.find_driver_by_id(userUpdated.str_id)

        if driver is None:
            driverDict = {**driverFields.model_dump()}
            driverDict.update({"id_ambulancia": unmask_uuid(driverFields.id_ambulancia), "id":userUpdated.id})
            driver = Driver(**driverDict)
            DriverRepository.create_driver_by_id(driver)
        
        ManagerRepository.update_token_by_id(
            unmask_uuid(token.id),
            usado=True,
            revogado_em=datetime.now(),
            usuario=userUpdated.id
        )

    if userUpdated is None:
        raise InternalServerError()

    return UserResponseFullSchema.model_validate(userUpdated)

def assign_driver_to_travel_by_id(driverId: UUID, travelId: UUID) -> TravelResponseSchema:
    travelId = unmask_uuid(travelId)
    driverId = unmask_uuid(driverId)
    ambulanceId = DriverRepository.find_driver_by_id(driverId).id_ambulancia_id

    assingedTravel = TravelRepository.update_travel(travelId=travelId, id_motorista=driverId, id_ambulancia=ambulanceId)

    if not assingedTravel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Viagem não encontrada"
        )
    
    return TravelResponseSchema.model_validate(assingedTravel)

def assign_ambulance_to_driver(driverId: UUID, ambulanceId: UUID) -> AmbulanceFullResponseSchema:
    driverId = unmask_uuid(driverId)
    ambulance = AmbulanceRepository.find_ambulance_by_id(unmask_uuid(ambulanceId))
    if not ambulance:
        raise NOT_FOUND_AMBULANCE
    
    DriverRepository.update_driver_by_id(driverId, id_ambulancia=ambulance.str_id)

    ambulance = add_ambulance_atributes(ambulance)

    return AmbulanceFullResponseSchema.model_validate(ambulance)
    

"""
    Deletar
"""
