from dotenv import load_dotenv
import os

if not load_dotenv("./.env"):
    raise RuntimeError("Erro ao carregar o arquivo \".env\". Verifique se ele existe e está no diretório correto ou se contem alguma chave.")

def get_env_var(key: str, default: str | None = None) -> str | None:
    if key is None:
        print(f"Chave {key} não encontrada no .env file")
        return default
    
    return os.environ.get(key, default)
