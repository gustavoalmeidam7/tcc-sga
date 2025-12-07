from src.Validator.GenericValidator import unmask_uuid
from src.Error.Base.ErrorListClass import ErrorListClass

from src.Model.Travel import Travel
from src.Model.User import User

from fastapi import status

from src.Schema.Travel.TravelRealizedEnum import TravelRealized

from src.Error.User.NotUserResourceError import NotUserResource
from src.Error.Base.ErrorClass import ErrorClass

class TravelValidator:
    def __init__(self,  travel: Travel, driver: User) -> None:
        self.errors = []
        self.driver = driver
        self.travel = travel

    @property
    def is_valid(self) -> bool:
        return bool(len(self.errors) > 0)

    def validate_start_travel(self) -> None:
        self.is_travel_not_canceled()
        self.is_driver_assigned_to_travel()
        self.is_ambulance_assigned_to_travel()
        self.is_travel_not_realized()

    def validate_end_travel(self) -> None:
        self.is_travel_not_canceled()
        self.is_driver_assigned_to_travel()
        self.is_ambulance_assigned_to_travel()

    def __append_error__(self, error: dict[str, Exception]) -> None:
        self.errors.append(error)

    def is_travel_not_canceled(self) -> None:
        if self.travel.cancelada:
            raise ErrorClass("travel_canceled", "Não é possível iniciar a viagem pois a mesma foi cancelada.", status.HTTP_400_BAD_REQUEST)

    def is_driver_assigned_to_travel(self) -> None:
        if self.driver.compare_uuid(str(self.travel.id)):
            raise NotUserResource("O motorista não esta assinado a este transporte.")

    def is_ambulance_assigned_to_travel(self) -> None:
        if self.travel.id_ambulancia is None:
            raise ErrorClass("no_ambulance_assigned", "Sem ambulancias assinadas a viagem.", status.HTTP_400_BAD_REQUEST)
        
    def is_travel_not_realized(self) -> None:
        if self.travel.realizado == TravelRealized.EM_PROGRESSO:
            raise ErrorClass("travel_already_in_progress", "O transporte já foi iniciado.", status.HTTP_409_CONFLICT)
        
    def is_travel_in_progress(self) -> None:
        if self.travel.realizado != TravelRealized.EM_PROGRESSO:
            raise ErrorClass("travel_not_in_progress", "O transporte não foi iniciado", status.HTTP_400_BAD_REQUEST)
        

    def __is_travel_not_canceled__(self) -> None:
        if self.travel.cancelada:
            self.__append_error__({"travel_canceled": ErrorClass("travel_canceled", "Não é possível iniciar a viagem pois a mesma foi cancelada.", status.HTTP_400_BAD_REQUEST)})

    def __is_driver_assigned_to_travel__(self) -> None:
        if self.driver.compare_uuid(self.travel.str_id):
            self.__append_error__({"travel_canceled": NotUserResource("O motorista não esta assinado a este transporte.")})

    def __is_ambulance_assigned_to_travel__(self) -> None:
        if self.travel.id_ambulancia is None:
            self.__append_error__({"no_ambulance_assigned": ErrorClass("no_ambulance_assigned", "Sem ambulâncias assinadas a viagem.", status.HTTP_400_BAD_REQUEST)})
        
    def __is_travel_not_realized__(self) -> None:
        if self.travel.finished:
            self.__append_error__({"travel_already_in_progress": ErrorClass("travel_already_in_progress", "O transporte já foi iniciado.", status.HTTP_409_CONFLICT)})
        
    def __is_travel_in_progress__(self) -> None:
        if self.travel.in_progress:
            self.__append_error__({"travel_not_in_progress": ErrorClass("travel_not_in_progress", "O transporte não foi iniciado", status.HTTP_400_BAD_REQUEST)})
