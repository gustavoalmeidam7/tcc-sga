from fastapi import APIRouter

from src.Service import DriverService

from uuid import UUID

from src.Decorators.DriverDecorator import GET_AUTENTHICATED_DRIVER

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelListResponseSchema import TravelListResponseSchema

DriverRouter = APIRouter(
    prefix="/driver",
    tags=["driver"]
)

@DriverRouter.post("/travel/{travel}")
async def assing_driver_to_travel(driver: GET_AUTENTHICATED_DRIVER, travel: UUID) -> TravelResponseSchema:
    """ Assina o motorista e a respectiva ambulância a uma viagem """
    return DriverService.assign_driver_travel(driver, travel)

@DriverRouter.get("/travels/")
async def get_assigned_travels(driver: GET_AUTENTHICATED_DRIVER) -> TravelListResponseSchema:
    """ Encontra todas viagens que um motorista está escrito """
    return DriverService.find_assigned_travels(driver)

@DriverRouter.get("/")
async def get_driver_info(driver: GET_AUTENTHICATED_DRIVER) -> DriverResponseSchema:
    """ Encontra as informações do motorista """
    return DriverService.get_driver_by_user(driver)
