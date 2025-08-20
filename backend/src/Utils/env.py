from dotenv import load_dotenv
import os

if not load_dotenv("./.env"):
    raise RuntimeError("Erro ao carregar o arquivo \".env\". Verifique se ele existe e está no diretório correto ou se contem alguma chave.")

def get_env_var(var_name: str) -> str:
    key = os.environ.get(var_name, None)

    if key is None:
        raise RuntimeError(f"Chave {var_name} não encontrada no .env file")
    
    return key
