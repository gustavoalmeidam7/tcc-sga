from fastapi import APIRouter

from src.Decorators import ManagerDecorator

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema
from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema

from src.Service import ManagerService

from uuid import UUID

MANAGER_ROUTER = APIRouter(
    prefix="/manager",
    tags=["manager"]
)

@MANAGER_ROUTER.post("/assigndrivertravel/{driver}/{travel}")
async def assign_driver_to_travel(manager: ManagerDecorator.GET_AUTHENTICATED_MANAGER, driver: UUID, travel: UUID) -> TravelResponseSchema:
    """
    Assina uma viagem a um motorista pelo seu id:

    **acesso**: `MANAGER` \n
    **parâmetro**: Route param: \n
        `driver` \n
        `travel` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return ManagerService.assign_driver_to_travel_by_id(driver, travel)

@MANAGER_ROUTER.post("/")
async def create_driver_upgrade_token(manager: ManagerDecorator.GET_AUTHENTICATED_MANAGER) -> UpgradeTokenFullResponseSchema:
    """
    Cria um token de atualização para motorista:

    **acesso**: `MANAGER` \n
    **parâmetro**: Sem parâmetros \n
    **retorno**: devolve: \n
        `UpgradeTokenFullResponseSchema`
    """
    return ManagerService.generate_driver_token()

@MANAGER_ROUTER.post("/assignambulance/{driver}/{ambulanceId}")
async def assign_ambulance_to_driver(manager: ManagerDecorator.GET_AUTHENTICATED_MANAGER, driver: UUID, ambulanceId: UUID) -> AmbulanceFullResponseSchema:
    """
    Assina uma ambulância a um motorista pelo seu id: \n

    **acesso**: `MANAGER` \n
    **parâmetro**: Route parameters: \n
        `driver` : ID do motorista que receberá a ambulância \n
        `ambulanceId` : ID da ambulância que será atribuída \n
    **retorno**: devolve: \n
        `AmbulanceFullResponseSchema`
    """
    return ManagerService.assign_ambulance_to_driver(driver, ambulanceId)
