from src.Model.RestorePassword import RestorePassword

"""
    Criar
"""

def create_restore_password(restorePassword: RestorePassword) -> RestorePassword:
    restorePassword.save(force_insert=True)
    return RestorePassword.select().where(RestorePassword.id == restorePassword.str_id).first()

"""
    Ler
"""

def find_restore_password_by_id(restorePasswordId: str) -> RestorePassword | None:
    return RestorePassword.select().where(RestorePassword.id == restorePasswordId).first()

"""
    Atualizar
"""

"""
    Deletar
"""

def delete_restore_password_by_id(restorePasswordId: str) -> None:
    RestorePassword.delete().where(RestorePassword.id == restorePasswordId).execute()

def delete_all_user_restore_codes(userId: str) -> None:
    RestorePassword.delete().where(RestorePassword.usuario == userId).execute()
