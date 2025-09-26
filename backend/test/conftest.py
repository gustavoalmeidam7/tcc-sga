import pytest
from peewee import SqliteDatabase
from fastapi.testclient import TestClient

from src.DB import db
from src.main import app

from src.Model import User, Driver, Travel, UserSession, Ambulance, Equipment, Manager

MODELS = [User.User, Driver.Driver, Travel.Travel, UserSession.Session, Ambulance.Ambulance, Equipment.Equipment, Manager.Manager]

@pytest.fixture(scope='function', autouse=True)
def test_database():
    """
    Este fixture configura um banco de dados SQLite em memória para toda a sessão de teste.
    Ele reinicializa o proxy do banco de dados para apontar para o banco de dados de teste,
    cria todas as tabelas, cede o controle para a execução do teste e, em seguida, destrói o banco de dados.
    """
    test_db = SqliteDatabase(':memory:')
    
    db.initialize(test_db)
    
    db.connect()
    db.create_tables(MODELS)
    
    yield
    
    db.drop_tables(MODELS)
    db.close()

@pytest.fixture(scope="function")
def client():
    """
    Cria um novo TestClient do FastAPI para cada função de teste.
    """
    with TestClient(app) as c:
        yield c
