import datetime
import decimal
import math
import re
import struct
import uuid

XSD = "http://www.w3.org/2001/XMLSchema#"
XSD_DATE_TIME = XSD + "dateTime"
XSD_INTEGER = XSD + "integer"
XSD_BOOLEAN = XSD + "boolean"
XSD_DECIMAL = XSD + "decimal"
XSD_FLOAT = XSD + "float"
XSD_DOUBLE = XSD + "double"
XSD_DAY_TIME_DURATION = XSD + "dayTimeDuration"
# /interface/types percent_encode 1
# RFC3986 /2. Characters/2.1. Percent-Encoding/1 to /2. Characters/2.1. Percent-Encoding/3
# RFC3986 /2. Characters/2.3. Unreserved Characters/1 to /2. Characters/2.3. Unreserved Characters/3
# RFC3986 /2. Characters/2.4. When to Encode or Decode/3 to /2. Characters/2.4. When to Encode or Decode/3
UNRESERVED = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
# /interface/types transform_references 1
# RFC3986 /5. Reference Resolution/5.2. Relative Resolution/1 to /5. Reference Resolution/5.3. Component Recomposition/27
# RFC3986 /Appendix B. Parsing a URI Reference with a Regular Expression/1 to /Appendix B. Parsing a URI Reference with a Regular Expression/23
URI_REFERENCE = re.compile("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?", re.DOTALL)
# /interface/types urn 1
# RFC9562 /4. UUID Format/14 to /4. UUID Format/24
# PY-UUID /uuid --- UUID objects according to RFC 9562/UUID.urn/1 to /uuid --- UUID objects according to RFC 9562/UUID.urn/1
URN = "urn:uuid:"
# /interface/types date_time_seconds 1
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/3 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/10
DATE_TIME_LEXICAL_REP = re.compile(
    "(-?)([1-9][0-9]{3,}|0[0-9]{3})"
    "-(0[1-9]|1[0-2])"
    "-(0[1-9]|[12][0-9]|3[01])"
    "T(([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9](\\.[0-9]+)?)|(24:00:00(\\.0+)?))"
    "(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))"
)
# /interface/types decimal_lexical_map 1
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/4
# XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/107 to /E Function Definitions/E.1 Generic Number-related Functions/114
# PY-DECIMAL /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1 to /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1
DECIMAL_LEXICAL_REP = re.compile("(\\+|-)?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)")
# /interface/types float_lexical_map 1
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/5
# XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/153 to /E Function Definitions/E.1 Generic Number-related Functions/169
FLOAT_REP = re.compile("(\\+|-)?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)([Ee](\\+|-)?[0-9]+)?|(\\+|-)?INF|NaN")
# /interface/types double_lexical_map 1
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/5
# XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/170 to /E Function Definitions/E.1 Generic Number-related Functions/186
DOUBLE_REP = FLOAT_REP
# /interface/types boolean_lexical_map 1
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/2
# XSD11-2 /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/4 to /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/8
BOOLEAN_REP = re.compile("true|false|1|0")
# /interface/types escape 1
# MTSV-DRAFT /Generators/4 to /Generators/4
# RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
ESCAPES = [("\\", "\\\\"), ("\t", "\\t"), ("\n", "\\n"), ("\f", "\\f"), ("\r", "\\r")]
# /interface/types string_literal_quote 1
# RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/Productions for terminals/10 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/10
# RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
STRING_LITERAL_QUOTE = "\"(?:[^\\x22\\x5C\\x0A\\x0D]|\\\\[tbnrf\"'\\\\]|\\\\u[0-9A-Fa-f]{4}|\\\\U[0-9A-Fa-f]{8})*\""
QUOTATION_MARK = "\""
QUOTATION_MARK_ESCAPE = "\\\""
# /interface/types unescape 1
# RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
STRING_ESCAPE_SEQUENCES = {"t": "\t", "b": "\b", "n": "\n", "r": "\r", "f": "\f", '"': '"', "'": "'", "\\": "\\"}


def percent_encode(octets):
    # /interface/types percent_encode 1
    # RFC3986 /2. Characters/2.1. Percent-Encoding/1 to /2. Characters/2.1. Percent-Encoding/3
    # RFC3986 /2. Characters/2.3. Unreserved Characters/1 to /2. Characters/2.3. Unreserved Characters/3
    # RFC3986 /2. Characters/2.4. When to Encode or Decode/3 to /2. Characters/2.4. When to Encode or Decode/3
    return "".join(chr(octet) if octet in UNRESERVED else "%" + format(octet, "02X") for octet in octets)


def _remove_dot_segments(path):
    # /interface/types transform_references 1
    # RFC3986 /5. Reference Resolution/5.2. Relative Resolution/1 to /5. Reference Resolution/5.3. Component Recomposition/27
    # RFC3986 /Appendix B. Parsing a URI Reference with a Regular Expression/1 to /Appendix B. Parsing a URI Reference with a Regular Expression/23
    output = ""
    while path:
        if path.startswith("../"):
            path = path[3:]
        elif path.startswith("./"):
            path = path[2:]
        elif path.startswith("/./"):
            path = "/" + path[3:]
        elif path == "/.":
            path = "/"
        elif path.startswith("/../") or path == "/..":
            path = "/" + path[4:]
            output = output[:max(output.rfind("/"), 0)]
        elif path in (".", ".."):
            path = ""
        else:
            end = path.find("/", 1)
            end = len(path) if end == -1 else end
            output += path[:end]
            path = path[end:]
    return output


def transform_references(reference, base):
    # /interface/types transform_references 1
    # RFC3986 /5. Reference Resolution/5.2. Relative Resolution/1 to /5. Reference Resolution/5.3. Component Recomposition/27
    # RFC3986 /Appendix B. Parsing a URI Reference with a Regular Expression/1 to /Appendix B. Parsing a URI Reference with a Regular Expression/23
    scheme, authority, path, query, fragment = URI_REFERENCE.match(reference).group(2, 4, 5, 7, 9)
    base_scheme, base_authority, base_path, base_query, _ = URI_REFERENCE.match(base).group(2, 4, 5, 7, 9)
    if scheme is not None:
        path = _remove_dot_segments(path)
    else:
        if authority is not None:
            path = _remove_dot_segments(path)
        else:
            if path == "":
                path = base_path
                query = query if query is not None else base_query
            elif path.startswith("/"):
                path = _remove_dot_segments(path)
            else:
                if base_authority is not None and base_path == "":
                    path = "/" + path
                else:
                    path = base_path[:base_path.rfind("/") + 1] + path
                path = _remove_dot_segments(path)
            authority = base_authority
        scheme = base_scheme
    target = ""
    if scheme is not None:
        target += scheme + ":"
    if authority is not None:
        target += "//" + authority
    target += path
    if query is not None:
        target += "?" + query
    if fragment is not None:
        target += "#" + fragment
    return target


def uuid4():
    # /interface/types uuid4 1
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/4
    # RFC9562 /4. UUID Format/14 to /4. UUID Format/24
    # PY-UUID /uuid --- UUID objects according to RFC 9562/uuid4()/1 to /uuid --- UUID objects according to RFC 9562/uuid4()/1
    return str(uuid.uuid4()).lower()


def urn(uuid):
    # /interface/types urn 1
    # RFC9562 /4. UUID Format/14 to /4. UUID Format/24
    # PY-UUID /uuid --- UUID objects according to RFC 9562/UUID.urn/1 to /uuid --- UUID objects according to RFC 9562/UUID.urn/1
    return URN + uuid


def canonical_date_time(seconds):
    # /interface/types canonical_date_time 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/20 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/20
    # PY-DATETIME /datetime --- Basic date and time types/datetime Objects/datetime.fromtimestamp(timestamp, tz=None)/1 to /datetime --- Basic date and time types/timezone Objects/timezone.utc/1
    # XSD11-2 /E Function Definitions/E.3 Date/time-related Definitions/E.3.6 Canonical Mappings/32 to /E Function Definitions/E.3 Date/time-related Definitions/E.3.6 Canonical Mappings/38
    instant = datetime.datetime.fromtimestamp(seconds, tz=datetime.timezone.utc)
    time = instant.strftime("%Y-%m-%dT%H:%M:%S")
    if instant.microsecond:
        time += ("." + format(instant.microsecond, "06d")).rstrip("0")
    return time + "Z"


def date_time_seconds(text):
    # /interface/types date_time_seconds 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/5 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/19
    # XSD11-2 /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/2 to /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/16
    match = DATE_TIME_LEXICAL_REP.fullmatch(text)
    if match is None:
        return None
    year = int(match.group(2)) * (-1 if match.group(1) else 1)
    month, day = int(match.group(3)), int(match.group(4))
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    if day > [31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]:
        return None
    # /interface/types date_time_seconds 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/3 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/10
    if match.group(10):
        hour, minute, second = 24, 0, decimal.Decimal(0)
    else:
        hour, minute, second = int(match.group(6)), int(match.group(7)), decimal.Decimal(match.group(8))
    zone = match.group(12)
    offset = 0 if zone == "Z" else (1 if zone[0] == "+" else -1) * (int(zone[1:3]) * 60 + int(zone[4:6])) * 60
    shifted = year - (1 if month <= 2 else 0)
    era = shifted // 400
    year_of_era = shifted - era * 400
    day_of_year = (153 * (month + (-3 if month > 2 else 9)) + 2) // 5 + day - 1
    days = era * 146097 + year_of_era * 365 + year_of_era // 4 - year_of_era // 100 + day_of_year - 719468
    return float(days * 86400 + hour * 3600 + minute * 60 + second - offset)


def canonical_integer(integer):
    # /interface/types canonical_integer 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.2 Canonical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.2 Canonical representation/1
    return str(integer)


def decimal_lexical_map(text):
    # /interface/types decimal_lexical_map 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/3
    if DECIMAL_LEXICAL_REP.fullmatch(text) is None:
        return None
    # /interface/types decimal_lexical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/4
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/107 to /E Function Definitions/E.1 Generic Number-related Functions/114
    # PY-DECIMAL /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1 to /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1
    return decimal.Decimal(text)


def decimal_canonical_map(value):
    # /interface/types decimal_canonical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/5 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.3 decimal/3.3.3.1 Lexical Mapping/6
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/115 to /E Function Definitions/E.1 Generic Number-related Functions/119
    # PY-DECIMAL /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1 to /decimal --- Decimal fixed-point and floating-point arithmetic/Decimal objects/Decimal(value="0", context=None)/1
    value = decimal.Decimal(value)
    if value == value.to_integral_value():
        return str(int(value))
    return format(value.normalize(), "f")


def day_time_duration_canonical_map(seconds):
    # /interface/types day_time_duration_canonical_map 1
    # XSD11-2 /E Function Definitions/E.2 Duration-related Definitions/97 to /E Function Definitions/E.2 Duration-related Definitions/104
    # XSD11-2 /E Function Definitions/E.2 Duration-related Definitions/109 to /E Function Definitions/E.2 Duration-related Definitions/109
    seconds = decimal.Decimal(seconds)
    if seconds == 0:
        return "PT0S"
    sign = "-" if seconds < 0 else ""
    seconds = abs(seconds)
    days = int(seconds // 86400)
    hours = int(seconds % 86400 // 3600)
    minutes = int(seconds % 3600 // 60)
    rest = seconds % 60
    text = sign + "P"
    if days:
        text += str(days) + "D"
    if hours or minutes or rest:
        text += "T"
        if hours:
            text += str(hours) + "H"
        if minutes:
            text += str(minutes) + "M"
        if rest:
            text += decimal_canonical_map(rest) + "S"
    return text


def _float_round(value, bits):
    # /interface/types float_lexical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/5
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/153 to /E Function Definitions/E.1 Generic Number-related Functions/169
    if bits == 53 or math.isnan(value) or math.isinf(value):
        return value
    try:
        return struct.unpack("<f", struct.pack("<f", value))[0]
    except OverflowError:
        return math.copysign(math.inf, value)


def float_lexical_map(text):
    # /interface/types float_lexical_map 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/2
    if FLOAT_REP.fullmatch(text) is None:
        return None
    # /interface/types float_lexical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/5
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/153 to /E Function Definitions/E.1 Generic Number-related Functions/169
    return _float_round(float(text.replace("INF", "inf")), 24)


def _scientific_canonical_map(value, bits, digits):
    # /interface/types float_canonical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/7 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/7
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/187 to /E Function Definitions/E.1 Generic Number-related Functions/199
    if math.isnan(value):
        return "NaN"
    if math.isinf(value):
        return "INF" if value > 0 else "-INF"
    if value == 0:
        return "-0.0E0" if math.copysign(1, value) < 0 else "0.0E0"
    for precision in range(1, digits + 1):
        text = format(value, "." + str(precision - 1) + "e")
        if _float_round(float(text), bits) == value:
            break
    mantissa, exponent = text.split("e")
    if "." not in mantissa:
        mantissa += ".0"
    whole, fraction = mantissa.split(".")
    fraction = fraction.rstrip("0") or "0"
    return whole + "." + fraction + "E" + str(int(exponent))


def float_canonical_map(value):
    # /interface/types float_canonical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/7 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.4 float/3.3.4.2 Lexical Mapping/7
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/187 to /E Function Definitions/E.1 Generic Number-related Functions/199
    return _scientific_canonical_map(value, 24, 9)


def double_lexical_map(text):
    # /interface/types double_lexical_map 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/2
    if DOUBLE_REP.fullmatch(text) is None:
        return None
    # /interface/types double_lexical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/5
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/170 to /E Function Definitions/E.1 Generic Number-related Functions/186
    return float(text.replace("INF", "inf"))


def double_canonical_map(value):
    # /interface/types double_canonical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/7 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.5 double/3.3.5.2 Lexical Mapping/7
    # XSD11-2 /E Function Definitions/E.1 Generic Number-related Functions/200 to /E Function Definitions/E.1 Generic Number-related Functions/212
    return _scientific_canonical_map(value, 53, 17)


def boolean_lexical_map(text):
    # /interface/types boolean_lexical_map 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/1
    if BOOLEAN_REP.fullmatch(text) is None:
        return None
    # /interface/types boolean_lexical_map 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/1 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.2 boolean/3.3.2.2 Lexical Mapping/2
    # XSD11-2 /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/4 to /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/8
    return text in ("true", "1")


def boolean_canonical_map(value):
    # /interface/types boolean_canonical_map 1
    # XSD11-2 /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/11 to /E Function Definitions/E.4 Lexical and Canonical Mappings for Other Datatypes/15
    return "true" if value else "false"


def escape(text):
    # /interface/types escape 1
    # MTSV-DRAFT /Generators/4 to /Generators/4
    # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
    for character, sequence in ESCAPES:
        text = text.replace(character, sequence)
    return text


def string_literal_quote(text):
    # /interface/types string_literal_quote 1
    # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/Productions for terminals/10 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/10
    # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
    return QUOTATION_MARK + QUOTATION_MARK_ESCAPE.join(escape(part) for part in text.split(QUOTATION_MARK)) + QUOTATION_MARK


def unescape(text):
    # /interface/types unescape 1
    # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/8 to /6. Turtle Grammar/6.4 Escape Sequences/17
    out = []
    position = 0
    while position < len(text):
        character = text[position]
        if character == "\\" and position + 1 < len(text) and text[position + 1] in STRING_ESCAPE_SEQUENCES:
            out.append(STRING_ESCAPE_SEQUENCES[text[position + 1]])
            position += 2
        else:
            out.append(character)
            position += 1
    return "".join(out)
