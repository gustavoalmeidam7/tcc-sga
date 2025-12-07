from pydantic import ValidationError

import re

def validate_ambulance_license_plate(licensePlate: str) -> str:
    licensePlateResult = re.match(r"(?i)\b[a-z]{3}-?(?:[0-9]{4}|[0-9][a-z][0-9]{2})\b", licensePlate)

    if not licensePlateResult:
        raise ValidationError("Erro a o validar placa.")

    licensePlateResult = licensePlateResult.string.replace("-", "").lower()

    return str(licensePlateResult)
