from fastapi.testclient import TestClient
from utils import UserUtils
from helpers import TestTravelHelper

def test_post_travel(client: TestClient):
    userToken = UserUtils.get_user(client)
    travelData = TestTravelHelper.generate_travel()
    request = client.post("/travel/", headers=userToken, json=travelData)
    
    assert request.status_code == 200

    requestDictCmp = list(filter(lambda k: request.json().key == k, travelData.keys))

    assert travelData == requestDictCmp
