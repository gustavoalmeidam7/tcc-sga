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

from src.Error.User.UserRBACError import UserRBACError
from src.Error.User.NotUserResourceError import NotUserResource
from src.Error.Base.NotFoundError import NotFoundError

def create_travel(travel: TravelCreateSchema, user: User) -> TravelResponseSchema:
    """ Cria uma nova viagem """

    travelDict = travel.model_dump()
    
    travelModel = Travel(**travelDict)
    travelModel.id_paciente = str(user.id)
    travelModel.criado_em = datetime.now(timezone.utc)
    travelModel.realizado = TravelRealized.NAO_REALIZADO

    TravelRepository.insert_travel(travelModel)

    return TravelResponseSchema.model_validate(travelModel)

def find_travel_by_id(travelId: UUID | str) -> TravelResponseSchema:
    """ Encontra uma travel pelo seu ID """

    travelId = unmask_uuid(travelId)
    travel = TravelRepository.find_travel_by_id(travelId)

    if travel is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Viagem não encontrada")
    
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

def update_assigned_travel_ignore_none_by_id(id: UUID, user: User, **fields) -> TravelResponseSchema:
    """ Atualiza uma viagem pelo seu id com os campos (fields) fornecidos """

    travel = TravelRepository.find_travel_by_id(unmask_uuid(id))
    if travel is None:
        raise NotFoundError("viagem")
    
    if travel.id_paciente_id != user.id and travel.id_motorista_id != user.id:
        raise NotUserResource(customMessage="O usuário não pode modificar este transporte.")

    filteredArgs = {k: v for k,v in fields.items() if v is not None}

    updatedTravel = TravelRepository.update_travel(unmask_uuid(id), **filteredArgs)
    return updatedTravel

def update_travel_ignore_none_by_id(id: UUID, **fields) -> TravelResponseSchema:
    """ Atualiza uma viagem pelo seu id com os campos (fields) fornecidos """

    filteredArgs = {k: v for k,v in fields.items() if v is not None}

    travel = TravelRepository.update_travel(unmask_uuid(id), **filteredArgs)
    return travel
