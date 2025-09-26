from fastapi.testclient import TestClient
from faker import Faker

faker = Faker("pt_br")

def autenticate_user(client: TestClient, email: str, password: str) -> str:
    autenticate_data = {
        "username": email,
        "password": password
    }

    autenticate_request = client.post("/token/", data=autenticate_data)
    
    assert autenticate_request.status_code == 201
    assert autenticate_request.json()["access_token"] != None
    
    return {"Authorization": f"Bearer {autenticate_request.json()["access_token"]}"}

def generate_user() -> dict:
    return {
        "email": faker.free_email(),
        "cpf": "".join(list(filter(lambda c: c != '-' and c != '.', list(faker.cpf())))),
        "telefone": "".join(list(filter(lambda c: c.isnumeric(), list(faker.phone_number())))),
        "nome": faker.name(),
        "nascimento": str(faker.date_of_birth(minimum_age=1, maximum_age=100)),
        "senha": faker.password()
    }

def register_user(client: TestClient, userData: dict) -> dict:
    print(userData)
    response = client.post("/user/", json=userData)
    
    assert response.status_code == 200
    
    responseJson = response.json()
    assert responseJson["email"] == userData["email"]
    assert responseJson["nome"] == userData["nome"]
    assert "id" in responseJson
    
    assert "senha" not in responseJson

    return responseJson
