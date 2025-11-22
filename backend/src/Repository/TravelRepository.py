from src.Model.Travel import Travel
from src.Model.User import User


"""
    Criar
"""

def insert_travel(travel: Travel) -> Travel:
    """ Insere uma nova viagem """
    travel.save(force_insert=True)
    return travel


"""
    Ler
"""

def find_assigned_travels(user: User, page: int, pageSize: int) -> list[Travel]:
    """ Encontra todas viagens atribuidas a o usuário user """
    travels = (Travel.select()
                      .where((Travel.id_paciente == user.id) | (Travel.id_motorista == user.id))
                      .paginate(page, pageSize))
    
    return list(travels)

def find_all_travels(itemsPerPage: int = 15, page: int = 0) -> list[Travel]:
    """ Encontra todas viagens e ordena de mais recente para mais antiga """
    return (Travel.select()
                  .order_by(Travel.criado_em.desc())
                  .paginate(page, itemsPerPage))


def find_travel_by_id(travelId: str) -> Travel | None:
    """ Encontra uma viagem pelo seu ID, se não encontrar retorna None """
    return Travel.select().where(Travel.id == travelId).first()

"""
    Atualizar
"""

def update_travel(travelId: str, **args) -> Travel | None:
    """ Atualiza uma viagem """

    query = Travel.update(args).where(Travel.id == travelId)
    query.execute()

    return Travel.select().where(Travel.id == travelId).first()


"""
    Deletar
"""

def delete_travel_by_id(travelId: str) -> None:
    """ Deleta uma travel pelo seu ID """
    Travel.delete_by_id(travelId)
