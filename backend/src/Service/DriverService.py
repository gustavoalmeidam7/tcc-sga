from src.Model.Driver import Driver
from src.Repository import DriverRepository, TravelRepository

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema

from src.Schema.Driver.DriverResponseSchema import DriverResponseSchema

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

def is_user_driver(user: User) -> bool:
    return user.cargo > 0

def get_driver_by_user(user: User) -> DriverResponseSchema | None:
    driver = DriverRepository.find_driver_by_id(user.id)
    if driver is None:
        return None

    driverDict = model_to_dict(driver)
    driverDict.update(model_to_dict(driver.id))
    
    return DriverResponseSchema.model_validate(driverDict)
