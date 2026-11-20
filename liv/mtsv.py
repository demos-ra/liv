import re

from .types import canonical_integer, escape, unescape

# /interface/mtsv record 1
# MTSV-DRAFT /Syntax/Separators/3 to /Syntax/Separators/4
# MTSV-DRAFT /Generators/1 to /Generators/2
HT = "\t"
LF = "\n"
# /interface/mtsv parse 1
# MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
# MTSV-DRAFT /Parsers/1 to /Parsers/2
FF = "\f"
CR = "\r"
CRLF = CR + LF
# /interface/mtsv decode 1
# MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
# RFC3629 /3. UTF-8 definition/14 to /3. UTF-8 definition/14
# RFC3629 /4. Syntax of UTF-8 Byte Sequences/2 to /4. Syntax of UTF-8 Byte Sequences/4
# PY-CODECS /codecs --- Codec registry and base classes/Codec Base Classes/Error Handlers/9 to /codecs --- Codec registry and base classes/Codec Base Classes/Error Handlers/9
UTF_8 = "utf-8"
SURROGATEESCAPE = "surrogateescape"
# /interface/mtsv parse 3
# MTSV-DRAFT /Syntax/Grammar/13 to /Syntax/Grammar/13
# MTSV-DRAFT /Parsers/5 to /Parsers/5
# MTSV-DRAFT /Syntax/Grammar/3 to /Syntax/Grammar/6
RECORD = re.compile("[\\x00-\\x08\\x0b\\x0e-\\U0010ffff]*(\\t[\\x00-\\x08\\x0b\\x0e-\\U0010ffff]*)*")
MARKED_BYTE = re.compile("[\\udc80-\\udcff]")

SHEETS_NAME = "sheets"
SHEETS = [("Sheet", "integer"), ("sheet name", "string")]
SHEETS_KEY = ["Sheet"]
FIELDS_NAME = "fields"
FIELDS = [("Sheet", "integer"), ("Record", "integer"), ("Field", "integer"), ("Text", "string")]
FIELDS_KEY = ["Sheet", "Record", "Field"]


def encode(text):
    # /interface/mtsv encode 1
    # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
    # RFC3629 /3. UTF-8 definition/2 to /3. UTF-8 definition/2
    return text.encode(UTF_8)


def decode(bytes):
    # /interface/mtsv decode 1
    # MTSV-DRAFT /Syntax/Character Encoding/1 to /Syntax/Character Encoding/1
    # RFC3629 /3. UTF-8 definition/14 to /3. UTF-8 definition/14
    # RFC3629 /4. Syntax of UTF-8 Byte Sequences/2 to /4. Syntax of UTF-8 Byte Sequences/4
    # PY-CODECS /codecs --- Codec registry and base classes/Codec Base Classes/Error Handlers/9 to /codecs --- Codec registry and base classes/Codec Base Classes/Error Handlers/9
    return bytes.decode(UTF_8, SURROGATEESCAPE)


def parse(text):
    # /interface/mtsv parse 2
    # MTSV-DRAFT /Parsers/3 to /Parsers/3
    pieces = text.split(LF)
    lines = []
    for piece in pieces[:-1]:
        lines.append((piece[:-1] if piece.endswith(CR) else piece, True))
    if pieces[-1]:
        lines.append((pieces[-1], False))
    # /interface/mtsv parse 1
    # MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
    # MTSV-DRAFT /Parsers/1 to /Parsers/2
    sheets = []
    fields = []
    sheet = None
    header = None
    record = 0
    for line, ended in lines:
        # /interface/mtsv parse 3
        # MTSV-DRAFT /Syntax/Grammar/13 to /Syntax/Grammar/13
        # MTSV-DRAFT /Parsers/5 to /Parsers/5
        # MTSV-DRAFT /Syntax/Grammar/3 to /Syntax/Grammar/6
        if not ended:
            continue
        # /interface/mtsv parse 1
        # MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
        # MTSV-DRAFT /Parsers/1 to /Parsers/2
        if line.startswith(FF):
            sheet = len(sheets) + 1
            sheets.append({"Sheet": sheet, "sheet name": line[1:]})
            header = None
            continue
        if sheet is None:
            sheet = 1
            sheets.append({"Sheet": sheet, "sheet name": ""})
        values = line.split(HT)
        if header is None:
            header = values
            record = 0
        else:
            # /interface/mtsv parse 3
            # MTSV-DRAFT /Syntax/Grammar/13 to /Syntax/Grammar/13
            # MTSV-DRAFT /Parsers/5 to /Parsers/5
            # MTSV-DRAFT /Syntax/Grammar/3 to /Syntax/Grammar/6
            if RECORD.fullmatch(line) is None or len(values) != len(header) or MARKED_BYTE.search(line):
                continue
            # /interface/mtsv parse 1
            # MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
            # MTSV-DRAFT /Parsers/1 to /Parsers/2
            record += 1
        # /interface/mtsv parse 4
        # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
        for place, value in enumerate(values, 1):
            fields.append({"Sheet": sheet, "Record": record, "Field": place, "Text": unescape(value)})
    return sheets, fields


def record(values):
    # /interface/mtsv record 1
    # MTSV-DRAFT /Syntax/Separators/3 to /Syntax/Separators/4
    # MTSV-DRAFT /Generators/1 to /Generators/2
    return HT.join(canonical_integer(value) if isinstance(value, int) else escape(value) for value in values) + LF


def sheet(sheet_name, header, rows):
    # /interface/mtsv sheet 1
    # MTSV-DRAFT /Data Model/1 to /Data Model/1
    # MTSV-DRAFT /Generators/3 to /Generators/3
    return FF + record([sheet_name]) + record(header) + "".join(record([row[column] for column in header]) for row in rows)


def generate(sheets):
    # /interface/mtsv generate 1
    # MTSV-DRAFT /Data Model/2 to /Data Model/2
    return "".join(sheets)
