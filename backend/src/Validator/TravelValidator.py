from src.Validator.GenericValidator import unmask_uuid
from src.Error.Base.ErrorListClass import ErrorListClass

from src.Model.Travel import Travel
from src.Model.User import User
import uuid

from fastapi import status

from src.Schema.Travel.TravelRealizedEnum import TravelRealized

from src.Error.User.NotUserResourceError import NotUserResource
from src.Error.Base.ErrorClass import ErrorClass

class TravelValidator:
    def __init__(self,  travel: Travel, driver: User) -> None:
        self.driver = driver
        self.travel = travel

    def validate_start_travel(self) -> None:
        self.is_travel_not_canceled()
        self.is_driver_assigned_to_travel()
        self.is_ambulance_assigned_to_travel()
        self.is_travel_not_realized()

    def validate_end_travel(self) -> None:
        self.is_travel_not_canceled()
        self.is_driver_assigned_to_travel()
        self.is_ambulance_assigned_to_travel()

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
