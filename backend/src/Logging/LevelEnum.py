from enum import IntEnum

class Level(IntEnum):

    CRITICAL  = 50
    FATAL     = CRITICAL
    ERROR     = 40
    WARNING   = 30
    WARN      = WARNING
    INFO      = 20
    DEBUG     = 10
    NOTSET    = 0

    SENSITIVE = 67
