from fastapi import APIRouter, status

from src.Decorators import UserDecorators

from src.Schema.User.UserResponseFullSchema import UserResponseFullSchema
from src.Schema.Manager.UpgradeTokenFullResponseSchema import UpgradeTokenFullResponseSchema
from src.Schema.Driver.DriverCreateSchema import DriverCreateSchema

from src.Service import ManagerService

from uuid import UUID

UPGRADE_TOKEN_ROUTER = APIRouter(
    prefix="/upgradetoken",
    tags=["UpgradeToken"]
)

@UPGRADE_TOKEN_ROUTER.get("/{token}", responses={
status.HTTP_409_CONFLICT: {
    "description": "O usuário já é do cargo que tentou se tornar",
    "content": {
        "application/json": {
            "example": {
                "erro": "resource_not_found",
                "recurso": "token",
                "mensagem": "Token não encontrado"
            }
        }
    }
}})
async def get_upgrade_token_info(user: UserDecorators.GET_AUTHENTICATED_USER, token: UUID) -> UpgradeTokenFullResponseSchema:
    """
    Pega as informações de um token de upgrade:

    **acesso**: `USER` \n
    **parâmetro**: Route Param: \n
        `token` \n
    **retorno**: devolve: \n
        `UpgradeTokenFullResponseSchema`
    """
    return ManagerService.get_token_info(token)

@UPGRADE_TOKEN_ROUTER.post("/{token}", responses={
    status.HTTP_409_CONFLICT: {
        "description": "O usuário já é do cargo que tentou se tornar",
        "content": {
            "text": {
                "example": "Usuário já é gerente"
            }
        }
    },
    status.HTTP_401_UNAUTHORIZED: {
        "description": "O usuário já é do cargo que tentou se tornar",
        "content": {
            "text": {
                "example": "Impossível realizar ação com este token"
            }
        }
    },
})
async def upgrade_account(user: UserDecorators.GET_AUTHENTICATED_USER, token: UUID, driverFields: DriverCreateSchema | None = None) -> UserResponseFullSchema:
    """
    Faz upgrade de uma conta com um token de atualização:

    **acesso**: `USER` \n
    **parâmetro**: Route Param: \n
        `token` \n
    Body: \n
        `Optional[DriverCreateSchema]`
    **retorno**: devolve: \n
        `UserResponseFullSchema`
    """
    return ManagerService.upgrade_user_with_token_id(user, token, driverFields)
