from fastapi.testclient import TestClient
from datetime import datetime, timezone

def _create_user_and_get_token(client: TestClient, email: str, password: str):
    user_data = {
        "email": email,
        "cpf": "111223344",
        "telefone": "11987654321",
        "nome": "auth_tester",
        "nascimento": "1995-05-10",
        "senha": password
    }
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

def test_get_user_with_token(client: TestClient):
    email = "auth.test.getuser@example.com"
    password = "a_secure_password"
    token = _create_user_and_get_token(client, email, password)
    print(f"test\\e2e\\test_e2e_Auth.py:35 Token: {token}")

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/user/", headers=headers)
    
    assert response.status_code == 200
    user_info = response.json()
    assert user_info["email"] == email

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

def test_revoke_token(client: TestClient):
    email = "auth.test.revoke@example.com"
    password = "a_secure_password"
    
    # Create two sessions
    token1 = _create_user_and_get_token(client, email, password)
    
    login_data = {"username": email, "password": password}
    ## ERRO NESSE ENDPOINT A O CRIAR TOKEN JWT
    response = client.post("/token/", data=login_data)
    assert response.status_code == 201
    token2 = response.json()["access_token"]

    # Get sessions and find the id of the second session
    headers1 = {"Authorization": f"Bearer {token1}"}
    response = client.get("/token/sessions", headers=headers1)
    assert response.status_code == 200
    sessions = response.json()["sessoes"]
    assert len(sessions) == 2
    
    import jwt
    
    decoded_token2 = jwt.decode(token2, options={"verify_signature": False})
    
    session2_id = decoded_token2["sub"]

    # Revoke the second session using the first token
    revoke_data = {"id_sessao": session2_id}
    response = client.post("/token/revoke", json=revoke_data, headers=headers1)
    assert response.status_code == 204

    # Try to use the revoked token
    headers2 = {"Authorization": f"Bearer {token2}"}
    response = client.get("/user/", headers=headers2)
    assert response.status_code == 401 # Unauthorized
