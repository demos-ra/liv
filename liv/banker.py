from .files import append, read
from .mtsv import decode, encode
from .relations import sheet_rows, sheet_text


def insert(book, relation, header, rows):
    # /decision/banker insert 1
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/29 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/29
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/1
    text, records = sheet_text(relation, header, rows)
    append(book, encode(text), encode(records))


def obtain(book):
    # /decision/banker obtain 1
    # PARNAS1985 /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.3 DATA BANKER MODULE/1 to /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.3 DATA BANKER MODULE/1
    # PARNAS1985 /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.3 DATA BANKER MODULE/4 to /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.3 DATA BANKER MODULE/5
    return sheet_rows(decode(read(book)))
