from src.Model.Ambulance import Ambulance

def update_ambulance_ignore_none(travelId: str, **args) -> Ambulance | None:
    """ Atualiza uma ambulancia ignorando valores nulos """

    filteredArgs = [x for x in args if x is not None]

    query = Ambulance.update(filteredArgs).where(Ambulance.id == travelId)
    query.execute()

    return Ambulance.select().where(Ambulance.id == travelId).first()

def update_ambulance(travelId: str, **args) -> Ambulance | None:
    """ Atualiza uma ambulancia """

    query = Ambulance.update(args).where(Ambulance.id == travelId)
    query.execute()

    return Ambulance.select().where(Ambulance.id == travelId).first()

def find_ambulance_by_id(id: str) -> Ambulance | None:
    """ Encontra uma ambulancia pelo seu ID """

    return Ambulance.select().where(Ambulance.id == id).first()