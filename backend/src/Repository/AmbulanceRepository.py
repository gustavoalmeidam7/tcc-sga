from src.Model.Ambulance import Ambulance

"""
    Criar
"""

def create_ambulance(ambulance: Ambulance) -> Ambulance:
    """ Cria uma nova ambulância """

    ambulance.save(force_insert=True)
    return Ambulance.select().where(Ambulance.id == ambulance.id).first()


"""
    Ler
"""

def find_ambulances_by_page(page: int, pageSize: int) -> list[Ambulance]:
    """ Encontra todas as ambulâncias presentes na página x de tamanho x """

    return Ambulance.select().order_by(Ambulance.id.asc()).paginate(page, pageSize)

def find_ambulances_by_page_(page: int, pageSize: int) -> list[Ambulance]:
    """ Encontra todas as ambulâncias presentes na página x de tamanho x """

    return Ambulance.select().order_by(Ambulance.id.asc()).paginate(page, pageSize)

def find_ambulance_by_id(id: str) -> Ambulance | None:
    """ Encontra uma ambulância pelo seu ID """

    return Ambulance.select().where(Ambulance.id == id).first()

"""
    Atualizar
"""

def update_ambulance_ignore_none(travelId: str, **args) -> Ambulance | None:
    """ Atualiza uma ambulância ignorando valores nulos """

    filteredArgs = [x for x in args if x is not None]

    query = Ambulance.update(filteredArgs).where(Ambulance.id == travelId)
    query.execute()

    return Ambulance.select().where(Ambulance.id == travelId).first()

def update_ambulance(travelId: str, **args) -> Ambulance | None:
    """ Atualiza uma ambulância """

    query = Ambulance.update(args).where(Ambulance.id == travelId)
    query.execute()

    return Ambulance.select().where(Ambulance.id == travelId).first()

"""
    Deletar
"""
