from fordev.generators import people
import requests

URL = "http://localhost:5000/api/user/create"

def format_date(date: str) -> str:
    date = date.split("/")
    return f"{date[0]}-{date[1]}-{date[2]}"

def create_users(number: int = 1) -> 'list[dict]':
    listUsers = []
    list_person = people(n=number)
    for person in list_person:
        listUsers.append({
            "username": person["nome"],
            "cpf": person["cpf"],
            "birthday": format_date(person["data_nasc"]),
            "email": person["email"],
            "phone_number": person["celular"],
            "password": person["senha"]
        })

    return listUsers

def insert_users(users: 'dict' = None) -> str :
    users_created = []
    for user in users:
        content = requests.post(
                URL,
                json=user
            )

        users_created.append(
            content.text
        )
        
    return users_created

nUsers = input("How much users will be generated: ")

print(insert_users(create_users(int(nUsers))))
