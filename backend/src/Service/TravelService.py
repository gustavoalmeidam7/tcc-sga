from src.Repository import TravelRepository

from fastapi import HTTPException, status

from src.Model.Travel import Travel
from src.Model.User import User 

from uuid import UUID
from datetime import datetime, timezone

from src.Validator.GenericValidator import unmask_uuid, mask_uuid

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema
from src.Schema.Travel.TravelRealizedEnum import TravelRealized

from src.Validator.TravelValidator import TravelValidator

from src.Error.User.NotUserResourceError import NotUserResource
from src.Error.Base.NotFoundError import NotFoundError

NOT_USER_RESOURCE = NotUserResource()

def update_travel_by_id_ignore_none(travelId: UUID, **fields) -> TravelResponseSchema:
    """ Atualiza uma viagem com os campos (fields) fornecidos ignorando campos nulos """

    filteredArgs = {k: v for k,v in fields.items() if v is not None}

    updatedTravel = TravelRepository.update_travel(unmask_uuid(travelId), **filteredArgs)

    if updatedTravel is None:
        raise NotFoundError("transporte")

    return TravelResponseSchema.model_validate(updatedTravel)


def create_travel(travel: TravelCreateSchema, user: User) -> TravelResponseSchema:
    """ Cria uma nova viagem """

    travelDict = travel.model_dump()
    
    travelModel = Travel(**travelDict)
    travelModel.id_paciente = user.str_id
    travelModel.criado_em = datetime.now(timezone.utc)
    travelModel.realizado = TravelRealized.NAO_REALIZADO

    TravelRepository.insert_travel(travelModel)

    return TravelResponseSchema.model_validate(travelModel)

def find_travel_by_id(travelId: UUID | str) -> TravelResponseSchema:
    """ Encontra uma travel pelo seu ID """

    travelId = unmask_uuid(travelId)
    travel = TravelRepository.find_travel_by_id(travelId)

    if travel is None:
        raise NotFoundError("transporte")
    
    return TravelResponseSchema.model_validate(travel)

def find_all_travels(itemsPerPage: int = 15, page: int = 0) -> list[TravelResponseSchema]:
    """ Encontra todas viagens e ordena de mais recente para mais antiga """

    itemsPerPage = itemsPerPage or 15
    page = page or 0

    travels = TravelRepository.find_all_travels(itemsPerPage, page)

    return list(map(TravelResponseSchema.model_validate, travels))

def find_assigned_travels(user: User, page: int, pageSize: int, canceled: bool = False) -> list[TravelResponseSchema]:
    """ Encontra as viagens assinadas para usuário user, se canceled == False não serão mostradas viagens canceladas """

    travels = TravelRepository.find_assigned_travels(user, page, pageSize)

    if not canceled:
        travels = [t for t in travels if t.cancelada == False]

    return list(map(lambda t: TravelResponseSchema.model_validate(t), travels))

def cancel_travel_by_id(user: User, travelId: UUID) -> TravelResponseSchema:
    """ Atualiza o estado de uma viagem para cancelada pelo seu id """

    travel = find_travel_by_id(travelId)

    if travel.id_paciente != user.uuid_id:
        raise NOT_USER_RESOURCE

    if not travel.cancelada:
        travel = update_travel_by_id_ignore_none(travel.id, cancelada=True)
        travel = TravelResponseSchema.model_validate(travel)

    return travel

def start_travel_by_id(driver: User, travelId: UUID) -> TravelResponseSchema:
    """ Atualiza o estado de uma viagem para iniciada pelo seu id """

    travel = find_travel_by_id(travelId)
    travelValidator = TravelValidator(travel, driver)
    
    travelValidator.validate_start_travel()
    
    travel = update_travel_by_id_ignore_none(travel.id, realizado=TravelRealized.EM_PROGRESSO)
    travel = TravelResponseSchema.model_validate(travel)
    return travel

def end_travel_by_id(driver: User, travelId: UUID) -> TravelResponseSchema:
    """ Atualiza o estado de uma viagem para terminada pelo seu id """

    travel = find_travel_by_id(travelId)
    travelValidator = TravelValidator(travel, driver)
    
    travelValidator.validate_end_travel()
    
    travel = update_travel_by_id_ignore_none(travel.id, realizado=TravelRealized.REALIZADO)
    travel = TravelResponseSchema.model_validate(travel)
    return travel
