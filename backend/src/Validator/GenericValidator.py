from uuid import UUID, uuid4

def mask_uuid(uuid: str) -> UUID:
    """ Recebe um uuid no formato str e mascara para o formato UUID """
    return UUID(str(uuid))

def unmask_uuid(uuid: UUID) -> str:
    """ Valida se uma string é um UUID válido """
    uuid_str = str(uuid).replace("-", "")
    return uuid_str

def generate_uuid() -> str:
    """ Gera um UUID válido em formato de string """
    return unmask_uuid(uuid4())
