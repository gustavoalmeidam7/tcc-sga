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
    assert getUserData.json()["email"]      == userData["email"]
    assert getUserData.json()["nome"]       == userData["nome"]
    assert getUserData.json()["nascimento"] == userData["nascimento"]
    assert "senha" is not getUserData

# TODO: Implement later

# def test_delete_user(client: TestClient):
#     user1Data = TestUserHelper.generate_user()
#     user2Data = TestUserHelper.generate_user()

#     TestUserHelper.register_user(client, user1Data)
#     TestUserHelper.register_user(client, user2Data)

#     user1Token = TestUserHelper.autenticate_user(client, user1Data["email"], user1Data["senha"])
#     user2Token = TestUserHelper.autenticate_user(client, user1Data["email"], user1Data["senha"])

#     deleteUserResponse = client.delete("/", headers=user1Token)

#     assert deleteUserResponse == 204

#     getAllUsers = client.get("/getusers")
