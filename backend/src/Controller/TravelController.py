from fastapi import APIRouter

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema
from src.Schema.Travel.TravelDeleteResponseSchema import TravelDeleteResponseSchema

from uuid import UUID

from src.Decorators.UserDecorators import GET_AUTENTHICATED_USER

from src.Service import TravelService

TravelRouter = APIRouter(
    prefix="/travel",
    tags=["travel"]
)

@TravelRouter.get("/")
def get_travels(user: GET_AUTENTHICATED_USER, viagensPorPagina: int = 15, pagina: int = 0) -> list[TravelResponseSchema]:
    return TravelService.find_all_travels(viagensPorPagina, pagina)

@TravelRouter.post("/")
def post_travel(user: GET_AUTENTHICATED_USER, travel: TravelCreateSchema) -> TravelResponseSchema:
    return TravelService.create_travel(travel, user)

@TravelRouter.delete("/{id}")
def delete_travel(id: str) -> TravelDeleteResponseSchema:
    return TravelService.remove_travel(id)
