from enum import StrEnum
from src.Logging.ColorsEnum import Colors

class Level(StrEnum):
    LOG   = f"{Colors.DEFAULT}LOG"
    DEBUG = f"{Colors.GREEN}DEBUG"
    WARN  = f"{Colors.BOLD_YELLOW}WARNING"
    ERROR = f"{Colors.BOLD_RED}ERROR"

    SENSITIVE = f"{Colors.BOLD_RED}SENSITIVE"
