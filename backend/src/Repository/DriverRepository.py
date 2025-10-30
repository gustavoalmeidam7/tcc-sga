from src.Model.Driver import Driver
from src.Model.User import User

def create_driver_by_id(driver: Driver) -> Driver | None:
    """ Cria um motorista pelo id """

    driver.save(force_insert=True)
    return Driver.select().join(User).where(Driver.id == driver.id).first()

def find_driver_by_id(id: str) -> Driver | None:
    """ Encontra motorista pelo seu ID """

    driver = Driver.select().join(User).where(Driver.id == id).first()
    return driver
