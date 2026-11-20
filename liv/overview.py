from . import tasks
from .banker import obtain
from .relations import pathnames


def overview(directory):
    # /behavior/drivers/overview overview 1
    if tasks.topmost(obtain(pathnames(directory)[2])):
        return tasks.overview(directory, 0)
    # /behavior/drivers/overview overview 2
    return ""
