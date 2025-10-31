from src.Model.Driver import Driver
from src.Repository import DriverRepository, TravelRepository, UserRepository

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema
from src.Schema.Driver.DriverResponseFullSchema import DriverResponseFullSchema
from src.Schema.Driver.DriverCreateSchema import DriverCreateSchema
from src.Schema.Driver.DriverUpdateFieldsSchema import DriverUpdateFieldsSchema

from src.Validator.GenericValidator import unmask_uuid

from playhouse.shortcuts import model_to_dict

from fastapi import HTTPException, status

from src.Model.User import User

from uuid import UUID, uuid4

def assign_driver_travel(driver: User, travelId: UUID) -> TravelResponseSchema:
    ambulanceId = get_driver_by_user(driver).id_ambulancia
    travelId = unmask_uuid(travelId)
    driverId = driver.id

    assingedTravel = TravelRepository.update_travel(travelId=travelId, id_motorista=driverId, id_ambulancia=ambulanceId)

    if not assingedTravel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Viagem não encontrada"
        )
    
    return TravelResponseSchema.model_validate(assingedTravel)

def is_user_driver(userId: UUID) -> bool:
    return UserRepository.find_by_id(unmask_uuid(userId)).cargo == 1

def is_user_driver_or_higer(userId: UUID) -> bool:
    return UserRepository.find_by_id(unmask_uuid(userId)).cargo >= 1

def get_driver_by_user(user: User) -> DriverResponseSchema:
    driver = DriverRepository.find_driver_by_id(user.id)

    driverDict = model_to_dict(driver)
    driverDict.update(model_to_dict(driver.id))
    
    return DriverResponseSchema.model_validate(driverDict)

def update_driver(user: User, driverFields: DriverUpdateFieldsSchema) -> DriverResponseFullSchema:
    """ Atualiza os campos especificos do motorista """
    driverFields = {k: v for k, v in driverFields.model_dump().items() if v is not None}

    driver = DriverRepository.update_driver_by_id(user.id, **driverFields)

    return DriverResponseFullSchema.model_validate(driver)
