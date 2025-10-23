from fastapi.testclient import TestClient
from helpers import TestUserHelper

def test_create_user_e2e(client: TestClient):
    user_data = TestUserHelper.generate_user()

    TestUserHelper.register_user(client, user_data)

def test_get_users_e2e(client: TestClient):
    user_data = TestUserHelper.generate_user()

    createResponse = TestUserHelper.register_user(client, user_data)
    created_user_email = createResponse["email"]

    userToken = TestUserHelper.autenticate_user(client, user_data["email"], user_data["senha"])

    get_response = client.get("/user/getusers", headers=userToken)
    
    assert get_response.status_code == 200
    
    response_json = get_response.json()
    assert isinstance(response_json, list)
    assert len(response_json) > 0
    
    emails_in_response = [user["email"] for user in response_json]
    assert created_user_email in emails_in_response

def test_get_user_authenticated(client: TestClient):
    userData = TestUserHelper.generate_user()

    TestUserHelper.register_user(client, userData)

    userToken = TestUserHelper.autenticate_user(client, userData["email"], userData["senha"])

    getUserData = client.get("/user/", headers=userToken)

    assert getUserData.status_code == 200
    
    compareData = getUserData.json()
    compareData.pop("cargo")
    compareData.pop("id")
    
    userData.pop("senha")

    assert compareData == userData

    assert "senha" is not getUserData

def test_get_user_by_id(client: TestClient):
    user1Data = TestUserHelper.generate_user()
    user2Data = TestUserHelper.generate_user()

    TestUserHelper.register_user(client, user1Data)
    TestUserHelper.register_user(client, user2Data)

    user1Token = TestUserHelper.autenticate_user(client, user1Data["email"], user1Data["senha"])
    user2Token = TestUserHelper.autenticate_user(client, user2Data["email"], user2Data["senha"])

    getUser1Id = client.get("/user/", headers=user1Token).json().get("id")

    getUser1ByIdResponse = client.get(f"/user/{getUser1Id}", headers=user2Token)

    assert getUser1ByIdResponse.status_code == 200

    getAllUsers = client.get("/user/getusers", headers=user2Token)

    response_json = getAllUsers.json()
    assert isinstance(response_json, list)
    assert len(response_json) > 0
    
    ids_in_response = [user["id"] for user in response_json]
    assert getUser1ByIdResponse not in ids_in_response

def test_delete_user(client: TestClient):
    user1Data = TestUserHelper.generate_user()
    user2Data = TestUserHelper.generate_user()

    TestUserHelper.register_user(client, user1Data)
    TestUserHelper.register_user(client, user2Data)

    user1Token = TestUserHelper.autenticate_user(client, user1Data["email"], user1Data["senha"])
    user2Token = TestUserHelper.autenticate_user(client, user2Data["email"], user2Data["senha"])

    deleteUserResponse = client.delete("/user/", headers=user1Token)

    assert deleteUserResponse.status_code == 204

    getAllUsers = client.get("/user/getusers", headers=user2Token)

    response_json = getAllUsers.json()
    assert isinstance(response_json, list)
    assert len(response_json) > 0
    
    emails_in_response = [user["email"] for user in response_json]
    assert user1Data["email"] not in emails_in_response

def test_update_user(client: TestClient):
    userData = TestUserHelper.generate_user()
    TestUserHelper.register_user(client, userData)
    userToken = TestUserHelper.autenticate_user(client, userData["email"], userData["senha"])

    # TODO: Test update only few fields inted of bulk update

    updateData = TestUserHelper.generate_user()
    updateData.pop("cpf")
    updateData.pop("nascimento")
    updateData.pop("senha")

    response = client.patch("/user/", headers=userToken, json=updateData)
    
    responseJson = response.json()
    responseJson.pop("id")

    assert response.status_code == 200
    assert  responseJson == updateData
