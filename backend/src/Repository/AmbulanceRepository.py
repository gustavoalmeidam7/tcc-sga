from src.Model.Ambulance import Ambulance
from src.Model.Equipment import Equipment
from src.Model.Driver import Driver

"""
    Criar
"""

def create_ambulance(ambulance: Ambulance) -> Ambulance:
    """ Cria uma nova ambulância """

    ambulance.save(force_insert=True)
    return Ambulance.select().where(Ambulance.id == ambulance.id).first()

def create_equipment(equipment: Equipment) -> Equipment:
    """ Cria um novo equipamento """

    equipment.save(force_insert=True)
    return Equipment.select().where(Equipment.id == equipment.id).first()


"""
    Ler
"""

def find_ambulances_by_page(page: int, pageSize: int) -> list[Ambulance]:
    """ Encontra todas as ambulâncias presentes na página x de tamanho x """

    return Ambulance.select().order_by(Ambulance.id.asc()).paginate(page, pageSize) # type: ignore

def find_ambulances_by_page_(page: int, pageSize: int) -> list[Ambulance]:
    """ Encontra todas as ambulâncias presentes na página x de tamanho x """

    return Ambulance.select().order_by(Ambulance.id.asc()).paginate(page, pageSize) # type: ignore

def find_ambulance_by_id(id: str) -> Ambulance | None:
    """ Encontra uma ambulância pelo seu ID """

    return Ambulance.select().where(Ambulance.id == id).first()

def find_driver_by_ambulance_id(id: str) -> Driver | None:
    """ Encontra motoristas atrelados a uma ambulância pelo seu id """

    return Driver.select().where(Driver.id_ambulancia == id).first()

def find_ambulance_equipments_by_id(id: str) -> list[Equipment]:
    """ Encontra todos equipamentos de uma ambulância pelo seu id """
    
    return Equipment.select().where(Equipment.id_ambulancia == id)

def ambulance_exits_by_id(id: str) -> bool:
    """ Verifica se uma ambulância existe pelo seu id """
    
    return Ambulance.select().where(Ambulance.id == id).exists()

def equipment_exits_by_id(id: str) -> bool:
    """ Verifica se um equipamento existe pelo seu id """
    
    return Equipment.select().where(Equipment.id == id).exists()

"""
    Atualizar
"""

def update_ambulance_ignore_none(travelId: str, **args) -> Ambulance | None:
    """ Atualiza uma ambulância ignorando valores nulos """

    filteredArgs = {k: v for k, v in args.items() if v is not None}

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
