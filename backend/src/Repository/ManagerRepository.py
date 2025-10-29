from src.Model.Manager import Manager
from src.Model.User import User
from src.Model.UpgradeToken import UpgradeToken

""" 
    Criar
"""
def bulk_create_token(tokenList: list[UpgradeToken]) -> list[UpgradeToken] |  None:
    """ Cria multiplos tokens para atualizar usuário para gerente """
    if tokenList is None or tokenList == []:
        return None
        
    UpgradeToken.bulk_create(tokenList)
    return UpgradeToken.select().where(UpgradeToken.id.in_(list(map(lambda t: t.id, tokenList))))

def create_token(token: UpgradeToken) -> UpgradeToken | None:
    """ Cria um token para atualizar usuário para gerente """
    token.save(force_insert=True)
    return UpgradeToken.select().where(UpgradeToken.id == token.id).first()

def create_manager(manager: Manager) -> Manager | None:
    """ Cria um gerente """
    manager.save(force_insert=True)
    return Manager.select().where(Manager.id == manager.id).first()

"""
    Ler
"""
def count_token() -> int:
    """ Conta a quantidade de tokens no banco de dados """
    return UpgradeToken.select().count()

def find_token_by_id(tokenId: str) -> UpgradeToken | None:
    """ Seleciona um token pelo seu id """
    return UpgradeToken.select().where(UpgradeToken.id == tokenId).first()

def find_all_tokens() -> list[UpgradeToken]:
    """ Selectiona todos tokens no banco de dados """
    return UpgradeToken.select()


def count_manager() -> int:
    """ Conta a quantidade de gerentes no banco de dados """
    return Manager.select().count()

def find_manager_by_id(managerId: str) -> Manager | None:
    """ Seleciona um gerente pelo seu id """
    return Manager.select().where(Manager.id == managerId).first()

def find_manager_join_by_id(managerId: str):
    """ Seleciona um usuario e faz o join com gerente pelo seu id """
    return User.select(User, Manager).join(Manager).where(User.id == managerId).first()

"""
    Atualizar
"""
def update_manager_by_id_ignore_none(managerId: str, **args) -> Manager | None:
    """ Atualiza um gerente ignorando valores nulos """

    filteredArgs = [x for x in args if x is not None]

    query = Manager.update(filteredArgs).where(Manager.id == managerId)
    query.execute()

    return Manager.select().where(Manager.id == managerId).first()

def update_manager_by_id(managerId: str, **args) -> Manager | None:
    """ Atualiza um gerente pelo seu id """

    query = Manager.update(args).where(Manager.id == managerId)
    query.execute()

    return Manager.select().where(Manager.id == managerId).first()

def update_token_by_id_ignore_none(tokenId: str, **args) -> UpgradeToken | None:
    """ Atualiza um token ignorando valores nulos """

    filteredArgs = [x for x in args if x is not None]

    query = UpgradeToken.update(filteredArgs).where(UpgradeToken.id == tokenId)
    query.execute()

    return UpgradeToken.select().where(UpgradeToken.id == tokenId).first()

def update_token_by_id(tokenId: str, **args) -> UpgradeToken | None:
    """ Atualiza um token pelo seu id """

    query = UpgradeToken.update(args).where(UpgradeToken.id == tokenId)
    query.execute()

    return UpgradeToken.select().where(UpgradeToken.id == tokenId).first()
