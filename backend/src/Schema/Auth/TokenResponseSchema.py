from src.Schema.BaseModel import BaseModel, Field

from typing import Annotated

from datetime import datetime, timedelta, timezone

class TokenResponseSchema(BaseModel):
    access_token : Annotated[str,      Field(examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTBkNzdiZTdlOGM0NzA5YWJiZTU4OTkwMGM5NDU1MCJ9.xApFMFZDPfqt-cjqnlz5GxD5fbiy-gbMrMRbozo7H_w"])]
    token_type   : Annotated[str,      Field(examples=["bearer"])]
    expires_at   : Annotated[datetime, Field(examples=[datetime.now(timezone.utc) + timedelta(minutes=30)])]

