from enum import StrEnum

class Colors(StrEnum):
    RESET        = "\x1b[0m"
    
    BOLD_DEFAULT = "\x1b[1;39m"
    BOLD_RED     = "\x1b[1;31m"
    BOLD_GREEN   = "\x1b[1;32m"
    BOLD_YELLOW  = "\x1b[1;33m"
    BOLD_BLUE    = "\x1b[1;34m"

    DEFAULT = "\x1b[39m"
    RED     = "\x1b[31m"
    GREEN   = "\x1b[32m"
    YELLOW  = "\x1b[33m"
    BLUE    = "\x1b[34m"
