from fastapi.testclient import TestClient
from faker import Faker

from datetime import datetime, timezone, timedelta

faker = Faker("pt_br")

def generate_travel() -> dict:
    startTravelDate = faker.date_time()

    return {
        "inicio": str(startTravelDate),
        "fim": str(startTravelDate + timedelta(hours=2)),
        "local_inicio": faker.local_latlng()[2],
        "local_fim": faker.local_latlng()[2]
    }

def convert_str_to_iso(dateStr: str) -> str:
    return datetime.strptime(dateStr, "%Y-%m-%d %H:%M:%S").isoformat()
