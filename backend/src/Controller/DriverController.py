from fastapi import APIRouter

DriverRouter = APIRouter(
    prefix="/driver",
    tags=["driver"]
)
