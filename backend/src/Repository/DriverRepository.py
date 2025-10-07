from src.Model.Driver import Driver
from src.Model.Travel import Travel

from uuid import UUID

def assign_travel(driver: Driver, travelId: UUID | str) -> Travel:
    """ Atribui a viagem a o usuário driver """
    travelId = str(travelId)
    driverId = str(driver.id)

    query = Travel.update(Travel.id_motorista == driverId).where(Travel.id == travelId)
    query.execute()

    return Travel.select().where(Travel.id == travelId).first()
