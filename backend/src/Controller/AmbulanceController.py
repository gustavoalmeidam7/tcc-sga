from fastapi import APIRouter, status

from src.Schema.Ambulance.AmbulanceCreateSchema import AmbulanceCreateSchema
from src.Schema.Ambulance.AmbulanceResponseSchema import AmbulanceResponseSchema
from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema
from src.Schema.Ambulance.AmbulanceUpdateSchema import AmbulanceUpdateSchema

from src.Schema.Equipment.EquipmentCreateSchema import EquipmentCreateSchema
from src.Schema.Equipment.EquipmentResponseSchema import EquipmentResponseSchema
from src.Schema.Equipment.EquipmentUpdateSchema import EquipmentUpdateSchema

from src.Service import AmbulanceService, DriverService

from src.Service.AmbulanceService import AMBULANCE_NOT_FOUND

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

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Body: \n
        `AmbulanceCreateSchema` \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.create_ambulance(ambulance)

@AMBULANCE_ROUTER.post("/assign/{ambulanceId}")
async def self_assign_ambulance(
    driver: DriverDecorator.GET_AUTHENTICATED_DRIVER,
    ambulanceId: UUID,
) -> AmbulanceFullResponseSchema:
    """
    Assina a ambulância fornecida no ambulanceId a o motorista autenticado : \n

    **acesso**: `DRIVER` \n
    **parâmetro**: Route parameter: \n
        `ambulanceId` : ID da ambulância que será assinada \n
    **retorno**: AmbulanceFullResponseSchema
    """

    return DriverService.assign_ambulance_to_driver(driver, ambulanceId)

@AMBULANCE_ROUTER.get("/")
async def get_ambulances(user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER, page: int = 0, pageSize: int = 30) -> list[AmbulanceFullResponseSchema]:
    """
    Procura por todas as ambulâncias presentes no :

    **acesso**: `DRIVER_OR_HIGHER` \n
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

    **acesso**: `DRIVER_OR_HIGHER` \n
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

    **acesso**: `DRIVER_OR_HIGHER` \n
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

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Route parameter: \n
        `id` : ID da ambulância que sera atualizada \n
    **retorno**: devolve: \n
        `AmbulanceResponseSchema`
    """

    return AmbulanceService.create_equipment_by_ambulance_id(id, equipment)

@AMBULANCE_ROUTER.post("/update-equipment/{equipmentId}")
async def update_equipment_by_id(
    user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER,
    equipmentId: UUID,
    updateEquipment: EquipmentUpdateSchema
) -> EquipmentResponseSchema:
    """
    Atualiza um equipamento pelo seu id :

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Route parameter: \n
        `id` : ID do equipamento que será atualizado \n
    Body: \n
        `EquipmentUpdateSchema` \n
    **retorno**: devolve: \n
        `EquipmentResponseSchema`
    """

    return AmbulanceService.update_equipment_by_id(equipmentId, updateEquipment)

@AMBULANCE_ROUTER.delete("/equipment/{equipmentId}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment_by_id(
    user: DriverDecorator.GET_AUTHENTICATED_DRIVER_OR_HIGHER,
    equipmentId: UUID,
) -> None:
    """
    Deleta um equipamento pelo seu id :

    **acesso**: `DRIVER_OR_HIGHER` \n
    **parâmetro**: Route parameter: \n
        `id` : ID do equipamento que será atualizado \n
    **retorno**: 204 NO CONTENT
    """

    return AmbulanceService.delete_equipment_by_id(equipmentId)
