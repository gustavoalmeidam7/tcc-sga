from src.Model.User import User
from src.Utils.singleton import singleton

class UserRepository(metaclass=singleton):
    def create(self, userModel: User) -> User:
        """ Cria um usuário """
        userModel.save(force_insert=True)
        return userModel


    def find_by_id(self, id: int) -> User:
        """ Retorna um usuário pelo seu ID """
        return User.get(User.id == id)
    
    def find_by_email(self, email: str) -> User | None:
        """ Retorna um usuário pelo seu email """
        return User.select().where(User.email == email).first()

    def find_by_cpf(self, cpf: str) -> User:
        """ Retorna um usuário pelo seu CPF """
        return User.get(User.cpf == cpf)
    
    def find_all_with_page(self, pageNumber: int= 0, pageSize: int = 25) -> 'list[User]':
        """ Retorna uma lista de usuários pelo pageNumber que se divide pelo pageSize """
        return (User.select()
                    .order_by(User.id.asc())
                    .paginate(pageNumber, pageSize))


    def update(self, userModel: User) -> None:
        """ Atualiza um usuário pelo ID """
        query = User.update(id=userModel.id, username=userModel.username, email=userModel.email).where(User.id == userModel.id)
        query.execute()


    def delete_by_id(self, id: int) -> None:
        """ Excluí um usuário pelo seu ID """
        User.delete_by_id(id)


    def exists_by_id(self, id: int) -> bool:
        """ Verifica se um usuário existe pelo seu ID """
        return User.select().where(User.id == id).exists()

    def exists_by_email(self, email: str) -> bool:
        """ Verifica se um usuário existe pelo seu e-mail """
        return User.select().where(User.email == email).exists()

    def exists_by_phone_number(self, phone_number: str) -> bool:
        """ Verifica se um usuário existe pelo seu número de telefone """
        return User.select().where(User.phone_number == phone_number).exists()

    def exists_by_cpf(self, cpf: str) -> bool:
        """ Verifica se um usuário existe pelo seu CPF """
        return User.select().where(User.cpf == cpf).exists()


    def count(self) -> int:
        """ Retorna a quantidade de usuários cadastrados """
        return User.select().count()
