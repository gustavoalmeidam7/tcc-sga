# Projeto do TCC

## Tecnologias utilizadas

### Backend
- Python 3.13
- FastAPI
- Peewee
- Dotenv

### Frontend
- JavaScript
- React
- TailwindCSS
- Shadcn/UI

# Pré-requisitos

## Backend:
- Interpretador [Python](https://www.python.org/downloads/) versão 3.13 ou superior
- Gerenciador de pacotes pip ou [UV](https://docs.astral.sh/uv/getting-started/installation/)
- Um [ambiente virtual](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) pip

### Como executar:

Clone o repositório:

```bash
git clone https://github.com/gustavoalmeidam7/tcc-sga
```

Entre na pasta do backend:

```bash
cd tcc-sga/backend
```

Crie um ambiente virtual e execute:

```bash
pip install -r requirements.txt
```

Copie o arquivo ``` example.env ``` e renomeie o mesmo para ``` .env ``` na raiz da pasta backend e troque as chaves necessárias, exemplo:
```js
secret_key_jwt = changeme  (Troque para uma secret key segura)
algorithm_jwt= HS256 (Compatível com o algorítimo HS256)

environment = DEV
```

Para usar em produção com um banco de dados postgres você pode adicionar as chaves:
```js
environment = PROD
Database_Name = postgres_database_name
Database_Password = postgres_database_password
Database_IP_Address = postgres_database_IP
Database_Port = postgres_database_Port
Database_User = postgres_database_User
```

Para executar use:
```bash
uvicorn src.main:app
```

### Acessar documentação:
Url padrão para OpenAPI:
```
http://localhost:8000/api/docs
```

Url padrão para Redoc:
```
http://localhost:8000/api/redoc
```

## Frontend:

Clone o repositório:

```bash
git clone https://github.com/gustavoalmeidam7/tcc-sga
```

Entre na pasta do frontend:

```bash
cd tcc-sga/frontend
```

Instale as dependencias:

```bash
npm install
```

Rode o frontend:

```bash
npm run dev
```
