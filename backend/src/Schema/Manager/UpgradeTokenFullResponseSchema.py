from src.Schema.BaseModel import BaseModel

from typing import Annotated, Optional
from pydantic import Field, BeforeValidator

from src.Validator.GenericValidator import mask_uuid
from src.Schema.User.UserRoleEnum import UserRole

from uuid import UUID, uuid4
from datetime import datetime, timedelta

class UpgradeTokenFullResponseSchema(BaseModel):
    id          : Annotated[UUID,               Field(example=uuid4())]
    fator_cargo : Annotated[UserRole,           Field(example=UserRole.MANAGER)]
    usado       : Annotated[bool,               Field(example=True)]
    usuario     : Annotated[Optional[UUID],     Field(example=uuid4()), BeforeValidator(mask_uuid)]
    criado_em   : Annotated[datetime,           Field(example=datetime.now() - timedelta(minutes=40))]
    revogado_em : Annotated[Optional[datetime], Field(example=datetime.now())]
