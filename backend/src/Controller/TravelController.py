from fastapi import APIRouter, status

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema

from uuid import UUID

from src.Decorators import UserDecorators, DriverDecorator, ManagerDecorator

from src.Error.Base.NotFoundError import NotFoundError
from src.Error.User.NotUserResourceError import NotUserResource
from src.Error.User.UserRBACError import UserRBACError

from src.Service import TravelService
from src.Schema.Travel.TravelRealizedEnum import TravelRealized

TRAVEL_ROUTER = APIRouter(
    prefix="/travel",
    tags=["travel"]
)

USER_NOT_FOUND = NotFoundError("transporte")
TRAVEL_NOT_FOUND = NotFoundError("transporte")
NOT_USER_RESOURCE = NotUserResource()
USER_RBAC = UserRBACError()


@TRAVEL_ROUTER.post("/")
async def post_travel(user: UserDecorators.GET_AUTHENTICATED_USER, travel: TravelCreateSchema) -> TravelResponseSchema:
    """
    Cria uma nova viagem:

    **acesso**: `USER` \n
    **parâmetro**: Body: \n
        `TravelCreateSchema` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return TravelService.create_travel(travel, user)


@TRAVEL_ROUTER.get("/")
async def get_all_travels(user: ManagerDecorator.GET_AUTHENTICATED_MANAGER, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    """
    Encontra todas as viagens com paginação:

    **acesso**: `MANAGER` \n
    **parâmetro**: Query param: \n
        `page` \n
        `pageSize` \n
    **retorno**: devolve: \n
        `list[TravelResponseSchema]`
    """
    return TravelService.find_all_travels(pageSize, page)

@TRAVEL_ROUTER.get("/assigned/")
async def get_assigned_travels(user: UserDecorators.GET_AUTHENTICATED_USER, canceled: bool = False, page: int = 0, pageSize: int = 15) -> list[TravelResponseSchema]:
    """
    Encontra todas as viagens atreladas a o usuário com paginação:

    **acesso**: `USER` \n
    **parâmetro**: Query param: \n
        `canceled` \n
        `page` \n
        `pageSize` \n
    **retorno**: devolve: \n
        `list[TravelResponseSchema]`
    """
    return TravelService.find_assigned_travels(user, page, pageSize, canceled)

@TRAVEL_ROUTER.get("/{id}", responses={
    status.HTTP_404_NOT_FOUND: {
        "description": "Usuário não encontrado",
        "content": {
            "application/json": {
                "example": USER_NOT_FOUND.jsonObject
            }
        }
    }
})
async def get_travel_by_id(user: UserDecorators.GET_AUTHENTICATED_USER, id: UUID) -> TravelResponseSchema:
    """
    Encontra uma viagem pelo seu ID:

    **acesso**: `USER` \n
    **parâmetro**: Route param: \n
        `id` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return TravelService.find_travel_by_id(id)


@TRAVEL_ROUTER.post("/cancel/{travelId}", responses={
    status.HTTP_403_FORBIDDEN: {
        "description": "Usuário tentou cancelar uma viagem que não é sua",
        "content": {
            "application/json": {
                "example": NOT_USER_RESOURCE.jsonObject
            }
        }
    }
})
async def cancel_travel(user: UserDecorators.GET_AUTHENTICATED_USER, travelId: UUID) -> TravelResponseSchema:
    """
    Cancela uma viagem pelo seu ID:

    **acesso**: `USER` \n
    **parâmetro**: Route param: \n
        `travelId` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return TravelService.cancel_travel_by_id(user, travelId)

@TRAVEL_ROUTER.post("/start/{id}", responses={
    status.HTTP_404_NOT_FOUND: {
        "description": "A viagem não foi encontrada",
        "content": {
            "application/json": {
                "example": TRAVEL_NOT_FOUND.jsonObject
            }
        }
    }
})
async def start_travel(driver: DriverDecorator.GET_AUTHENTICATED_DRIVER, id: UUID) -> TravelResponseSchema:
    """
    Começa uma viagem pelo seu ID:

    **acesso**: `DRIVER` \n
    **parâmetro**: Route param: \n
        `id` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return TravelService.start_travel_by_id(driver, id)

@TRAVEL_ROUTER.post("/end/{id}", responses={
    status.HTTP_404_NOT_FOUND: {
        "description": "A viagem não foi encontrada",
        "content": {
            "application/json": {
                "example": TRAVEL_NOT_FOUND.jsonObject
            }
        }
    }
})
async def end_travel(user: DriverDecorator.GET_AUTHENTICATED_DRIVER, id: UUID) -> TravelResponseSchema:
    """
    Termina uma viagem pelo seu ID:

    **acesso**: `DRIVER` \n
    **parâmetro**: Route param: \n
        `id` \n
    **retorno**: devolve: \n
        `TravelResponseSchema`
    """
    return TravelService.end_travel_by_id(user, id)
