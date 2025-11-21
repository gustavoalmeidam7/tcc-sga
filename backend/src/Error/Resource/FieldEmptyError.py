from src.Error.Base.ErrorClass import ErrorClass, status

class FieldEmpty(ErrorClass):
    def __init__(self, resource: str) -> None:
        super().__init__(
            "field_empty",
            f"O campo {resource} não pode ser vazio",
            status.HTTP_400_BAD_REQUEST,
            None,
            {"resource": resource}
        )
