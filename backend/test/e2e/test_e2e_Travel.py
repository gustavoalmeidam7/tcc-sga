from fastapi.testclient import TestClient
from utils import UserUtils
from helpers import TestTravelHelper

def test_post_travel(client: TestClient):
    userToken = UserUtils.get_user(client)
    travelData = TestTravelHelper.generate_travel()
    request = client.post("/travel/", headers=userToken, json=travelData)
    
    assert request.status_code == 200

    travelData["inicio"] = TestTravelHelper.convert_str_to_iso(travelData["inicio"])
    travelData["fim"] = TestTravelHelper.convert_str_to_iso(travelData["fim"])
    travelData["estado_paciente"] = str(travelData["estado_paciente"])

    requestDictCmp = {k: str(request.json()[k]) for k in travelData.keys()}

    assert travelData == requestDictCmp

def test_get_travels(client: TestClient):
    userToken = UserUtils.get_user(client)
    travelData = TestTravelHelper.generate_travel()
    postRequest = client.post("/travel/", headers=userToken, json=travelData)
    assert postRequest.status_code == 200

    getRequest = client.get("/travel/assigned/", headers=userToken)
    assert getRequest.status_code == 200
    assert len(getRequest.json()) > 0

def test_delete_travel_by_id(client: TestClient):
    userToken = UserUtils.get_user(client)
    travelData = TestTravelHelper.generate_travel()
    postRequest = client.post("/travel/", headers=userToken, json=travelData)
    assert postRequest.status_code == 200

    travelId = postRequest.json()["id"]

    travelData = client.get(f"/travel/{travelId}", headers=userToken)
    assert travelData.status_code == 200

    travelCanceledData = dict(travelData.json())
    travelCanceledData["cancelada"] = True

    deleteRequest = client.post(f"/travel/cancel/{travelId}", headers=userToken)

    assert deleteRequest.status_code == 200

    assert dict(deleteRequest.json()) == travelCanceledData
