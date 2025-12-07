from src.Repository import AmbulanceRepository, DriverRepository

from src.Model.Ambulance import Ambulance
from src.Model.Equipment import Equipment

from peewee import IntegrityError

from src.DB import db

from playhouse.shortcuts import model_to_dict

from src.Schema.Ambulance.AmbulanceResponseSchema import AmbulanceResponseSchema
from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema
from src.Schema.Ambulance.AmbulanceCreateSchema import AmbulanceCreateSchema
from src.Schema.Ambulance.AmbulanceUpdateSchema import AmbulanceUpdateSchema

from src.Schema.Equipment.EquipmentCreateSchema import EquipmentCreateSchema
from src.Schema.Equipment.EquipmentResponseSchema import EquipmentResponseSchema
from src.Schema.Equipment.EquipmentUpdateSchema import EquipmentUpdateSchema

from src.Error.Server.InternalServerError import InternalServerError

from src.Error.Base.NotFoundError import NotFoundError
from src.Error.Resource.AlreadyExistsError import AlreadyExists

from src.Validator.GenericValidator import unmask_uuid

from uuid import UUID

AMBULANCE_NOT_FOUND = NotFoundError("ambulância")

"""
    Helpers
"""
def add_ambulance_atributes(ambulance: Ambulance) -> AmbulanceFullResponseSchema:
    """" Adiciona informações para ambulância para full schema """

    ambulanceIdUnmasked = ambulance.str_id

    equipments = AmbulanceRepository.find_ambulance_equipments_by_id(ambulanceIdUnmasked)
    driver = AmbulanceRepository.find_driver_by_ambulance_id(ambulanceIdUnmasked)
    driverId = driver.uuid_id if driver else None

    ambulanceDict = model_to_dict(ambulance, recurse=False)
    equipmentsDict = list(map(lambda e: model_to_dict(e, recurse=False), equipments)) or []
    ambulanceDict.update({"equipamentos": equipmentsDict, "motorista_id": driverId})

    return AmbulanceFullResponseSchema.model_validate(ambulanceDict)

"""
    Criar
"""
def create_ambulance(ambulance: AmbulanceCreateSchema) -> AmbulanceFullResponseSchema:
    """ Cria uma nova ambulância """

    ambulanceModel = Ambulance(**ambulance.model_dump())
    
    try:
        ambulanceModel = AmbulanceRepository.create_ambulance(ambulanceModel)
    except IntegrityError:
        raise AlreadyExists("ambulância")

    return add_ambulance_atributes(ambulanceModel)

def create_equipment_by_ambulance_id(ambulanceId: UUID, equipmentCreate: EquipmentCreateSchema) -> EquipmentResponseSchema:
    """ Cria um novo equipamento e adiciona a respectiva ambulância do ambulanceId"""

    if not AmbulanceRepository.ambulance_exits_by_id(unmask_uuid(ambulanceId)):
        raise AMBULANCE_NOT_FOUND
    
    equipmentDict = equipmentCreate.model_dump()
    equipmentDict.update({"id_ambulancia": unmask_uuid(ambulanceId)})

    equipment = Equipment(**equipmentDict)
    equipment = AmbulanceRepository.create_equipment(equipment)

    return EquipmentResponseSchema.model_validate(equipment)

"""
    Ler
"""

def get_ambulances_by_page(page: int = 0, pageSize: int = 30) -> list[AmbulanceFullResponseSchema]:
    """ Procura todos as ambulâncias presentes na página `page` """

    if pageSize > 30:
        pageSize = 30

    ambulances = AmbulanceRepository.find_ambulances_by_page(page, pageSize)
    return list(map(lambda a: add_ambulance_atributes(a), ambulances)) or []

def get_ambulance_by_id(ambulanceId: UUID) -> AmbulanceFullResponseSchema:
    """ Procura uma ambulância pelo seu id """

    ambulanceIdUnmasked = unmask_uuid(ambulanceId)

    ambulance = AmbulanceRepository.find_ambulance_by_id(ambulanceIdUnmasked)
    if not ambulance:
        raise AMBULANCE_NOT_FOUND

    return add_ambulance_atributes(ambulance)

"""
    Atualizar
"""

def update_ambulance_by_id(id: UUID, ambulanceUpdate: AmbulanceUpdateSchema) -> AmbulanceFullResponseSchema:
    """ Atualiza uma ambulância pelo seu id """

    ambulanceUpdated = None

    if not AmbulanceRepository.ambulance_exits_by_id(unmask_uuid(id)):
        raise AMBULANCE_NOT_FOUND

    with db.atomic() as atomic:
        ambulanceUpdated = AmbulanceRepository.update_ambulance_ignore_none(unmask_uuid(id), **ambulanceUpdate.model_dump())

        if not ambulanceUpdated:
            atomic.rollback()
            raise InternalServerError()
        
    return add_ambulance_atributes(ambulanceUpdated)

def update_equipment_by_id(equipmentId: UUID, equipmentUpdate: EquipmentUpdateSchema) -> EquipmentResponseSchema:
    """ Atualiza um equipamento pelo seu ID """

    equipmentUpdated = AmbulanceRepository.update_equipment_ignore_none(unmask_uuid(equipmentId), **equipmentUpdate.model_dump())

    return EquipmentResponseSchema.model_validate(equipmentUpdated)

"""
    Deletar
"""

def delete_equipment_by_id(equipmentId: UUID) -> None:
    """ Delete um equipamento pelo seu ID """

    AmbulanceRepository.delete_equipment(unmask_uuid(equipmentId))

def delete_ambulance_by_id(ambulanceId: UUID) -> None:
    """ Delete um ambulância pelo seu ID """

    AmbulanceRepository.delete_ambulance(unmask_uuid(ambulanceId))
