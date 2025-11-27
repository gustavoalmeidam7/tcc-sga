from dotenv import load_dotenv
import os

from src.Logging import Logging, Level

if not load_dotenv("./.env"):
    Logging.log("Erro ao carregar o arquivo \".env\". Verifique se ele existe e está no diretório correto ou se contem alguma chave.", Level.WARN)

def get_env_var(key: str | None = None, default: str | None = None) -> str | None:
    value = os.environ.get(key, default)
    if value == default:
        Logging.log(f"Chave {key} não encontrada no .env file", Level.WARN)
    
    return value

def get_env_var_not_none(key: str, default: str) -> str:
    value = os.environ.get(key, default)
    if value == default:
        Logging.log(f"Chave {key} não encontrada no .env file", Level.WARN)

    return value
