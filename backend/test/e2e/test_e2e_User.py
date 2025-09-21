from fastapi.testclient import TestClient

def test_create_user_e2e(client: TestClient):
    user_data = {
        "email": "test.e2e@example.com",
        "cpf": "12345678901",
        "telefone": "11999998888",
        "nome": "test_e2e_user",
        "nascimento": "2000-01-01",
        "senha": "a_strong_password"
    }
    response = client.post("/user/", json=user_data)
    
    assert response.status_code == 200
    
    response_json = response.json()
    assert response_json["email"] == user_data["email"]
    assert response_json["nome"] == user_data["nome"]
    assert "id" in response_json
    
    assert "senha" not in response_json

def test_get_users_e2e(client: TestClient):
    user_data = {
        "email": "test.getusers@example.com",
        "cpf": "10987654321",
        "telefone": "11777776666",
        "nome": "get_users_tester",
        "nascimento": "1999-12-31",
        "senha": "another_password"
    }
    create_response = client.post("/user/", json=user_data)
    assert create_response.status_code == 200
    created_user_email = create_response.json()["email"]

    get_response = client.get("/user/getusers")
    
    assert get_response.status_code == 200
    
    response_json = get_response.json()
    assert isinstance(response_json, list)
    assert len(response_json) > 0
    
    emails_in_response = [user["email"] for user in response_json]
    assert created_user_email in emails_in_response
