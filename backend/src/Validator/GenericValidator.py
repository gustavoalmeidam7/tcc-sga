from uuid import UUID, uuid4

def validate_uuid(uuid: str | UUID) -> UUID:
    """ Recebe um possível uuid e retorna ele corretamente validado """
    if type(uuid) == UUID:
        return uuid
    
    uuidResponse = mask_uuid(str(uuid))

    if uuidResponse is None:
        raise ValueError("UUID inválido")
    
    return uuidResponse

def mask_uuid(uuid: str | None) -> UUID | None:
    """ Recebe um uuid no formato str e mascara para o formato UUID """
    if uuid is None:
        return None
    
    return UUID(str(uuid))

def unmask_uuid(uuid: UUID | str) -> str:
    """ Desmascara um uuid tranformando em string """
    
    uuid_str = str(uuid).replace("-", "")
    return uuid_str

def generate_uuid() -> str:
    """ Gera um UUID válido em formato de string """
    return unmask_uuid(uuid4())
