from src.Repository import TravelRepository

from src.Model.Travel import Travel
from src.Model.User import User 

from uuid import UUID
from datetime import datetime, timezone

from src.Validator.GenericValidator import unmask_uuid, mask_uuid

from src.Schema.Travel.TravelResponseSchema import TravelResponseSchema
from src.Schema.Travel.TravelCreateSchema import TravelCreateSchema
from src.Schema.Travel.TravelRealizedEnum import TravelRealizedEnum
from src.Schema.Travel.TravelDeleteResponseSchema import TravelDeleteResponseSchema

def find_all_travels(itemsPerPage: int = 15, page: int = 0) -> list[TravelResponseSchema]:
    """ Encontra todas viagens e ordena de mais recente para mais antiga """

    itemsPerPage = itemsPerPage or 15
    page = page or 0

    travels = TravelRepository.find_all_travels(itemsPerPage, page)

    return list(map(TravelResponseSchema.model_validate, travels))

def create_travel(travel: TravelCreateSchema, user: User) -> TravelResponseSchema:
    """ Cria uma nova viagem """

    travelDict = travel.model_dump()
    
    travelModel = Travel(**travelDict)
    travelModel.id_paciente = str(user.id)
    travelModel.criado_em = datetime.now(timezone.utc)
    travelModel.realizado = TravelRealizedEnum.NAO_REALIZADO.value

    TravelRepository.insert_travel(travelModel)

    return TravelResponseSchema.model_validate(travelModel)

def remove_travel(id: UUID | str) -> TravelDeleteResponseSchema:
    """ Remove uma viagem pelo ID, ATENÇÃO: ele não verifica se a viagem já existia no banco """

    travelDeleteResponse = TravelDeleteResponseSchema(id= mask_uuid(id), deletado=False)

    id = unmask_uuid(id)
    TravelRepository.delete_travel_by_id(id)
    travel = TravelRepository.find_travel_by_id(id)

    travelDeleteResponse.deletado = True if travel == None else False

    return travelDeleteResponse
