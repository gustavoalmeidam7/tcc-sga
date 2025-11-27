from src.Repository import AmbulanceRepository

from src.Model.Ambulance import Ambulance

from src.DB import db

from src.Schema.Ambulance.AmbulanceResponseSchema import AmbulanceResponseSchema
from src.Schema.Ambulance.AmbulanceFullResponseSchema import AmbulanceFullResponseSchema
from src.Schema.Ambulance.AmbulanceCreateSchema import AmbulanceCreateSchema
from src.Schema.Ambulance.AmbulanceUpdateSchema import AmbulanceUpdateSchema

from src.Error.Server.InternalServerError import InternalServerError

from src.Validator.GenericValidator import unmask_uuid

from uuid import UUID

def create_ambulance(ambulance: AmbulanceCreateSchema) -> AmbulanceResponseSchema:
    """ Cria uma nova ambulância """

    ambulanceModel = Ambulance(**ambulance.model_dump())

    ambulanceModel = AmbulanceRepository.create_ambulance(ambulanceModel)

    return AmbulanceResponseSchema.model_validate(ambulanceModel)

def get_ambulances_by_page(page: int = 0, pageSize: int = 30) -> list[AmbulanceFullResponseSchema]:
    """ Procura todos as ambulâncias presentes na página `page` """

    if pageSize > 30:
        pageSize = 30

    ambulances = AmbulanceRepository.find_ambulances_by_page(page, pageSize)
    return list(map(lambda a: AmbulanceFullResponseSchema.model_validate(a), ambulances)) or []

def update_ambulance_by_id(id: UUID, ambulanceUpdate: AmbulanceUpdateSchema) -> AmbulanceFullResponseSchema:
    """ Atualiza uma ambulância pelo seu id """

    ambulanceUpdated = None

    with db.atomic() as atomic:
        ambulanceUpdated = AmbulanceRepository.update_ambulance_ignore_none(unmask_uuid(id), **ambulanceUpdate.model_dump())

        if not ambulanceUpdated:
            atomic.rollback()
            raise InternalServerError()
        
    return AmbulanceFullResponseSchema.model_validate(ambulanceUpdated)
