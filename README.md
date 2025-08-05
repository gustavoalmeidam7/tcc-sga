# Projeto do TCC

## Tecnologias utilizadas
- Python 3.12
- FastAPI
- Peewee
- Dotenv

## Pré-requisitos
- Interpretador [Python](https://www.python.org/downloads/) versão 3.12 ou superior
- Gerenciador de pacotes pip
- Um [ambiente virtual](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) pip

## Como executar:
```bash
git clone https://github.com/gustavoalmeidam7/backend-tcc
cd backend-tcc

pip install -r requirements.txt
```

Copie o arquivo ``` example.env ``` e renomeie o mesmo para ``` .env ``` na raiz do projeto e troque as chaves necessárias, exemplo:
```js
environment = DEV
secret_key_jwt = changeme  (Troque para uma secret key segura)
algorithm_jwt= HS256 (Compatível com o algotirimo HS256)
```

A chave PROD também pode ser usada, porém é necessario um banco de dados postgres

Para executar use:
```bash
uvicorn src.main:app
```

## Acessar documentação:
Url padrão para OpenAPI:
```
http://localhost:8000/api/docs
```

Url padrão para Redoc:
```
http://localhost:8000/api/redoc
```
