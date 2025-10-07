from src.Model.Travel import Travel
from src.Model.User import User

from uuid import UUID

def insert_travel(travel: Travel) -> Travel:
    """ Insere uma nova viagem """
    travel.save(force_insert=True)
    return travel

def find_assigned_travels(user: User) -> list[Travel]:
    """ Encontra todas viagens atribuidas a o usuário user """
    return Travel.select().where(Travel.id_motorista == user | Travel.id_paciente == user)

def find_all_travels(itemsPerPage: int = 15, page: int = 0) -> list[Travel]:
    """ Encontra todas viagens e ordena de mais recente para mais antiga """
    return (Travel.select()
                  .order_by(Travel.criado_em.desc())
                  .paginate(page, itemsPerPage))

def find_travel_by_id(travelId: str) -> Travel | None:
    """ Encontra uma viagem pelo seu ID, se não encontrar retorna None """
    return Travel.select().where(Travel.id == travelId).first()

def delete_travel_by_id(travelId: str) -> None:
    """ Deleta uma travel pelo seu ID """
    Travel.delete_by_id(travelId)
