from src.Logging import logger
from src.Logging.LevelEnum import Level

def log(message: str, level: Level) -> None:
    """
    Faz o logging de uma mensagem no terminal e no arquivo de texto log.txt
    """
    if level == Level.SENSITIVE:
        print(f"\033[1;31mSENSITIVE: {message}\033[0m")
        return
    
    logger.log(level, message, stacklevel=2) 
