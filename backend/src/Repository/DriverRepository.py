from src.Model.Driver import Driver
from src.Model.User import User


"""
    Criar
"""

def create_driver_by_id(driver: Driver) -> Driver | None:
    """ Cria um motorista pelo id """

    driver.save(force_insert=True)
    return Driver.select().join(User).where(Driver.id == driver.id).first()

"""
    Ler
"""

def find_driver_by_id(id: str) -> Driver | None:
    """ Encontra motorista pelo seu ID """

    return Driver.select().join(User).where(Driver.id == id).first()

"""
    Atualizar
"""

def update_driver_by_id(id: str, **kwargs) -> Driver | None:
    """ Atualiza um motorista pelos valores passados em kwargs """

    Driver.update(**kwargs).where(Driver.id == id).execute()

    return Driver.select().where(Driver.id == id).first()

"""
    Deletar
"""
