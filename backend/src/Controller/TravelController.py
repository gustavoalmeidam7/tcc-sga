from fastapi import APIRouter

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema

from uuid import UUID

from src.Decorators import UserDecorators, DriverDecorator, ManagerDecorator

from src.Service import TravelService
from src.Schema.Travel.TravelRealizedEnum import TravelRealized

TRAVEL_ROUTER = APIRouter(
    prefix="/travel",
    tags=["travel"]
)


@TRAVEL_ROUTER.post("/")
async def post_travel(user: UserDecorators.GET_AUTENTHICATED_USER, travel: TravelCreateSchema) -> TravelResponseSchema:
    return TravelService.create_travel(travel, user)


@TRAVEL_ROUTER.get("/")
async def get_all_travels(user: ManagerDecorator.GET_AUTENTHICATED_MANAGER, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    return TravelService.find_all_travels(pageSize, page)

@TRAVEL_ROUTER.get("/assigned/")
async def get_assigned_travels(user: UserDecorators.GET_AUTENTHICATED_USER, canceled: bool = False, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    return TravelService.find_assigned_travels(user, page, pageSize, canceled)

@TRAVEL_ROUTER.get("/{id}")
async def get_travel_by_id(user: UserDecorators.GET_AUTENTHICATED_USER, id: UUID) -> TravelResponseSchema:
    return TravelService.find_travel_by_id(id)


@TRAVEL_ROUTER.post("/cancel/{id}")
async def cancel_travel(user: UserDecorators.GET_AUTENTHICATED_USER, id: UUID) -> TravelResponseSchema:
    return TravelService.update_assigned_travel_ignore_none_by_id(id, user, cancelada=True)

# TODO: VALIDAR SE A VIAGEM ESTÁ CANCELADA
@TRAVEL_ROUTER.post("/start/{id}")
async def start_travel(user: DriverDecorator.GET_AUTENTHICATED_DRIVER, id: UUID) -> TravelResponseSchema:
    return TravelService.update_assigned_travel_ignore_none_by_id(id, user, realizado=TravelRealized.EM_PROGRESSO)

@TRAVEL_ROUTER.post("/end/{id}")
async def end_travel(user: DriverDecorator.GET_AUTENTHICATED_DRIVER, id: UUID) -> TravelResponseSchema:
    return TravelService.update_assigned_travel_ignore_none_by_id(id, user, realizado=TravelRealized.REALIZADO)
