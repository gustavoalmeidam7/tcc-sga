from src.Repository import DriverRepository, UserRepository

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema
from src.Schema.Driver.DriverResponseFullSchema import DriverResponseFullSchema
from src.Schema.Driver.DriverUpdateFieldsSchema import DriverUpdateFieldsSchema

from src.Error.Server.InternalServerError import InternalServerError

from src.Validator.GenericValidator import unmask_uuid

from playhouse.shortcuts import model_to_dict

from src.Model.User import User

from uuid import UUID

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

"""
    Criar
"""

"""
    Ler
"""

def get_driver_by_user(user: User) -> DriverResponseSchema:
    driver = DriverRepository.find_driver_by_id(user.str_id)

    driverDict = model_to_dict(driver)
    driverDict.update(model_to_dict(driver.id))
    driverDict.update({"id_ambulancia": driver.id_ambulancia_id})
    
    return DriverResponseSchema.model_validate(driverDict)

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
