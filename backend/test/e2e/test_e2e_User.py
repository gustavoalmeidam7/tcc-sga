from fastapi.testclient import TestClient

def test_create_user_e2e(client: TestClient):
    user_data = {
        "email": "test.e2e@example.com",
        "cpf": "12345678901",
        "phone_number": "11999998888",
        "username": "test_e2e_user",
        "birthday": "2000-01-01",
        "password": "a_strong_password"
    }
    response = client.post("/user/create", json=user_data)
    
    assert response.status_code == 200
    
    response_json = response.json()
    assert response_json["email"] == user_data["email"]
    assert response_json["username"] == user_data["username"]
    assert "id" in response_json
    
    assert "password" not in response_json

def test_get_users_e2e(client: TestClient):
    user_data = {
        "email": "test.getusers@example.com",
        "cpf": "10987654321",
        "phone_number": "11777776666",
        "username": "get_users_tester",
        "birthday": "1999-12-31",
        "password": "another_password"
    }
    create_response = client.post("/user/create", json=user_data)
    assert create_response.status_code == 200
    created_user_email = create_response.json()["email"]

    get_response = client.get("/user/getusers")
    
    assert get_response.status_code == 200
    
    response_json = get_response.json()
    assert isinstance(response_json, list)
    assert len(response_json) > 0
    
    emails_in_response = [user["email"] for user in response_json]
    assert created_user_email in emails_in_response
