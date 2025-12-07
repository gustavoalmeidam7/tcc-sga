import logging
from logging.handlers import RotatingFileHandler
from src.Logging.LevelEnum import Level
from uvicorn.logging import DefaultFormatter

logger = logging.getLogger("uvicorn")

formatter = DefaultFormatter("%(levelprefix)s %(asctime)s - %(message)s - %(pathname)s:%(lineno)d", datefmt="%Y-%m-%d %H:%M:%S")

rotativeHandler = RotatingFileHandler(filename="log.txt", maxBytes=32768, encoding="utf-8")
rotativeHandler.setFormatter(formatter)

for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logger = logging.getLogger(name)
        logger.addHandler(rotativeHandler)
        for handler in logger.handlers:
            handler.setFormatter(formatter)
