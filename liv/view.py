from .find import find
from .memory import memory_directory


def view(base, directory, args):
    # /behavior/drivers/view view 1
    return find(memory_directory(base, directory), args)
