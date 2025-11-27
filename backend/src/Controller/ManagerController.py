from fastapi import APIRouter

from src.Decorators import ManagerDecorator

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema

from src.Service import ManagerService

from uuid import UUID

MANAGER_ROUTER = APIRouter(
    prefix="/manager",
    tags=["manager"]
)

# TODO: VALIDAR SE A VIAGEM ESTÁ CANCELADA
@MANAGER_ROUTER.post("/assigndrivertravel/{driver}/{travel}")
async def assing_driver_to_travel(manager: ManagerDecorator.GET_AUTHENTICATED_MANAGER, driver: UUID, travel: UUID) -> TravelResponseSchema:
    """ Assina o motorista e a respectiva ambulância a uma viagem """
    return ManagerService.assign_driver_to_travel_by_id(driver, travel)

@MANAGER_ROUTER.post("/")
async def create_driver_upgrade_token(manager: ManagerDecorator.GET_AUTHENTICATED_MANAGER) -> UpgradeTokenFullResponseSchema:
    """ Cria um token para atualizar um usuário para motorista """
    return ManagerService.generate_driver_token()
