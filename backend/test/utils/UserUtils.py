from fastapi.testclient import TestClient
from helpers import TestUserHelper

def get_user(client: TestClient) -> dict:
    userData = TestUserHelper.generate_user()
    TestUserHelper.register_user(client, userData)
    return TestUserHelper.authenticate_user(client, userData["email"], userData["senha"])
