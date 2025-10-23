from src.Model.Driver import Driver
from src.Model.User import User

def find_driver_by_id(id: str) -> Driver | None:
    """ Encontra motorista pelo seu ID """

    driver = Driver.select().join(User).where(Driver.id == id).first()
    return driver
