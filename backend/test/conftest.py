import pytest
from peewee import SqliteDatabase
from fastapi.testclient import TestClient

from src.DB import db
from src.main import app

from src.Model import User, Driver, Travel, UserSession, Ambulance, Equipment, Manager

MODELS = [User.User, Driver.Driver, Travel.Travel, UserSession.Session, Ambulance.Ambulance, Equipment.Equipment, Manager.Manager]

def pytest_configure(config):
    """
    Configura uma marca personalizada 'pytest' que podemos verificar em outros lugares
    para saber se estamos rodando em um ambiente de teste
    """
    config.addinivalue_line(
        "markers",
        "pytest: marca que indica que estamos rodando em ambiente de teste"
    )

@pytest.fixture(scope="function")
def client():
    """
    Cria um novo TestClient do FastAPI para cada função de teste.
    """
    with TestClient(app) as c:
        test_db = SqliteDatabase('database_test.db')
    
        db.initialize(test_db)
        
        db.create_tables(MODELS)

        yield c

        db.drop_tables(MODELS)

        db.close()
