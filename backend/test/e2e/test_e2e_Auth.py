from fastapi.testclient import TestClient
from datetime import datetime, timezone

from helpers import TestUserHelper

def _create_user_and_get_token(client: TestClient, email: str, password: str):
    user_data = TestUserHelper.generate_user(email, password)

    response = client.post("/user/", json=user_data)
    assert response.status_code == 200

    login_data = {
        "username": email,
        "password": password
    }
    response = client.post("/token/", data=login_data)
    assert response.status_code == 201
    
    token_data = response.json()
    return token_data["access_token"]

def test_login_for_access_token(client: TestClient):
    email = "auth.test@example.com"
    password = "a_secure_password"
    _create_user_and_get_token(client, email, password)

def test_get_user_sessions(client: TestClient):
    email = "auth.test.getsessions@example.com"
    password = "a_secure_password"
    token = _create_user_and_get_token(client, email, password)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/token/sessions", headers=headers)
    
    assert response.status_code == 200
    sessions = response.json()
    assert isinstance(sessions["sessoes"], list)
    assert len(sessions["sessoes"]) == 1
    
    valid_until_str = sessions["sessoes"][0]["valido_ate"]
    valid_until_dt = datetime.fromisoformat(valid_until_str)
    assert valid_until_dt > datetime.now(timezone.utc)
