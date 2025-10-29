import logging
from logging.handlers import RotatingFileHandler

from src.Logging.LevelEnum import Level
from src.Utils import env

FORMAT = '%(message)s'
logging.basicConfig(format=FORMAT, level=logging.INFO)
logger = logging.getLogger("main_logger")

rotativeHandler = RotatingFileHandler(filename="log.txt", maxBytes=32768, encoding="utf-8")
logger.addHandler(rotativeHandler)
