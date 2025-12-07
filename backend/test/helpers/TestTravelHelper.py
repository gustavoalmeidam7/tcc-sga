from faker import Faker

from datetime import datetime, timedelta

faker = Faker("pt_br")

def generate_travel() -> dict:
    startTravelDate = faker.date_time()

    localStart = faker.local_latlng()
    localEnd = faker.local_latlng()

    assert localStart and localEnd

    travel = {
        "inicio": str(startTravelDate),
        "fim": str(startTravelDate + timedelta(hours=2)),
        "cpf_paciente": faker.cpf().replace(".", "").replace("-", ""),
        "lat_inicio": localStart[0],
        "long_inicio": localStart[1],
        "end_inicio": localStart[2],
        "lat_fim": localEnd[0],
        "long_fim": localEnd[1],
        "end_fim": localEnd[2],
        "observacoes": faker.text(100),
        "estado_paciente": faker.random_int(0, 2)
    }

    print(f"Travel data:\n{str(travel)}")

    return travel

def convert_str_to_iso(dateStr: str) -> str:
    return datetime.strptime(dateStr, "%Y-%m-%d %H:%M:%S").isoformat()
