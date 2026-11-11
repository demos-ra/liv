import os

from . import mtsv
from . import relations
from . import uuid
from . import xsd

FILE_PERMISSION_BITS = 0o777
# /data/store append 2
# POSIX-XSH-OPEN /DESCRIPTION/23 to /DESCRIPTION/24
# POSIX-XSH-OPEN /DESCRIPTION/29 to /DESCRIPTION/30
# POSIX-XSH-LINK /DESCRIPTION/1 to /DESCRIPTION/2
# POSIX-XBD-DEFS /3.264 Portable Filename/1 to /3.265 Portable Filename Character Set/5
# MTSV-DRAFT /Generators/3 to /Generators/3
# MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
# POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
# PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1
# /data/store append 3
# POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
# POSIX-XSH-OPEN /DESCRIPTION/17 to /DESCRIPTION/18
# MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
# /data/store read 2
# POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
# MTSV-DRAFT /Data Model/1 to /Data Model/1
# MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
# CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/7
# PY-FUNCTIONS /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2 to /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2
UTF_8 = "utf-8"


def append(book, sheet_name, header, rows):
    # /data/store append 1
    # POSIX-XSH-MKDIR /DESCRIPTION/1 to /DESCRIPTION/1
    # POSIX-XSH-MKDIR /ERRORS/1 to /ERRORS/5
    # PY-OS /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/1 to /os --- Miscellaneous operating system interfaces/Files and Directories/makedirs(name, mode=0o777, exist_ok=False)/2
    os.makedirs(os.path.dirname(book), FILE_PERMISSION_BITS, exist_ok=True)
    # /data/store append 2
    # POSIX-XSH-OPEN /DESCRIPTION/23 to /DESCRIPTION/24
    # POSIX-XSH-OPEN /DESCRIPTION/29 to /DESCRIPTION/30
    # POSIX-XSH-LINK /DESCRIPTION/1 to /DESCRIPTION/2
    # POSIX-XBD-DEFS /3.264 Portable Filename/1 to /3.265 Portable Filename Character Set/5
    # MTSV-DRAFT /Generators/3 to /Generators/3
    # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # PY-OS /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1 to /os --- Miscellaneous operating system interfaces/File Descriptor Operations/open(path, flags, mode=0o777, *, dir_fd=None)/1
    if not os.path.exists(book):
        new = os.path.join(os.path.dirname(book), uuid.uuid4()[len(uuid.URN):])
        descriptor = os.open(new, os.O_WRONLY | os.O_CREAT | os.O_EXCL, FILE_PERMISSION_BITS)
        try:
            os.write(descriptor, mtsv.generate([mtsv.sheet(sheet_name, header, rows)]).encode(UTF_8))
        finally:
            os.close(descriptor)
        try:
            os.link(new, book)
            return len(rows)
        # /data/store append 4
        # POSIX-XSH-LINK /ERRORS/4 to /ERRORS/5
        # POSIX-XSH-LINK /DESCRIPTION/6 to /DESCRIPTION/6
        except FileExistsError:
            pass
        # /data/store append 5
        # POSIX-XSH-UNLINK /DESCRIPTION/1 to /DESCRIPTION/1
        finally:
            os.unlink(new)
    # /data/store append 3
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # POSIX-XSH-OPEN /DESCRIPTION/17 to /DESCRIPTION/18
    # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
    descriptor = os.open(book, os.O_WRONLY | os.O_APPEND)
    try:
        os.write(descriptor, "".join(mtsv.record([row[column] for column in header]) for row in rows).encode(UTF_8))
    finally:
        os.close(descriptor)
    return len(rows)


def read(book):
    # /data/store read 1
    # POSIX-XSH-OPEN /ERRORS/22 to /ERRORS/23
    try:
        # /data/store read 2
        # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
        # MTSV-DRAFT /Data Model/1 to /Data Model/1
        # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
        # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/7
        # PY-FUNCTIONS /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2 to /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2
        descriptor = os.open(book, os.O_RDONLY)
    # /data/store read 1
    # POSIX-XSH-OPEN /ERRORS/22 to /ERRORS/23
    except FileNotFoundError:
        return []
    # /data/store read 2
    # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
    # MTSV-DRAFT /Data Model/1 to /Data Model/1
    # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/7
    # PY-FUNCTIONS /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2 to /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2
    with open(descriptor, "rb") as file:
        text = file.read().decode(UTF_8)
    sheets, fields = mtsv.parse(text)
    rows = []
    seen = set()
    for sheet in sheets:
        records = {}
        for field in fields:
            if field["Sheet"] == sheet["Sheet"]:
                records.setdefault(field["Record"], []).append(field["Text"])
        # /data/store read 3
        # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/1 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/1
        # MTSV-DRAFT /Data Model/1 to /Data Model/1
        relation = {
            relations.ENTITIES_NAME: relations.ENTITIES,
            relations.RUNS_NAME: relations.RUNS,
            relations.DATASET_NAME: relations.DATASET,
        }.get(sheet["sheet name"], [])
        integers = {column for column, type in relation if type == "integer"}
        # /data/store read 2
        # POSIX-XSH-OPEN /DESCRIPTION/5 to /DESCRIPTION/15
        # MTSV-DRAFT /Data Model/1 to /Data Model/1
        # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
        # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/7
        # PY-FUNCTIONS /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2 to /Built-in Functions/open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)/2
        for number in sorted(records):
            if number > 0 and tuple(records[number]) not in seen:
                seen.add(tuple(records[number]))
                row = dict(zip(records[0], records[number]))
                # /data/store read 3
                # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/1 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/1
                # MTSV-DRAFT /Data Model/1 to /Data Model/1
                rows.append({column: xsd.integer_value(value) if column in integers else value for column, value in row.items()})
    return rows


def keep_entity(entities_book, runs_book, activity, agent, time, text):
    # /data/store keep_entity 1
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/29 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/29
    entities, runs = relations.entity_rows(activity, agent, time, text)
    append(entities_book, relations.ENTITIES_NAME, [column for column, type in relations.ENTITIES], entities)
    append(runs_book, relations.RUNS_NAME, [column for column, type in relations.RUNS], runs)
