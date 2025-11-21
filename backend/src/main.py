from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware

from src.Utils.env import get_env_var

from src import Controller
from src.DB import Migration
from src.Error import register_error_handlers

from src.Logging import Logging, Level
from src.Service.ManagerService import generate_manager_token_list
from src.Validator.GenericValidator import mask_uuid

Debug = get_env_var("environment", "DEV") == "DEV"

app = Controller.initialize_controller()
register_error_handlers(app)

def main():
    tokens = generate_manager_token_list(int(get_env_var("TOKENS", "5") or "5"))

    Logging.log(f"Tokens para gerente: {[mask_uuid(t.id) for t in tokens if not t.usado and t.fator_cargo == 2]}", Level.SENSITIVE)
    

app.add_event_handler("startup", Migration.initialize_db)
app.add_event_handler("startup", Controller.initialize_controller)
app.add_event_handler("startup", main)

app.add_event_handler("shutdown", Migration.close_db)
app.add_event_handler("shutdown", Migration.drop_test_db)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https://.*\.tcc-sga\.pages\.dev|http://localhost:5173)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not Debug:
    app.add_middleware(HTTPSRedirectMiddleware)
