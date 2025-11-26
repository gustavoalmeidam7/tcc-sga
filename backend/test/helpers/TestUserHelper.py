from fastapi.testclient import TestClient
from faker import Faker

from typing import Annotated
from pydantic import Field

from datetime import datetime

faker = Faker("pt_br")

def authenticate_user(client: TestClient, email: str, password: str) -> dict[str, str]:
    authenticate_data = {
        "username": email,
        "password": password
    }

    authenticate_request = client.post("/token/", data=authenticate_data)
    
    assert authenticate_request.status_code == 201
    assert authenticate_request.json()["access_token"] != None
    
    return {"Authorization": f"Bearer {authenticate_request.json()["access_token"]}"}

def generate_user(email: str | None = None, password: str | None = None) -> dict:
    email = email       or faker.free_email()
    password = password or faker.password()

    return {
        "email": email,
        "cpf": "".join(filter(lambda c: c != '-' and c != '.', list(faker.cpf()))),
        "telefone": faker.numerify("%%#########"),
        "nome": faker.name(),
        "nascimento": datetime.combine(faker.date_of_birth(minimum_age=1, maximum_age=100), datetime.min.time()).isoformat(),
        "senha": password
    }

def register_user(client: TestClient, userData: dict) -> dict:
    print(f"User data:\n{userData}")
    response = client.post("/user/", json=userData)
    
    assert response.status_code == 200
    
    responseJson = response.json()
    assert responseJson["email"] == userData["email"]
    assert responseJson["nome"] == userData["nome"]
    assert "id" in responseJson
    
    assert "senha" not in responseJson

    return responseJson
