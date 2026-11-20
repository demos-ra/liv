import os

from .files import BASE_DIRECTORY, realpath
from .relations import DATASET_BOOK, ENTITIES_BOOK, WORDS_BOOK
from .types import percent_encode


def memory_directory(base, directory):
    # /behavior/shared/memory memory_directory 1
    # PY-OS-PATH /os.path --- Common pathname manipulations/join(path, /, *paths)/1 to /os.path --- Common pathname manipulations/join(path, /, *paths)/1
    # PY-OS /os --- Miscellaneous operating system interfaces/Process Parameters/fsencode(filename)/1 to /os --- Miscellaneous operating system interfaces/Process Parameters/fsencode(filename)/1
    # RFC3986 /2. Characters/2.5. Identifying Data/2 to /2. Characters/2.5. Identifying Data/2
    segments = []
    for segment in realpath(directory).split(os.sep):
        if segment:
            encoded = percent_encode(os.fsencode(segment))
            # /behavior/shared/memory memory_directory 2
            # RFC3986 /2. Characters/2.3. Unreserved Characters/3 to /2. Characters/2.3. Unreserved Characters/3
            # BCP14 /rfc2119.txt/4. SHOULD NOT/1 to /rfc2119.txt/4. SHOULD NOT/1
            if encoded in (ENTITIES_BOOK, WORDS_BOOK, DATASET_BOOK):
                encoded = encoded.replace(".", "%2E")
            segments.append(encoded)
    return os.path.join(base, BASE_DIRECTORY, *segments)
