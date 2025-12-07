from pydantic import ValidationError

from src.Validator.GenericValidator import unmask_uuid
from typing import Optional

from src.Schema.User.UserRoleEnum import UserRole
from src.Schema.Driver.DriverCreateSchema import DriverCreateSchema

from src.Model.UpgradeToken import UpgradeToken

from src.Repository import AmbulanceRepository

from src.Error.User.UserInvalidCredentials import invalidCredentials
from src.Error.User.UserRBACError import UserRBACError
from src.Error.Base.NotFoundError import NotFoundError

def validate_upgrade_token(upgradeToken: UpgradeToken | None, driverFields: Optional[DriverCreateSchema]):
    """ Atualiza um usuário para o fator do respectivo UpgradeToken id """

    if upgradeToken is None:
        raise invalidCredentials("Token não existe")
    
    if upgradeToken.usado:
        raise invalidCredentials("Token já utilizado")
    
    if UserRole(upgradeToken.fator_cargo) == UserRole.DRIVER:
        if not driverFields:
            raise UserRBACError()
        
        if not AmbulanceRepository.find_ambulance_by_id(unmask_uuid(driverFields.id_ambulancia)):
            raise NotFoundError("id_ambulancia")
