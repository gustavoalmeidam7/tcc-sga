from fastapi import APIRouter

from src.Service import DriverService

from src.Decorators.DriverDecorator import GET_AUTHENTICATED_DRIVER
from src.Decorators import UserDecorators

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema
from src.Schema.Driver.DriverResponseFullSchema import DriverResponseFullSchema
from src.Schema.Driver.DriverUpdateFieldsSchema import DriverUpdateFieldsSchema
from src.Schema.Driver.DriverResponseGetById import DriverResponseGetById

from uuid import UUID

DRIVER_ROUTER = APIRouter(
    prefix="/driver",
    tags=["driver"]
)

@DRIVER_ROUTER.patch("/update/")
async def update_driver(driver: GET_AUTHENTICATED_DRIVER, driverFields: DriverUpdateFieldsSchema) -> DriverResponseFullSchema:
    """
    Atualiza os dados cadastrais de um motorista:

    **acesso**: `DRIVER` \n
    **parâmetro**: Body : \n
        `DriverUpdateFieldsSchema` \n
    **retorno**: devolve: \n
        `DriverResponseFullSchema`
    """
    return DriverService.update_driver(driver, driverFields)

@DRIVER_ROUTER.get("/")
async def get_driver_info(driver: GET_AUTHENTICATED_DRIVER) -> DriverResponseSchema:
    """
    Encontra as informações do motorista autenticado:

    **acesso**: `DRIVER` \n
    **parâmetro**: Sem parâmetros \n
    **retorno**: devolve: \n
        `DriverResponseSchema`
    """
    return DriverService.get_driver_by_user(driver)

@DRIVER_ROUTER.get("/{driverId}")
async def get_driver_by_id(user: UserDecorators.GET_AUTHENTICATED_USER, driverId: UUID) -> DriverResponseGetById:
    """
    Encontra um motorista pelo seu id:

    **acesso**: `USER` \n
    **parâmetro**: Route params \n
        `driverId` \n
    **retorno**: devolve: \n
        `DriverResponseGetById`
    """
    return DriverService.get_driver_by_id(driverId)
