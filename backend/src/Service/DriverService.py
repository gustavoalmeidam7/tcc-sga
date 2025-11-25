from src.Repository import DriverRepository, UserRepository, AmbulanceRepository

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema
from src.Schema.Driver.DriverResponseFullSchema import DriverResponseFullSchema
from src.Schema.Driver.DriverUpdateFieldsSchema import DriverUpdateFieldsSchema
from src.Schema.Driver.DriverResponseGetById import DriverResponseGetById

from src.Error.Server.InternalServerError import InternalServerError
from src.Error.Resource.NotFoundResourceError import NotFoundError

from src.Validator.GenericValidator import unmask_uuid

from playhouse.shortcuts import model_to_dict

from src.Model.User import User
from src.Model.Driver import Driver
from src.Model.Ambulance import Ambulance

from typing import Any

from uuid import UUID


NOT_FOUND_DRIVER = NotFoundError("driver", "Não foi possível encontrar o motorista.")


"""
    Helpers
"""

def is_user_driver(userId: UUID) -> bool:
    user = UserRepository.find_by_id(unmask_uuid(userId))
    if not user:
        raise InternalServerError()

    return bool(user.is_driver)

def is_user_driver_or_higer(userId: UUID) -> bool:
    user = UserRepository.find_by_id(unmask_uuid(userId))
    if not user:
        raise InternalServerError()

    return bool(user.is_driver_or_higher)

def append_ambulanceid_to_driver(driver: Driver) -> DriverResponseSchema:
    driverDict = model_to_dict(driver)
    driverDict.update(model_to_dict(driver.id))
    driverDict.update({"id_ambulancia": driver.str_id_ambulancia})
    
    return DriverResponseSchema.model_validate(driverDict)

def add_ambulance_atributes(ambulance: Ambulance) -> dict[Any, Any]:
    """" Adiciona informações para ambulância para full schema """

    ambulanceIdUnmasked = ambulance.str_id

    equipments = AmbulanceRepository.find_ambulance_equipments_by_id(ambulanceIdUnmasked)
    driver = AmbulanceRepository.find_driver_by_ambulance_id(ambulanceIdUnmasked)
    driverId = driver.uuid_id if driver else None

    ambulanceDict = model_to_dict(ambulance, recurse=False)
    equipmentsDict = list(map(lambda e: model_to_dict(e, recurse=False), equipments)) or []
    ambulanceDict.update({"equipamentos": equipmentsDict, "motorista_id": driverId})

    return ambulanceDict

"""
    Criar
"""

"""
    Ler
"""

def get_driver_by_user(user: User) -> DriverResponseSchema:
    driver = DriverRepository.find_driver_by_id(user.str_id)
    
    if not driver:
        raise NOT_FOUND_DRIVER

    return append_ambulanceid_to_driver(driver)

def get_driver_by_id(driverId: UUID) -> DriverResponseGetById:
    driver = DriverRepository.find_driver_by_id(unmask_uuid(driverId))
    
    if not driver:
        raise NOT_FOUND_DRIVER

    driverDict = model_to_dict(driver, recurse=False)

    if not driver.is_ambulancia_none:
        ambulance = AmbulanceRepository.find_ambulance_joined_by_id(driver.str_id_ambulancia)
        if not ambulance:
            InternalServerError()
        ambulanceDict = add_ambulance_atributes(ambulance)

        driverDict.update({"ambulancia": ambulanceDict})
    
    return DriverResponseGetById.model_validate(driverDict)

"""
    Atualizar
"""

def update_driver(user: User, driverFields: DriverUpdateFieldsSchema) -> DriverResponseFullSchema:
    """ Atualiza os campos específicos do motorista """
    driverFields = {k: v for k, v in driverFields.model_dump().items() if v is not None}

    driver = DriverRepository.update_driver_by_id(user.str_id, **driverFields)

    return DriverResponseFullSchema.model_validate(driver)


"""
    Deletar
"""
