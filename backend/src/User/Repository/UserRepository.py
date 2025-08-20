from src.Model.User import User
from src.Utils.singleton import singleton

class UserRepository(metaclass=singleton):
    def create(self, userModel: User) -> User:
        """ Cria um usuário """
        userModel.save(force_insert=True)
        return userModel


    def find_by_id(self, id: int) -> User:
        """ Retorna um usuário salvo no banco pelo ID """
        return User.get(User.id == id)
    
    def find_by_email(self, email: str) -> User:
        return User.get(User.email == email)

    def find_by_cpf(self, cpf: str) -> User:
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
        User.delete_by_id(id)

    def delete_all(self) -> None:
        User.delete().where(User.select())


    def exists_by_id(self, id: int) -> bool:
        return User.select().where(User.id == id).exists()

    def exists_by_email(self, email: str) -> bool:
        return User.select().where(User.email == email).exists()

    def exists_by_phone_number(self, phone_number: str) -> bool:
        return User.select().where(User.phone_number == phone_number).exists()

    def exists_by_cpf(self, cpf: str) -> bool:
        return User.select().where(User.cpf == cpf).exists()


    def count(self) -> int:
        return User.select().count()
