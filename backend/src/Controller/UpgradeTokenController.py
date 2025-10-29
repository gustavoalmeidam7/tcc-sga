from fastapi import APIRouter

from src.Decorators import UserDecorators

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema

from src.Service import ManagerService

from uuid import UUID

UPGRADE_TOKEN_ROUTER = APIRouter(
    prefix="/upgradetoken",
    tags=["UpgradeToken"]
)

@UPGRADE_TOKEN_ROUTER.get("/{token}")
async def get_upgrade_token_info(user: UserDecorators.GET_AUTENTHICATED_USER, token: UUID) -> UpgradeTokenFullResponseSchema:
    """ Recupera as informações de um upgrade token pelo seu id """
    return ManagerService.get_token_info(token)

@UPGRADE_TOKEN_ROUTER.post("/{token}")
async def upgrade_account(user: UserDecorators.GET_AUTENTHICATED_USER, token: UUID) -> UserResponseFullSchema:
    """ Atualiza uma conta para gerente a partir de um id de UpgradeToken """
    return ManagerService.upgrade_account_to_manager(user, token)
