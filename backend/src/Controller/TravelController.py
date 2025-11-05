from fastapi import APIRouter

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema
from src.Schema.Travel.TravelCancelResponseSchema import TravelDeleteResponseSchema

from uuid import UUID

from src.Decorators import UserDecorators, DriverDecorator

from src.Service import TravelService

TRAVEL_ROUTER = APIRouter(
    prefix="/travel",
    tags=["travel"]
)

@TRAVEL_ROUTER.get("/")
async def get_travels(user: DriverDecorator.GET_AUTENTHICATED_DRIVER_OR_HIGER, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    return TravelService.find_all_travels(pageSize, page)

@TRAVEL_ROUTER.get("/assigned")
async def get_assigned_travels(user: UserDecorators.GET_AUTENTHICATED_USER, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    return TravelService.find_assigned_travels(user, page, pageSize)

@TRAVEL_ROUTER.get("/{id}")
async def get_travel_by_id(user: UserDecorators.GET_AUTENTHICATED_USER, id: UUID) -> TravelResponseSchema:
    return TravelService.find_travel_by_id(id)

@TRAVEL_ROUTER.post("/")
async def post_travel(user: UserDecorators.GET_AUTENTHICATED_USER, travel: TravelCreateSchema) -> TravelResponseSchema:
    return TravelService.create_travel(travel, user)

@TRAVEL_ROUTER.delete("/{id}")
async def delete_travel(user: UserDecorators.GET_AUTENTHICATED_USER, id: str) -> TravelDeleteResponseSchema:
    return TravelService.remove_travel(id)
