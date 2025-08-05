from dotenv import load_dotenv
import os

load_dotenv("./.env")

def get_env_var(var_name: str) -> str:
    return os.environ.get(var_name, None)
