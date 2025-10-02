from fastapi.testclient import TestClient
from faker import Faker

from datetime import datetime, timezone, timedelta

faker = Faker("pt_br")

def generate_travel() -> dict:
    startTravelDate = Faker.date_time()

    return {
        "inicio": startTravelDate,
        "fim": startTravelDate + timedelta(hours=2),
        "local_inicio": Faker.local_latlng()[2],
        "local_fim": Faker.local_latlng()[2]
    }
