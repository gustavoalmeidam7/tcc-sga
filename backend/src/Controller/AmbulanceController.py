from fastapi import APIRouter

from src.Schema.Ambulance.AmbulanceCreateSchema import AmbulanceCreateSchema
from src.Schema.Ambulance.AmbulanceResponseSchema import AmbulanceResponseSchema
from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema
from src.Schema.Ambulance.AmbulanceUpdateSchema import AmbulanceUpdateSchema

from src.Schema.Equipment.EquipmentCreateSchema import EquipmentCreateSchema
from src.Schema.Equipment.EquipmentResponseSchema import EquipmentResponseSchema

from src.Service import AmbulanceService

from src.Decorators import DriverDecorator

from uuid import UUID

AMBULANCE_ROUTER = APIRouter(
    prefix="/ambulance",
    tags=[
        "ambulance"
    ]
)

@AMBULANCE_ROUTER.post("/")
async def create_ambulance(user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, ambulance: AmbulanceCreateSchema) -> AmbulanceFullResponseSchema:
    """
    Cria uma nova ambulância:

    **parâmetro**: Body: \n
        `AmbulanceCreateSchema` \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.create_ambulance(ambulance)

@AMBULANCE_ROUTER.get("/")
async def get_ambulances(user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, page: int = 0, pageSize: int = 30) -> list[AmbulanceFullResponseSchema]:
    """
    Procura por todas as ambulâncias presentes no :

    **parâmetro**: Query parameters: \n
        `page` \n
        `pageSize` \n
    **retorno**: devolve: \n
        `list[AmbulanceResponseSchema]`
    """

    return AmbulanceService.get_ambulances_by_page(page, pageSize)

@AMBULANCE_ROUTER.get("/{ambulanceID}")
async def get_ambulance_by_id(user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, ambulanceID: UUID) -> AmbulanceFullResponseSchema:
    """
    Procura uma ambulância pelo seu id :

    **parâmetro**: Route parameter: \n
        `ambulanceID` \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.get_ambulance_by_id(ambulanceID)

@AMBULANCE_ROUTER.patch("/{id}")
async def update_ambulance(
    user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, id: UUID, updateAmbulance: AmbulanceUpdateSchema
) -> AmbulanceFullResponseSchema:
    """
    Procura por todas as ambulâncias presentes no :

    **parâmetro**: Route parameter: \n
        `id` : ID da ambulância que sera atualizada \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.update_ambulance_by_id(id, updateAmbulance)

@AMBULANCE_ROUTER.post("/add-equipment/{id}")
async def add_equipment_by_ambulance_id(
    user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, id: UUID, equipment: EquipmentCreateSchema
) -> EquipmentResponseSchema:
    """
    Procura por todas as ambulâncias presentes no :

    **parâmetro**: Route parameter: \n
        `id` : ID da ambulância que sera atualizada \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.create_equipment_by_ambulance_id(id, equipment)
