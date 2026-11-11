from . import xsd

HT = "\t"
LF = "\n"
FF = "\f"
CR = "\r"
SHEETS = [("Sheet", "integer"), ("sheet name", "string")]
SHEETS_NAME = "sheets"
SHEETS_KEY = ["Sheet"]
FIELDS = [("Sheet", "integer"), ("Record", "integer"), ("Field", "integer"), ("Text", "string")]
FIELDS_NAME = "fields"
FIELDS_KEY = ["Sheet", "Record", "Field"]
# /format/mtsv parse 3
# MTSV-DRAFT /Syntax/Grammar/13 to /Syntax/Grammar/13
NOT_MTSV = "not MTSV"
# /format/mtsv record 2
# MTSV-DRAFT /Generators/4 to /Generators/4
CANNOT_BE_REPRESENTED = "cannot be represented"


def parse(text):
    sheets = []
    fields = []
    # /format/mtsv parse 2
    # MTSV-DRAFT /Parsers/3 to /Parsers/3
    lines = text.split(LF)
    if lines[-1] == "":
        lines.pop()
    lines = [line[:-1] if line.endswith(CR) else line for line in lines]
    # /format/mtsv parse 1
    # MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
    # MTSV-DRAFT /Parsers/1 to /Parsers/2
    record = 0
    width = 0
    for number, line in enumerate(lines, 1):
        if line.startswith(FF):
            sheets.append({"Sheet": len(sheets) + 1, "sheet name": line[1:]})
            record = 0
            continue
        if not sheets:
            sheets.append({"Sheet": 1, "sheet name": ""})
        values = line.split(HT)
        if record == 0:
            width = len(values)
        # /format/mtsv parse 3
        # MTSV-DRAFT /Syntax/Grammar/13 to /Syntax/Grammar/13
        if record > 0 and len(values) != width:
            raise ValueError(NOT_MTSV + " " + str(number))
        # /format/mtsv parse 1
        # MTSV-DRAFT /Syntax/Grammar/1 to /Syntax/Grammar/12
        # MTSV-DRAFT /Parsers/1 to /Parsers/2
        for field, value in enumerate(values, 1):
            fields.append({"Sheet": len(sheets), "Record": record, "Field": field, "Text": value})
        record += 1
    return sheets, fields


def generate(sheets):
    # /format/mtsv generate 1
    # MTSV-DRAFT /Data Model/2 to /Data Model/2
    return "".join(sheets)


def record(values):
    # /format/mtsv record 1
    # MTSV-DRAFT /Syntax/Separators/3 to /Syntax/Separators/4
    # MTSV-DRAFT /Generators/1 to /Generators/2
    fields = [xsd.canonical_integer(value) if isinstance(value, int) else value for value in values]
    # /format/mtsv record 2
    # MTSV-DRAFT /Generators/4 to /Generators/4
    for field in fields:
        if any(character in field for character in (HT, LF, FF, CR)):
            raise ValueError(CANNOT_BE_REPRESENTED)
    # /format/mtsv record 1
    # MTSV-DRAFT /Syntax/Separators/3 to /Syntax/Separators/4
    # MTSV-DRAFT /Generators/1 to /Generators/2
    return HT.join(fields) + LF


def sheet(sheet_name, header, rows):
    # /format/mtsv sheet 1
    # MTSV-DRAFT /Data Model/1 to /Data Model/1
    # MTSV-DRAFT /Generators/3 to /Generators/3
    return FF + record([sheet_name]) + record(header) + "".join(record([row[column] for column in header]) for row in rows)
