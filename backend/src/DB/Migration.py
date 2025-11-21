from src.Model import User, Driver, Travel, UserSession, Ambulance, Equipment, Manager, UpgradeToken
from src.DB import db, is_pytest, Proxy

MODELS = [User.User, Driver.Driver, Travel.Travel, UserSession.Session, Ambulance.Ambulance, Equipment.Equipment, Manager.Manager, UpgradeToken.UpgradeToken]

def initialize_db() -> Proxy:
    db.connect()

    if not is_pytest:
        db.create_tables(MODELS)
    
    return db

def close_db() -> None:
    db.close()

def drop_test_db() -> None:
    if is_pytest:
        db.drop_tables(MODELS)