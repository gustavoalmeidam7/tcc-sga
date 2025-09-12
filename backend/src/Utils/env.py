from dotenv import load_dotenv
import os

if not load_dotenv("./.env"):
    print("Erro ao carregar o arquivo \".env\". Verifique se ele existe e está no diretório correto ou se contem alguma chave.")

def get_env_var(key: str | None = None, default: str | None = None) -> str | None:
    value = os.environ.get(key, default)
    if value == default:
        print(f"Chave {key} não encontrada no .env file")
    
    return value
