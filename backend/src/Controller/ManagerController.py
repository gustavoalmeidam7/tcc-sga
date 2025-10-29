from fastapi import APIRouter, status, Depends

from src.Decorators import UserDecorators, ManagerDecorator

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema

from src.Service import ManagerService

from uuid import UUID

MANAGER_ROUTER = APIRouter(
    prefix="/manager",
    tags=["manager"]
)

@MANAGER_ROUTER.post("/")
async def create_driver_upgrade_token(manager: ManagerDecorator.GET_AUTENTHICATED_MANAGER) -> UpgradeTokenFullResponseSchema:
    """ Cria um token para atualizar um usuário para motorista """
    return ManagerService.generate_driver_token()
