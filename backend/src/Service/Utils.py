from datetime import date
from playhouse.shortcuts import model_to_dict

import re

def bulk_convert_to_dict(modelList) -> dict:
    return list(
        map(
            model_to_dict,
            modelList
        ))

def unmask_number(number: str) -> str:
    return re.sub(r"[^0-9]", "", number)

def validate_birthday(birthday: date) -> date:
    if birthday > date.today():
        raise ValueError("Data de nascimento deve ser antes de hoje")

    return birthday

# TODO do a real validation with external tools
def validate_cpf(cpf: str) -> str:
    cpf = unmask_number(cpf)
    return cpf
