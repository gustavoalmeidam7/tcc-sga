from src.Error.ErrorClass import ErrorClass

from src.User.Schema.UserCreateSchema import UserCreateSchema
from src.User.Schema.UserResponseSchema import UserResponseSchema
from src.Model.User import User

from src.User.Validator.UserValidator import UserValidator

from src.User.Repository.UserRepository import UserRepository
from src.Utils.singleton import singleton

from src.User.Auth.Service.SessionService import SessionService

class UserService(metaclass=singleton):
    userRepository = UserRepository()
    sessionService = SessionService()

    def create(self, userSchema: UserCreateSchema) -> 'UserResponseSchema':
        ## TODO VALIDAR MELHOR CPF E TELEFONE
        userModel = userSchema.to_model()
        userModel.password = self.sessionService.get_password_hash(userModel.password)

        validatorResult = UserValidator().validate(userModel)
        if(not validatorResult.is_valid):
            raise ErrorClass(statusCode=409 ,errors=validatorResult.errors)

        createdUser = self.userRepository.create(userModel)

        return UserResponseSchema.from_user_model(createdUser)
    
    def delete_by_id(self, id: int) -> None:
        self.userRepository.delete_by_id(id)

    def delete_all(self) -> None:
        self.userRepository.delete_all()

    def find_all_page_dict(self, page: int = 0, pagesize: int = 25) -> 'list[UserResponseSchema]':
        page = page or 1        # Transforma page em 1 se o valor for None ou 0
        pagesize = pagesize or 1

        pagesize = max(1, min(pagesize, 50))
        page = max(1, page)

        return list(map(UserResponseSchema.from_user_model, self.userRepository.find_all_with_page(page, pagesize)))

    # TODO Arrumar dps
    def __get_user__(self, id: int) -> 'User':
        return self.userRepository.find_by_id(id)
