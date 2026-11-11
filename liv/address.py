import os

from . import uri

ENTITIES_BOOK = "entities.mtsv"
RUNS_BOOK = "runs.mtsv"
DATASET_BOOK = "dataset.mtsv"
BASE_DIRECTORY = "liv"
# /data/address memory_directory 3
# RFC3986 /2. Characters/2.3. Unreserved Characters/3 to /2. Characters/2.3. Unreserved Characters/3
# BCP14 /rfc2119.txt/4. SHOULD NOT/1 to /rfc2119.txt/4. SHOULD NOT/1
PERIOD = "."
ENCODED_PERIOD = "%2E"


def memory_directory(base, directory):
    # /data/address memory_directory 2
    # POSIX-XSH-REALPATH /DESCRIPTION/1 to /DESCRIPTION/1
    resolved = os.path.realpath(directory)
    # /data/address memory_directory 1
    segments = [uri.percent_encode(segment) for segment in resolved.split("/") if segment]
    # /data/address memory_directory 3
    # RFC3986 /2. Characters/2.3. Unreserved Characters/3 to /2. Characters/2.3. Unreserved Characters/3
    # BCP14 /rfc2119.txt/4. SHOULD NOT/1 to /rfc2119.txt/4. SHOULD NOT/1
    segments = [
        segment.replace(PERIOD, ENCODED_PERIOD) if segment in (ENTITIES_BOOK, RUNS_BOOK, DATASET_BOOK) else segment
        for segment in segments
    ]
    # /data/address memory_directory 1
    return os.path.join(base, BASE_DIRECTORY, *segments)


def book_paths(directory):
    # /data/address book_paths 1
    # PARNAS1985 /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.4 SYSTEM GENERATION MODULE/1 to /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.4 SYSTEM GENERATION MODULE/1
    return (
        os.path.join(directory, ENTITIES_BOOK),
        os.path.join(directory, RUNS_BOOK),
        os.path.join(directory, DATASET_BOOK),
    )
