from src.Logging import logger

import traceback
from datetime import datetime

from src.Logging.ColorsEnum import Colors
from src.Logging.LevelEnum import Level

def log(message: str, level: Level) -> None:
    """
    Faz o logging asyncrono de uma mensagem no terminal e no arquivo de
    texto LOG_FILE
    """
    dateNow = datetime.now()
    trace = traceback.extract_stack()[-2]

    message = f"{dateNow} - {trace.filename}:{trace.lineno} {trace.name} - {level} - {message} {Colors.RESET}"
    if level == Level.SENSITIVE:
        print(message)
        return
    
    logger.info(message)    
