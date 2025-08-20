from dotenv import load_dotenv
import os

load_dotenv("./.env")

def get_env_var(var_name: str) -> str:
    try:
        return os.environ.get(var_name, None)
    except KeyError:
        raise KeyError(f"Chave {var_name} não encontrada no .env file")
