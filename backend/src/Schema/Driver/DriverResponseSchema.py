from src.Schema.BaseModel import BaseModel

from pydantic import Field, BeforeValidator
from typing import Annotated, Optional

from uuid import UUID, uuid4
from datetime import datetime, timezone, timedelta

from src.Validator.GenericValidator import mask_uuid

from src.Schema.User.UserRoleEnum import UserRole

class DriverResponseSchema(BaseModel):
    id            : Annotated[UUID,           Field(example=uuid4()), BeforeValidator(mask_uuid)]
    email         : Annotated[str,            Field(example="vinijr@mail.com")]
    nome          : Annotated[str,            Field(example="Vinícius José Paixão de Oliveira Júnior")]
    nascimento    : Annotated[datetime,       Field(example=datetime(2000, 7, 12))]
    telefone      : Annotated[str,            Field(example="9821234567")]
    cargo         : Annotated[int,            Field(example=UserRole.DRIVER)]
    id_ambulancia : Annotated[Optional[UUID], Field(example=uuid4()), BeforeValidator(mask_uuid)]
    em_viagem     : Annotated[bool,           Field(example=False)]
    cnh           : Annotated[str,            Field(example="123456789")]
    vencimento    : Annotated[datetime,       Field(example=datetime.now(timezone.utc) + timedelta(days=365 * 2))]

DRIVER_EXAMPLE = DriverResponseSchema.model_validate({
    "id"            : uuid4(),
    "email"         : "vinijr@mail.com",
    "nome"          : "Vinícius José Paixão de Oliveira Júnior",
    "nascimento"    : datetime(2000, 7, 12),
    "telefone"      : "9821234567",
    "cargo"         : UserRole.DRIVER,
    "id_ambulancia" : uuid4(),
    "em_viagem"     : False,
    "cnh"           : "123456789",
    "vencimento"    : datetime.now(timezone.utc) + timedelta(days=365 * 2)
})
