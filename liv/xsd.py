import datetime
import re

XSD = "http://www.w3.org/2001/XMLSchema#"
XSD_DATE_TIME = XSD + "dateTime"
XSD_INTEGER = XSD + "integer"
# /format/xsd date_time_seconds 2
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/5 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/19
# XSD11-2 /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/2 to /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/16
DATE_TIME = re.compile(
    "-?([1-9][0-9]{3,}|0[0-9]{3})"
    "-(0[1-9]|1[0-2])"
    "-(0[1-9]|[12][0-9]|3[01])"
    "T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?|(24:00:00(\\.0+)?))"
    "(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))"
)
NOT_AN_XSD_DATE_TIME = "not an xsd:dateTime"
# /format/xsd integer_value 2
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
INTEGER = re.compile("[+-]?[0-9]+")
NOT_AN_XSD_INTEGER = "not an xsd:integer"


def canonical_date_time(seconds):
    # /format/xsd canonical_date_time 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/20 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/20
    # XSD11-2 /E Function Definitions/E.3 Date/time-related Definitions/E.3.6 Canonical Mappings to /E Function Definitions/E.3 Date/time-related Definitions/E.3.6 Canonical Mappings
    instant = datetime.datetime.fromtimestamp(seconds, tz=datetime.timezone.utc)
    time = instant.strftime("%Y-%m-%dT%H:%M:%S")
    if instant.microsecond:
        time += ("." + format(instant.microsecond, "06d")).rstrip("0")
    return time + "Z"


def date_time_seconds(text):
    # /format/xsd date_time_seconds 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/5 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/19
    # XSD11-2 /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/2 to /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/16
    if DATE_TIME.fullmatch(text) is None:
        raise ValueError(NOT_AN_XSD_DATE_TIME)
    # /format/xsd date_time_seconds 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/3 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/10
    negative = text.startswith("-")
    date, clock = text[1 if negative else 0:].split("T")
    year, month, day = [int(part) for part in date.split("-")]
    year = -year if negative else year
    if clock.endswith("Z"):
        clock, offset = clock[:-1], 0
    else:
        clock, zone = clock[:-6], clock[-6:]
        offset = (1 if zone[0] == "+" else -1) * (int(zone[1:3]) * 60 + int(zone[4:6])) * 60
    hour, minute, second = clock.split(":")
    # /format/xsd date_time_seconds 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/5 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/19
    # XSD11-2 /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/2 to /D Built-up Value Spaces/D.2 Date/time Values/D.2.1 The Seven-property Model/16
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    if day > [31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]:
        raise ValueError(NOT_AN_XSD_DATE_TIME)
    # /format/xsd date_time_seconds 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.1 Value Space/3 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/10
    shifted = year - (1 if month <= 2 else 0)
    era = shifted // 400
    year_of_era = shifted - era * 400
    day_of_year = (153 * (month + (-3 if month > 2 else 9)) + 2) // 5 + day - 1
    days = era * 146097 + year_of_era * 365 + year_of_era // 4 - year_of_era // 100 + day_of_year - 719468
    return days * 86400 + int(hour) * 3600 + int(minute) * 60 + float(second) - offset


def canonical_integer(integer):
    # /format/xsd canonical_integer 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.2 Canonical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.2 Canonical representation/1
    return str(integer)


def integer_value(text):
    # /format/xsd integer_value 2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
    if INTEGER.fullmatch(text) is None:
        raise ValueError(NOT_AN_XSD_INTEGER)
    # /format/xsd integer_value 1
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
    return int(text)
