import decimal
import functools
import hashlib
import math
import random
import re

from .sparql import AGG, BUILT_INS
from .turtle import RDF_LANG_STRING, XSD_BOOLEAN, XSD_DECIMAL, XSD_DOUBLE, XSD_STRING
from .types import (
    XSD,
    XSD_DATE_TIME,
    XSD_DAY_TIME_DURATION,
    XSD_FLOAT,
    XSD_INTEGER,
    boolean_canonical_map,
    boolean_lexical_map,
    canonical_integer,
    date_time_seconds,
    day_time_duration_canonical_map,
    decimal_canonical_map,
    decimal_lexical_map,
    double_canonical_map,
    double_lexical_map,
    float_canonical_map,
    float_lexical_map,
    percent_encode,
    urn,
    uuid4,
)

BOOLEAN_NAME = "boolean"
BOOLEAN = [("boolean", "boolean")]
BOOLEAN_KEY = ["boolean"]
# /decision/utility ebv 4
# SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6
INTEGER_TYPES = {
    XSD + name
    for name in (
        "integer", "nonPositiveInteger", "negativeInteger", "long", "int", "short", "byte", "nonNegativeInteger",
        "unsignedLong", "unsignedInt", "unsignedShort", "unsignedByte", "positiveInteger",
    )
}
NUMERIC = INTEGER_TYPES | {XSD_DECIMAL, XSD_FLOAT, XSD_DOUBLE}
INTEGER_LEXICAL = re.compile("[+-]?[0-9]+")
TRUE = ("true", XSD_BOOLEAN, "")
FALSE = ("false", XSD_BOOLEAN, "")
# /decision/utility functions 43
# SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/2
# XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
DATE_TIME = re.compile(
    "(-?[0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}(?:\\.[0-9]+)?)(Z|[+-][0-9]{2}:[0-9]{2})?"
)
# /decision/utility functions 35
# SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.14 REGEX/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.14 REGEX/3
# FUNCOP /7 Functions on Strings/7.6 String Functions that Use Pattern Matching/7.6.2 fn:matches/1 to /7 Functions on Strings/7.6 String Functions that Use Pattern Matching/7.6.2 fn:matches/12
# PY-RE /re --- Regular expression operations/Module Contents/Functions/search(pattern, string, flags=0)/1 to /re --- Regular expression operations/Module Contents/Functions/search(pattern, string, flags=0)/1
# PY-RE /re --- Regular expression operations/Module Contents/Flags/I, IGNORECASE/1 to /re --- Regular expression operations/Module Contents/Flags/I, IGNORECASE/1
REGEX_FLAGS = {"s": re.DOTALL, "m": re.MULTILINE, "i": re.IGNORECASE, "x": re.VERBOSE}
# /decision/utility order 1
# SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/1 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/2
# SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/43 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/44
ASC = "ASC"
DESC = "DESC"


def _boolean(value):
    return TRUE if value else FALSE


def _is_literal(term):
    return term[1] != ""


def _is_blank(term):
    return term[1] == "" and term[0].startswith("_:")


def _is_iri(term):
    return term[1] == "" and not term[0].startswith("_:")


def _is_string(term):
    # /decision/utility functions 56
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.1 String arguments/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.1 String arguments/2
    return term[1] in (XSD_STRING, RDF_LANG_STRING)


def _kind(datatype):
    if datatype in INTEGER_TYPES:
        return 0
    return {XSD_DECIMAL: 1, XSD_FLOAT: 2, XSD_DOUBLE: 3}.get(datatype)


def _numeric(term):
    # /decision/utility operators 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/16 to /17 Expressions and Testing Values/17.3 Operator Mapping/16
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    if term is None or term[1] not in NUMERIC:
        return None
    kind = _kind(term[1])
    if kind == 0:
        if INTEGER_LEXICAL.fullmatch(term[0]) is None:
            return None
        return 0, int(decimal_lexical_map(term[0]))
    if kind == 1:
        value = decimal_lexical_map(term[0])
        return None if value is None else (1, value)
    value = float_lexical_map(term[0]) if kind == 2 else double_lexical_map(term[0])
    return None if value is None else (kind, value)


def _number_term(kind, value):
    if kind == 0:
        return (canonical_integer(int(value)), XSD_INTEGER, "")
    if kind == 1:
        return (decimal_canonical_map(value), XSD_DECIMAL, "")
    if kind == 2:
        return (float_canonical_map(float_lexical_map(repr(float(value))) if math.isfinite(float(value)) else float(value)), XSD_FLOAT, "")
    return (double_canonical_map(float(value)), XSD_DOUBLE, "")


def _promote(first, second):
    kind = max(first[0], second[0])
    if kind <= 1:
        return kind, decimal.Decimal(first[1]), decimal.Decimal(second[1])
    return kind, float(first[1]), float(second[1])


def _date_time(term):
    # /decision/utility operators 10
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/20 to /17 Expressions and Testing Values/17.3 Operator Mapping/20
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if term is None or term[1] != XSD_DATE_TIME:
        return None
    seconds = date_time_seconds(term[0])
    if seconds is None:
        seconds = date_time_seconds(term[0] + "Z")
    return seconds


def _same(first, second):
    if _is_literal(first) and _is_literal(second):
        return first[0] == second[0] and first[1] == second[1] and first[2].lower() == second[2].lower()
    return first[0] == second[0] and first[1] == second[1]


def _rdf_term_equal(first, second):
    # /decision/utility functions 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/2
    if _same(first, second):
        return True
    if _is_literal(first) and _is_literal(second):
        return None
    return False


def _equal(first, second):
    left, right = _numeric(first), _numeric(second)
    # /decision/utility operators 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/16 to /17 Expressions and Testing Values/17.3 Operator Mapping/16
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    if left is not None and right is not None:
        kind, a, b = _promote(left, right)
        return a == b
    if first[1] in NUMERIC and second[1] in NUMERIC:
        return None
    # /decision/utility operators 7
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/17 to /17 Expressions and Testing Values/17.3 Operator Mapping/17
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 8
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/18 to /17 Expressions and Testing Values/17.3 Operator Mapping/18
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    if first[1] == XSD_STRING and second[1] == XSD_STRING:
        return first[0] == second[0]
    # /decision/utility operators 9
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/19 to /17 Expressions and Testing Values/17.3 Operator Mapping/19
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/3
    if first[1] == XSD_BOOLEAN and second[1] == XSD_BOOLEAN:
        a, b = boolean_lexical_map(first[0]), boolean_lexical_map(second[0])
        return None if a is None or b is None else a == b
    # /decision/utility operators 10
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/20 to /17 Expressions and Testing Values/17.3 Operator Mapping/20
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if first[1] == XSD_DATE_TIME and second[1] == XSD_DATE_TIME:
        a, b = _date_time(first), _date_time(second)
        return None if a is None or b is None else a == b
    # /decision/utility operators 40
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/52 to /17 Expressions and Testing Values/17.3 Operator Mapping/52
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/2
    return _rdf_term_equal(first, second)


def _less(first, second):
    left, right = _numeric(first), _numeric(second)
    # /decision/utility operators 16
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/26 to /17 Expressions and Testing Values/17.3 Operator Mapping/26
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/3
    if left is not None and right is not None:
        kind, a, b = _promote(left, right)
        return a < b
    # /decision/utility operators 17
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/27 to /17 Expressions and Testing Values/17.3 Operator Mapping/27
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 18
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/28 to /17 Expressions and Testing Values/17.3 Operator Mapping/28
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    if first[1] == XSD_STRING and second[1] == XSD_STRING:
        return first[0] < second[0]
    # /decision/utility operators 19
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/29 to /17 Expressions and Testing Values/17.3 Operator Mapping/29
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/3
    if first[1] == XSD_BOOLEAN and second[1] == XSD_BOOLEAN:
        a, b = boolean_lexical_map(first[0]), boolean_lexical_map(second[0])
        return None if a is None or b is None else a < b
    # /decision/utility operators 20
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/30 to /17 Expressions and Testing Values/17.3 Operator Mapping/30
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if first[1] == XSD_DATE_TIME and second[1] == XSD_DATE_TIME:
        a, b = _date_time(first), _date_time(second)
        return None if a is None or b is None else a < b
    return None


def _logical(operator, values):
    # /decision/utility operators 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/13 to /17 Expressions and Testing Values/17.3 Operator Mapping/13
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/2
    # /decision/utility operators 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/14 to /17 Expressions and Testing Values/17.3 Operator Mapping/14
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/2
    # /decision/utility functions 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/2
    # /decision/utility functions 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/2
    a, b = values
    if operator == "||":
        if a is True or b is True:
            return True
        if a is None or b is None:
            return None
        return False
    if a is False or b is False:
        return False
    if a is None or b is None:
        return None
    return True


def ebv(term):
    # /decision/utility ebv 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/7 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/7
    if term is None:
        return None
    # /decision/utility ebv 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
    # /decision/utility ebv 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/4 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/4
    if term[1] == XSD_BOOLEAN:
        # /decision/utility ebv 1
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
        value = boolean_lexical_map(term[0])
        if value is None:
            return False
        # /decision/utility ebv 2
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/4 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/4
        return value
    # /decision/utility ebv 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6
    if term[1] in NUMERIC:
        # /decision/utility ebv 1
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/3
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
        value = _numeric(term)
        if value is None:
            return False
        # /decision/utility ebv 4
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/6
        number = value[1]
        return not (number == 0 or (isinstance(number, float) and math.isnan(number)))
    # /decision/utility ebv 3
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/5 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/5
    if term[1] == XSD_STRING:
        return term[0] != ""
    # /decision/utility ebv 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/7 to /17 Expressions and Testing Values/17.2 Filter Evaluation/17.2.2 Effective Boolean Value (EBV)/7
    return None


def operators(operator, operands):
    # /decision/utility operators 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/7 to /17 Expressions and Testing Values/17.3 Operator Mapping/7
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    if operator == "!" and len(operands) == 1:
        value = ebv(operands[0])
        return None if value is None else _boolean(not value)
    # /decision/utility operators 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/13 to /17 Expressions and Testing Values/17.3 Operator Mapping/13
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/2
    # /decision/utility operators 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/14 to /17 Expressions and Testing Values/17.3 Operator Mapping/14
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/2
    if operator in ("||", "&&"):
        return _boolean_or_none(_logical(operator, [ebv(operand) for operand in operands]))
    if any(operand is None for operand in operands):
        return None
    # /decision/utility operators 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/8 to /17 Expressions and Testing Values/17.3 Operator Mapping/8
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.7 op:numeric-unary-plus/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.7 op:numeric-unary-plus/3
    # /decision/utility operators 3
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/9 to /17 Expressions and Testing Values/17.3 Operator Mapping/9
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.8 op:numeric-unary-minus/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.8 op:numeric-unary-minus/4
    if operator in ("+", "-") and len(operands) == 1:
        value = _numeric(operands[0])
        if value is None:
            return None
        return _number_term(value[0], value[1] if operator == "+" else -value[1])
    first, second = operands
    # /decision/utility operators 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/16 to /17 Expressions and Testing Values/17.3 Operator Mapping/16
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # /decision/utility operators 7
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/17 to /17 Expressions and Testing Values/17.3 Operator Mapping/17
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 8
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/18 to /17 Expressions and Testing Values/17.3 Operator Mapping/18
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 9
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/19 to /17 Expressions and Testing Values/17.3 Operator Mapping/19
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/3
    # /decision/utility operators 10
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/20 to /17 Expressions and Testing Values/17.3 Operator Mapping/20
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    # /decision/utility operators 40
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/52 to /17 Expressions and Testing Values/17.3 Operator Mapping/52
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/2
    if operator == "=":
        return _boolean_or_none(_equal(first, second))
    # /decision/utility operators 11
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/21 to /17 Expressions and Testing Values/17.3 Operator Mapping/21
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # /decision/utility operators 12
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/22 to /17 Expressions and Testing Values/17.3 Operator Mapping/22
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 13
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/23 to /17 Expressions and Testing Values/17.3 Operator Mapping/23
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 14
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/24 to /17 Expressions and Testing Values/17.3 Operator Mapping/24
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.1 op:boolean-equal/3
    # /decision/utility operators 15
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/25 to /17 Expressions and Testing Values/17.3 Operator Mapping/25
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.6 op:dateTime-equal/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    # /decision/utility operators 41
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/53 to /17 Expressions and Testing Values/17.3 Operator Mapping/53
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    if operator == "!=":
        value = _equal(first, second)
        return None if value is None else _boolean(not value)
    # /decision/utility operators 16
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/26 to /17 Expressions and Testing Values/17.3 Operator Mapping/26
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/3
    # /decision/utility operators 17
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/27 to /17 Expressions and Testing Values/17.3 Operator Mapping/27
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 18
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/28 to /17 Expressions and Testing Values/17.3 Operator Mapping/28
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 19
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/29 to /17 Expressions and Testing Values/17.3 Operator Mapping/29
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/3
    # /decision/utility operators 20
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/30 to /17 Expressions and Testing Values/17.3 Operator Mapping/30
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if operator == "<":
        return _boolean_or_none(_less(first, second))
    # /decision/utility operators 21
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/31 to /17 Expressions and Testing Values/17.3 Operator Mapping/31
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.3 op:numeric-greater-than/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.3 op:numeric-greater-than/3
    # /decision/utility operators 22
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/32 to /17 Expressions and Testing Values/17.3 Operator Mapping/32
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 23
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/33 to /17 Expressions and Testing Values/17.3 Operator Mapping/33
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 24
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/34 to /17 Expressions and Testing Values/17.3 Operator Mapping/34
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.3 op:boolean-greater-than/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.3 op:boolean-greater-than/3
    # /decision/utility operators 25
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/35 to /17 Expressions and Testing Values/17.3 Operator Mapping/35
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.8 op:dateTime-greater-than/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.8 op:dateTime-greater-than/4
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if operator == ">":
        return _boolean_or_none(_less(second, first))
    # /decision/utility operators 26
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/36 to /17 Expressions and Testing Values/17.3 Operator Mapping/36
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.2 op:numeric-less-than/3
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # /decision/utility operators 27
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/37 to /17 Expressions and Testing Values/17.3 Operator Mapping/37
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 28
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/38 to /17 Expressions and Testing Values/17.3 Operator Mapping/38
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 29
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/39 to /17 Expressions and Testing Values/17.3 Operator Mapping/39
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.3 op:boolean-greater-than/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.3 op:boolean-greater-than/3
    # /decision/utility operators 30
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/40 to /17 Expressions and Testing Values/17.3 Operator Mapping/40
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.8 op:dateTime-greater-than/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.8 op:dateTime-greater-than/4
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if operator == "<=":
        value = _less(second, first)
        return None if value is None else _boolean(not value)
    # /decision/utility operators 31
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/41 to /17 Expressions and Testing Values/17.3 Operator Mapping/41
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.3 op:numeric-greater-than/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.3 op:numeric-greater-than/3
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # /decision/utility operators 32
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/42 to /17 Expressions and Testing Values/17.3 Operator Mapping/42
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 33
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/43 to /17 Expressions and Testing Values/17.3 Operator Mapping/43
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/1 to /6 Functions and Operators on Numerics/6.3 Comparison Operators on Numeric Values/6.3.1 op:numeric-equal/3
    # FUNCOP /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/1 to /7 Functions on Strings/7.3 Equality and Comparison of Strings/7.3.2 fn:compare/8
    # /decision/utility operators 34
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/44 to /17 Expressions and Testing Values/17.3 Operator Mapping/44
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/1 to /9 Functions and Operators on Boolean Values/9.2 Operators on Boolean Values/9.2.2 op:boolean-less-than/3
    # /decision/utility operators 35
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/45 to /17 Expressions and Testing Values/17.3 Operator Mapping/45
    # FUNCOP /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/1 to /9 Functions and Operators on Boolean Values/9.3 Functions on Boolean Values/9.3.1 fn:not/2
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/1 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/10.4.7 op:dateTime-less-than/3
    # FUNCOP /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22 to /10 Functions and Operators on Durations, Dates and Times/10.4 Comparison Operators on Duration, Date and Time Values/22
    if operator == ">=":
        value = _less(first, second)
        return None if value is None else _boolean(not value)
    left, right = _numeric(first), _numeric(second)
    if left is None or right is None:
        return None
    kind, a, b = _promote(left, right)
    # /decision/utility operators 36
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/47 to /17 Expressions and Testing Values/17.3 Operator Mapping/47
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.3 op:numeric-multiply/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.3 op:numeric-multiply/4
    if operator == "*":
        return _number_term(kind, a * b)
    # /decision/utility operators 37
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/48 to /17 Expressions and Testing Values/17.3 Operator Mapping/48
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.4 op:numeric-divide/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.4 op:numeric-divide/6
    if operator == "/":
        if kind <= 1:
            if b == 0:
                return None
            return _number_term(1, a / b)
        if b == 0:
            return _number_term(kind, math.nan if a == 0 or math.isnan(a) else math.copysign(math.inf, a) * math.copysign(1, b))
        return _number_term(kind, a / b)
    # /decision/utility operators 38
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/49 to /17 Expressions and Testing Values/17.3 Operator Mapping/49
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.1 op:numeric-add/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.1 op:numeric-add/4
    if operator == "+":
        return _number_term(kind, a + b)
    # /decision/utility operators 39
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.3 Operator Mapping/50 to /17 Expressions and Testing Values/17.3 Operator Mapping/50
    # FUNCOP /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.2 op:numeric-subtract/1 to /6 Functions and Operators on Numerics/6.2 Operators on Numeric Values/6.2.2 op:numeric-subtract/4
    if operator == "-":
        return _number_term(kind, a - b)
    return None


def _boolean_or_none(value):
    return None if value is None else _boolean(value)


def _string(lexical, like):
    # /decision/utility functions 58
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.3 String Literal Return Type/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.3 String Literal Return Type/2
    if like[1] == RDF_LANG_STRING:
        return (lexical, RDF_LANG_STRING, like[2])
    return (lexical, XSD_STRING, "")


def _compatible(first, second):
    # /decision/utility functions 57
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.2 Argument Compatibility Rules/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.2 Argument Compatibility Rules/5
    if not (_is_string(first) and _is_string(second)):
        return False
    if second[1] == XSD_STRING:
        return True
    return first[1] == RDF_LANG_STRING and first[2].lower() == second[2].lower()


def _round(kind, value, how):
    if kind == 0:
        return value
    if kind == 1:
        if how == "round":
            return (value + decimal.Decimal("0.5")).to_integral_value(rounding=decimal.ROUND_FLOOR)
        return value.to_integral_value(rounding=decimal.ROUND_CEILING if how == "ceil" else decimal.ROUND_FLOOR)
    if not math.isfinite(value):
        return value
    if how == "round":
        return float(math.floor(value + 0.5))
    return float(math.ceil(value) if how == "ceil" else math.floor(value))


def _replacement(text):
    out = []
    position = 0
    while position < len(text):
        character = text[position]
        if character == "\\" and position + 1 < len(text):
            out.append(text[position + 1].replace("\\", "\\\\"))
            position += 2
        elif character == "$":
            digits = re.match("[0-9]+", text[position + 1:])
            out.append("\\g<" + digits.group() + ">")
            position += 1 + len(digits.group())
        else:
            out.append(character.replace("\\", "\\\\"))
            position += 1
    return "".join(out)


def _flags(flags):
    value = 0
    for flag in flags:
        if flag in REGEX_FLAGS:
            value |= REGEX_FLAGS[flag]
    return value


def functions(function, arguments, *, now, labels):
    name = function.upper()
    # /decision/utility functions 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.1 bound/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.1 bound/2
    if name == "BOUND":
        return _boolean(arguments[0] is not None)
    # /decision/utility functions 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.2 IF/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.2 IF/2
    if name == "IF":
        value = ebv(arguments[0])
        if value is None:
            return None
        return arguments[1] if value else arguments[2]
    # /decision/utility functions 3
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.3 COALESCE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.3 COALESCE/2
    if name == "COALESCE":
        for argument in arguments:
            if argument is not None:
                return argument
        return None
    # /decision/utility functions 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.5 logical-or/2
    # /decision/utility functions 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.6 logical-and/2
    if name in ("LOGICAL-OR", "LOGICAL-AND"):
        return _boolean_or_none(_logical("||" if name == "LOGICAL-OR" else "&&", [ebv(argument) for argument in arguments]))
    # /decision/utility functions 8
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.9 IN/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.9 IN/2
    # /decision/utility functions 9
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.10 NOT IN/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.10 NOT IN/2
    if name == "IN":
        if arguments[0] is None:
            return None
        tests = [operators("=", [arguments[0], argument]) for argument in arguments[1:]]
        if TRUE in tests:
            return TRUE
        if None in tests:
            return None
        return FALSE
    # /decision/utility functions 9
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.10 NOT IN/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.10 NOT IN/2
    if name == "NOT IN":
        if arguments[0] is None:
            return None
        tests = [operators("!=", [arguments[0], argument]) for argument in arguments[1:]]
        if FALSE in tests:
            return FALSE
        if None in tests:
            return None
        return TRUE
    # /decision/utility functions 18
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.9 BNODE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.9 BNODE/4
    if name == "BNODE":
        if not arguments:
            return ("_:" + "b" + uuid4().replace("-", ""), "", "")
        if arguments[0] is None or arguments[0][1] != XSD_STRING:
            return None
        if arguments[0][0] not in labels:
            labels[arguments[0][0]] = ("_:" + "b" + uuid4().replace("-", ""), "", "")
        return labels[arguments[0][0]]
    # /decision/utility functions 21
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.12 UUID/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.12 UUID/2
    if name == "UUID":
        return (urn(uuid4()), "", "")
    # /decision/utility functions 22
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.13 STRUUID/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.13 STRUUID/2
    if name == "STRUUID":
        return (uuid4(), XSD_STRING, "")
    # /decision/utility functions 41
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.5 RAND/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.5 RAND/2
    # PY-RANDOM /random --- Generate pseudo-random numbers/Real-valued distributions/random()/1 to /random --- Generate pseudo-random numbers/Real-valued distributions/random()/1
    if name == "RAND":
        return (double_canonical_map(random.random()), XSD_DOUBLE, "")
    # /decision/utility functions 42
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.1 now/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.1 now/2
    if name == "NOW":
        return (now, XSD_DATE_TIME, "")
    if any(argument is None for argument in arguments):
        return None
    # /decision/utility functions 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/2
    if name == "RDFTERM-EQUAL":
        return _boolean_or_none(_rdf_term_equal(arguments[0], arguments[1]))
    # /decision/utility functions 7
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.8 sameTerm/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.8 sameTerm/2
    if name == "SAMETERM":
        return _boolean(_same(arguments[0], arguments[1]))
    term = arguments[0] if arguments else None
    # /decision/utility functions 10
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.1 isIRI/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.1 isIRI/3
    if name in ("ISIRI", "ISURI"):
        return _boolean(_is_iri(term))
    # /decision/utility functions 11
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.2 isBlank/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.2 isBlank/2
    if name == "ISBLANK":
        return _boolean(_is_blank(term))
    # /decision/utility functions 12
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.3 isLiteral/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.3 isLiteral/2
    if name == "ISLITERAL":
        return _boolean(_is_literal(term))
    # /decision/utility functions 13
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.4 isNumeric/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.4 isNumeric/2
    if name == "ISNUMERIC":
        return _boolean(_numeric(term) is not None)
    # /decision/utility functions 14
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.5 str/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.5 str/3
    if name == "STR":
        if _is_blank(term):
            return None
        return (term[0], XSD_STRING, "")
    # /decision/utility functions 15
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.6 lang/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.6 lang/2
    if name == "LANG":
        if not _is_literal(term):
            return None
        return (term[2], XSD_STRING, "")
    # /decision/utility functions 16
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.7 datatype/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.7 datatype/2
    if name == "DATATYPE":
        if not _is_literal(term):
            return None
        return (term[1], "", "")
    # /decision/utility functions 17
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.8 IRI/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.8 IRI/7
    if name in ("IRI", "URI"):
        if _is_iri(term):
            return term
        if term[1] == XSD_STRING:
            return (term[0], "", "")
        return None
    # /decision/utility functions 19
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.10 STRDT/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.10 STRDT/2
    if name == "STRDT":
        if term[1] != XSD_STRING or not _is_iri(arguments[1]):
            return None
        return (term[0], arguments[1][0], "")
    # /decision/utility functions 20
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.11 STRLANG/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.2 Functions on RDF Terms/17.4.2.11 STRLANG/2
    if name == "STRLANG":
        if term[1] != XSD_STRING or arguments[1][1] != XSD_STRING or arguments[1][0] == "":
            return None
        return (term[0], RDF_LANG_STRING, arguments[1][0])
    # /decision/utility functions 37
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.1 abs/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.1 abs/2
    # /decision/utility functions 38
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.2 round/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.2 round/2
    # /decision/utility functions 39
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.3 ceil/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.3 ceil/2
    # /decision/utility functions 40
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.4 floor/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.4 Functions on Numerics/17.4.4.4 floor/2
    if name in ("ABS", "ROUND", "CEIL", "FLOOR"):
        value = _numeric(term)
        if value is None:
            return None
        kind, number = value
        if name == "ABS":
            return _number_term(kind, abs(number))
        return _number_term(kind, _round(kind, number, name.lower()))
    # /decision/utility functions 43
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 44
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.3 month/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.3 month/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 45
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.4 day/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.4 day/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 46
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.5 hours/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.5 hours/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 47
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.6 minutes/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.6 minutes/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 48
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.7 seconds/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.7 seconds/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 49
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.8 timezone/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.8 timezone/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    # /decision/utility functions 50
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.9 tz/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.9 tz/2
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    if name in ("YEAR", "MONTH", "DAY", "HOURS", "MINUTES", "SECONDS", "TIMEZONE", "TZ"):
        match = DATE_TIME.fullmatch(term[0]) if term[1] == XSD_DATE_TIME else None
        if match is None:
            return None
        # /decision/utility functions 48
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.7 seconds/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.7 seconds/2
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
        if name == "SECONDS":
            return (decimal_canonical_map(decimal.Decimal(match.group(6))), XSD_DECIMAL, "")
        zone = match.group(7)
        # /decision/utility functions 49
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.8 timezone/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.8 timezone/2
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
        if name == "TIMEZONE":
            if zone is None:
                return None
            if zone == "Z":
                return ("PT0S", XSD_DAY_TIME_DURATION, "")
            seconds = (1 if zone[0] == "+" else -1) * (int(zone[1:3]) * 3600 + int(zone[4:6]) * 60)
            return (day_time_duration_canonical_map(decimal.Decimal(seconds)), XSD_DAY_TIME_DURATION, "")
        # /decision/utility functions 50
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.9 tz/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.9 tz/2
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
        if name == "TZ":
            return (zone or "", XSD_STRING, "")
        # /decision/utility functions 43
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.5 Functions on Dates and Times/17.4.5.2 year/2
        # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
        group = {"YEAR": 1, "MONTH": 2, "DAY": 3, "HOURS": 4, "MINUTES": 5}[name]
        return (canonical_integer(int(match.group(group))), XSD_INTEGER, "")
    # /decision/utility functions 51
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.1 MD5/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.1 MD5/3
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/1 to /hashlib --- Secure hashes and message digests/Hash algorithms/1
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/3 to /hashlib --- Secure hashes and message digests/Hash algorithms/3
    # /decision/utility functions 52
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.2 SHA1/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.2 SHA1/3
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/1 to /hashlib --- Secure hashes and message digests/Hash algorithms/1
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/3 to /hashlib --- Secure hashes and message digests/Hash algorithms/3
    # /decision/utility functions 53
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.3 SHA256/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.3 SHA256/3
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/1 to /hashlib --- Secure hashes and message digests/Hash algorithms/1
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/3 to /hashlib --- Secure hashes and message digests/Hash algorithms/3
    # /decision/utility functions 54
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.4 SHA384/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.4 SHA384/3
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/1 to /hashlib --- Secure hashes and message digests/Hash algorithms/1
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/3 to /hashlib --- Secure hashes and message digests/Hash algorithms/3
    # /decision/utility functions 55
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.5 SHA512/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.6 Hash Functions/17.4.6.5 SHA512/3
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/1 to /hashlib --- Secure hashes and message digests/Hash algorithms/1
    # PY-HASHLIB /hashlib --- Secure hashes and message digests/Hash algorithms/3 to /hashlib --- Secure hashes and message digests/Hash algorithms/3
    if name in ("MD5", "SHA1", "SHA256", "SHA384", "SHA512"):
        if term[1] != XSD_STRING:
            return None
        return (hashlib.new(name.lower(), term[0].encode("utf-8")).hexdigest(), XSD_STRING, "")
    # /decision/utility functions 56
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.1 String arguments/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.1 String arguments/2
    if not all(_is_string(argument) for argument in arguments[:1]):
        return None
    # /decision/utility functions 23
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.2 STRLEN/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.2 STRLEN/2
    if name == "STRLEN":
        return (canonical_integer(len(term[0])), XSD_INTEGER, "")
    # /decision/utility functions 24
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.3 SUBSTR/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.3 SUBSTR/3
    if name == "SUBSTR":
        start = _numeric(arguments[1])
        length = _numeric(arguments[2]) if len(arguments) > 2 else None
        if start is None or (len(arguments) > 2 and length is None):
            return None
        first = _round(start[0], start[1], "round")
        last = math.inf if length is None else first + _round(length[0], length[1], "round")
        text = "".join(character for place, character in enumerate(term[0], 1) if first <= place < last)
        return _string(text, term)
    # /decision/utility functions 25
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.4 UCASE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.4 UCASE/2
    if name == "UCASE":
        return _string(term[0].upper(), term)
    # /decision/utility functions 26
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.5 LCASE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.5 LCASE/2
    if name == "LCASE":
        return _string(term[0].lower(), term)
    # /decision/utility functions 32
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.11 ENCODE_FOR_URI/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.11 ENCODE_FOR_URI/2
    # FUNCOP /7 Functions on Strings/7.4 Functions on String Values/7.4.10 fn:encode-for-uri/2 to /7 Functions on Strings/7.4 Functions on String Values/7.4.10 fn:encode-for-uri/6
    # RFC3986 /2. Characters/2.5. Identifying Data/6 to /2. Characters/2.5. Identifying Data/6
    if name == "ENCODE_FOR_URI":
        return (percent_encode(term[0].encode("utf-8")), XSD_STRING, "")
    # /decision/utility functions 33
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.12 CONCAT/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.12 CONCAT/2
    if name == "CONCAT":
        if not all(_is_string(argument) for argument in arguments):
            return None
        text = "".join(argument[0] for argument in arguments)
        tags = {argument[2].lower() if argument[1] == RDF_LANG_STRING else None for argument in arguments}
        if len(tags) == 1 and None not in tags and arguments:
            return (text, RDF_LANG_STRING, arguments[0][2])
        return (text, XSD_STRING, "")
    # /decision/utility functions 34
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.13 langMatches/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.13 langMatches/2
    # RFC4647 /3. Types of Matching/3.3. Filtering/3.3.1. Basic Filtering/1 to /3. Types of Matching/3.3. Filtering/3.3.1. Basic Filtering/2
    if name == "LANGMATCHES":
        tag, wanted = term[0].lower(), arguments[1][0].lower()
        if wanted == "*":
            return _boolean(tag != "")
        return _boolean(tag == wanted or tag.startswith(wanted + "-"))
    # /decision/utility functions 35
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.14 REGEX/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.14 REGEX/3
    # FUNCOP /7 Functions on Strings/7.6 String Functions that Use Pattern Matching/7.6.2 fn:matches/1 to /7 Functions on Strings/7.6 String Functions that Use Pattern Matching/7.6.2 fn:matches/12
    # PY-RE /re --- Regular expression operations/Module Contents/Functions/search(pattern, string, flags=0)/1 to /re --- Regular expression operations/Module Contents/Functions/search(pattern, string, flags=0)/1
    # PY-RE /re --- Regular expression operations/Module Contents/Flags/I, IGNORECASE/1 to /re --- Regular expression operations/Module Contents/Flags/I, IGNORECASE/1
    if name == "REGEX":
        flags = arguments[2][0] if len(arguments) > 2 else ""
        pattern = re.escape(arguments[1][0]) if "q" in flags else arguments[1][0]
        try:
            return _boolean(re.search(pattern, term[0], _flags(flags)) is not None)
        except re.error:
            return None
    # /decision/utility functions 36
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.15 REPLACE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.15 REPLACE/3
    if name == "REPLACE":
        flags = arguments[3][0] if len(arguments) > 3 else ""
        pattern = re.escape(arguments[1][0]) if "q" in flags else arguments[1][0]
        try:
            replacement = arguments[2][0] if "q" in flags else _replacement(arguments[2][0])
            text = re.sub(pattern, replacement.replace("\\", "\\\\") if "q" in flags else replacement, term[0], flags=_flags(flags))
        except (re.error, AttributeError):
            return None
        return _string(text, term)
    # /decision/utility functions 27
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.6 STRSTARTS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.6 STRSTARTS/2
    # /decision/utility functions 28
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.7 STRENDS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.7 STRENDS/2
    # /decision/utility functions 29
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
    # /decision/utility functions 30
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.9 STRBEFORE/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.9 STRBEFORE/2
    # /decision/utility functions 31
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.10 STRAFTER/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.10 STRAFTER/2
    # /decision/utility functions 57
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.2 Argument Compatibility Rules/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.1 Strings in SPARQL Functions/17.4.3.1.2 Argument Compatibility Rules/5
    if name in ("STRSTARTS", "STRENDS", "CONTAINS", "STRBEFORE", "STRAFTER"):
        first, second = arguments
        if not _compatible(first, second):
            return None
        if name == "STRSTARTS":
            return _boolean(first[0].startswith(second[0]))
        if name == "STRENDS":
            return _boolean(first[0].endswith(second[0]))
        if name == "CONTAINS":
            return _boolean(second[0] in first[0])
        place = first[0].find(second[0])
        if place < 0:
            return ("", XSD_STRING, "")
        if name == "STRBEFORE":
            return _string(first[0][:place], first)
        return _string(first[0][place + len(second[0]):], first)
    return None


def casts(datatype, argument):
    if argument is None:
        return None
    # /decision/utility casts 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    numeric = _numeric(argument)
    boolean = boolean_lexical_map(argument[0]) if argument[1] == XSD_BOOLEAN else None
    string = argument[0] if argument[1] == XSD_STRING else None
    # /decision/utility casts 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    if datatype == XSD_STRING:
        if _is_blank(argument):
            return None
        return (argument[0], XSD_STRING, "")
    # /decision/utility casts 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    # /decision/utility casts 3
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    if datatype in (XSD_FLOAT, XSD_DOUBLE):
        if numeric is not None:
            value = float(numeric[1])
        elif boolean is not None:
            value = 1.0 if boolean else 0.0
        elif string is not None:
            value = float_lexical_map(string) if datatype == XSD_FLOAT else double_lexical_map(string)
        else:
            return None
        if value is None:
            return None
        if datatype == XSD_FLOAT:
            return (float_canonical_map(float_lexical_map(repr(value)) if math.isfinite(value) else value), XSD_FLOAT, "")
        # /decision/utility casts 3
        # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
        return (double_canonical_map(value), XSD_DOUBLE, "")
    # /decision/utility casts 4
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    if datatype == XSD_DECIMAL:
        if numeric is not None:
            if isinstance(numeric[1], float) and not math.isfinite(numeric[1]):
                return None
            value = decimal.Decimal(repr(numeric[1])) if isinstance(numeric[1], float) else decimal.Decimal(numeric[1])
        elif boolean is not None:
            value = decimal.Decimal(1 if boolean else 0)
        elif string is not None:
            value = decimal_lexical_map(string)
            if value is None:
                return None
        else:
            return None
        return (decimal_canonical_map(value), XSD_DECIMAL, "")
    # /decision/utility casts 5
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1 to /3 Built-in Datatypes and Their Definitions/3.4 Other Built-in Datatypes/3.4.13 integer/3.4.13.1 Lexical representation/1
    if datatype == XSD_INTEGER:
        if numeric is not None:
            if isinstance(numeric[1], float) and not math.isfinite(numeric[1]):
                return None
            value = int(numeric[1])
        elif boolean is not None:
            value = 1 if boolean else 0
        elif string is not None and INTEGER_LEXICAL.fullmatch(string):
            value = int(string)
        else:
            return None
        return (canonical_integer(value), XSD_INTEGER, "")
    # /decision/utility casts 6
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    # XSD11-2 /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/2 to /3 Built-in Datatypes and Their Definitions/3.3 Primitive Datatypes/3.3.7 dateTime/3.3.7.2 Lexical Mapping/18
    if datatype == XSD_DATE_TIME:
        if argument[1] == XSD_DATE_TIME or (string is not None and DATE_TIME.fullmatch(string)):
            return (argument[0], XSD_DATE_TIME, "")
        return None
    # /decision/utility casts 7
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.5 XPath Constructor Functions/1 to /17 Expressions and Testing Values/17.5 XPath Constructor Functions/16
    if datatype == XSD_BOOLEAN:
        if numeric is not None:
            number = numeric[1]
            return _boolean(not (number == 0 or (isinstance(number, float) and math.isnan(number))))
        if boolean is not None:
            return _boolean(boolean)
        if string is not None:
            value = boolean_lexical_map(string)
            return None if value is None else (boolean_canonical_map(value), XSD_BOOLEAN, "")
        return None
    return None


def match(rows, terms):
    # /decision/utility match 1
    # SPARQL11-QUERY /5 Graph Patterns/5.1 Basic Graph Patterns/1 to /5 Graph Patterns/5.1 Basic Graph Patterns/2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/5
    terms = {column: term for column, term in (terms or {}).items() if term is not None}
    return [row for row in rows if all(row.get(column, "") == term for column, term in terms.items())]


def _node(row, column):
    if column == "object":
        language = row.get("language tag", "")
        datatype = row.get("datatype IRI", "")
        return (row["object"], RDF_LANG_STRING if language and not datatype else datatype, language)
    return (row[column], "", "")


def _pairs(dataset, expression, nodes):
    operator = expression[0]
    # /decision/utility path 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/15 to /18 Definition of SPARQL/18.4 Property Path Patterns/35
    if operator == "link":
        return [(_node(row, "subject"), _node(row, "object")) for row in dataset if row["predicate"] == expression[1][0]]
    # /decision/utility path 2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/36 to /18 Definition of SPARQL/18.4 Property Path Patterns/38
    if operator == "inv":
        return [(end, start) for start, end in _pairs(dataset, expression[1], nodes)]
    # /decision/utility path 3
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/39 to /18 Definition of SPARQL/18.4 Property Path Patterns/45
    if operator == "seq":
        second = {}
        for start, end in _pairs(dataset, expression[2], nodes):
            second.setdefault(start, []).append(end)
        return [(start, end) for start, middle in _pairs(dataset, expression[1], nodes) for end in second.get(middle, [])]
    # /decision/utility path 4
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/46 to /18 Definition of SPARQL/18.4 Property Path Patterns/50
    if operator == "alt":
        return _pairs(dataset, expression[1], nodes) + _pairs(dataset, expression[2], nodes)
    # /decision/utility path 8
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/119 to /18 Definition of SPARQL/18.4 Property Path Patterns/125
    if operator == "NPS":
        excluded = {iri[0] for iri in expression[1]}
        return [(_node(row, "subject"), _node(row, "object")) for row in dataset if row["predicate"] not in excluded]
    step = {}
    for start, end in _pairs(dataset, expression[1], nodes):
        step.setdefault(start, []).append(end)
    found = []
    for node in nodes:
        # /decision/utility path 5
        # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/51 to /18 Definition of SPARQL/18.4 Property Path Patterns/64
        if operator == "ZeroOrOnePath":
            ends = [node] + [end for end in step.get(node, []) if end != node]
        # /decision/utility path 6
        # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/65 to /18 Definition of SPARQL/18.4 Property Path Patterns/96
        # /decision/utility path 7
        # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/65 to /18 Definition of SPARQL/18.4 Property Path Patterns/118
        else:
            reached = []
            frontier = list(step.get(node, []))
            while frontier:
                end = frontier.pop(0)
                if end not in reached:
                    reached.append(end)
                    frontier.extend(step.get(end, []))
            ends = reached
            if operator == "ZeroOrMorePath":
                ends = [node] + [end for end in reached if end != node]
        found += [(node, end) for end in dict.fromkeys(ends)]
    return found


def path(dataset, start, expression, end):
    # /decision/utility path 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/15 to /18 Definition of SPARQL/18.4 Property Path Patterns/35
    nodes = []
    for row in dataset:
        for node in (_node(row, "subject"), _node(row, "object")):
            if node not in nodes:
                nodes.append(node)
    for fixed in (start, end):
        if not fixed.startswith("?") and (fixed, "", "") not in nodes and all(node[0] != fixed for node in nodes):
            nodes.append((fixed, "", ""))
    if not start.startswith("?"):
        starts = [node for node in nodes if node[0] == start]
        nodes = starts if expression[0] in ("ZeroOrOnePath", "ZeroOrMorePath", "OneOrMorePath") else nodes
    solutions = []
    for first, last in _pairs(dataset, expression, nodes):
        solution = {}
        if start.startswith("?"):
            solution[start[1:]] = first
        elif first[0] != start:
            continue
        if end.startswith("?"):
            if end[1:] in solution and solution[end[1:]] != last:
                continue
            solution[end[1:]] = last
        elif last[0] != end:
            continue
        solutions.append(solution)
    return solutions


def filter(solutions, kept):
    # /decision/utility filter 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Filter/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Filter/4
    return [solution for solution, keep in zip(solutions, kept) if keep]


def _compatible_rows(first, second):
    return all(first[column] == second[column] for column in first.keys() & second.keys())


def join(first, second):
    # /decision/utility join 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Join/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Join/2
    joined = []
    groups = {}
    for row in second:
        groups.setdefault(frozenset(row), []).append(row)
    indexes = {}
    for row in first:
        for columns, rows in groups.items():
            shared = tuple(sorted(columns & row.keys()))
            index = indexes.get((columns, shared))
            if index is None:
                index = {}
                for other in rows:
                    index.setdefault(tuple(other[column] for column in shared), []).append(other)
                indexes[(columns, shared)] = index
            for other in index.get(tuple(row[column] for column in shared), []):
                merged = dict(row)
                merged.update(other)
                joined.append(merged)
    return joined


def left_join(first, joined, kept):
    # /decision/utility left_join 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Diff/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Diff/3
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: LeftJoin/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: LeftJoin/3
    kept_rows = [row for row, keep in zip(joined, kept) if keep]
    out = list(kept_rows)
    for row in first:
        if not any(all(other.get(column) == value for column, value in row.items()) for other in kept_rows):
            out.append(row)
    return out


def union(first, second):
    # /decision/utility union 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Union/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Union/2
    return list(first) + list(second)


def minus(first, second):
    # /decision/utility minus 1
    # SPARQL11-QUERY /8 Negation/8.2 Removing Possible Solutions/1 to /8 Negation/8.2 Removing Possible Solutions/1
    return [
        row for row in first
        if not any(row.keys() & other.keys() and _compatible_rows(row, other) for other in second)
    ]


def extend(solutions, variable, values):
    out = []
    for solution, value in zip(solutions, values):
        # /decision/utility extend 2
        # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/3 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/3
        if value is None:
            out.append(solution)
            continue
        # /decision/utility extend 1
        # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/2
        extended = dict(solution)
        extended[variable] = value
        out.append(extended)
    return out


def _term_order(first, second):
    # /decision/utility order 4
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/20 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/44
    def rank(term):
        if term is None or term == "":
            return 0
        if _is_blank(term):
            return 1
        if _is_iri(term):
            return 2
        return 3

    a, b = rank(first), rank(second)
    if a != b:
        return -1 if a < b else 1
    if a == 0:
        return 0
    if a == 3:
        if operators("<", [first, second]) == TRUE:
            return -1
        if operators("<", [second, first]) == TRUE:
            return 1
    left, right = (first[0], first[1], first[2]), (second[0], second[1], second[2])
    return -1 if left < right else (1 if left > right else 0)


def _column_order(kind, first, second):
    # /decision/utility order 2
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/20 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/22
    if first in (None, "") or second in (None, ""):
        a, b = first in (None, ""), second in (None, "")
        return 0 if a == b else (-1 if a else 1)
    if kind == "integer":
        a, b = int(first), int(second)
    elif kind == "time":
        a, b = date_time_seconds(first), date_time_seconds(second)
        if a is None or b is None:
            a, b = str(first), str(second)
    else:
        a, b = str(first), str(second)
    return -1 if a < b else (1 if a > b else 0)


def order(rows, domains, key, comparators):
    types = dict(domains or [])

    def compare(first, second):
        # /decision/utility order 1
        # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/1 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/2
        # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/43 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/44
        for column, direction in comparators or []:
            if domains:
                # /decision/utility order 2
                # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/20 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/22
                result = _column_order(types.get(column, "string"), first.get(column), second.get(column))
            else:
                # /decision/utility order 4
                # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/20 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/44
                result = _term_order(first.get(column), second.get(column))
            if result:
                return -result if direction == DESC else result
        # /decision/utility order 3
        # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.4 OFFSET/2 to /15 Solution Sequences and Modifiers/15.4 OFFSET/2
        # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/8
        # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/44 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/44
        for column in key or []:
            result = _column_order(types.get(column, "string"), first.get(column), second.get(column))
            if result:
                return result
        return 0

    return sorted(rows, key=functools.cmp_to_key(compare))


def _present(value):
    return value is not None and value != ""


def aggregate(rows, domains, columns, set_functions):
    # /decision/utility aggregate 1
    # SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/1 to /11 Aggregates/11.2 GROUP BY/2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
    groups = {}
    for row in rows:
        groups.setdefault(tuple(row.get(column) for column in columns), []).append(row)
    if not columns and not groups:
        groups[()] = []
    out = []
    for key, group in groups.items():
        result = {column: value for column, value in zip(columns, key) if value is not None}
        for function in set_functions:
            column = function["column"]
            # /decision/utility aggregate 2
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/11 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/27
            if column == "*":
                values = [tuple(sorted(row.items())) for row in group]
            else:
                values = [row[column] for row in group if _present(row.get(column))]
            if function.get("distinct"):
                values = list(dict.fromkeys(values))
            name = function["name"]
            value = ""
            # /decision/utility aggregate 4
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/6
            if name == "Count":
                value = len(values)
            # /decision/utility aggregate 5
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.3 Sum/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.3 Sum/7
            elif name == "Sum":
                value = ("0", XSD_INTEGER, "")
                for item in values:
                    value = operators("+", [value, item]) if value is not None else None
                value = "" if value is None else value
            # /decision/utility aggregate 6
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.4 Avg/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.4 Avg/6
            elif name == "Avg":
                if not values:
                    value = ("0", XSD_INTEGER, "")
                else:
                    total = ("0", XSD_INTEGER, "")
                    for item in values:
                        total = operators("+", [total, item]) if total is not None else None
                    value = operators("/", [total, (canonical_integer(len(values)), XSD_INTEGER, "")]) if total is not None else None
                    value = "" if value is None else value
            # /decision/utility aggregate 7
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.5 Min/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.5 Min/8
            # /decision/utility aggregate 8
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/8
            elif name == "Min":
                # /decision/utility aggregate 7
                # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.5 Min/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.5 Min/8
                ranked = order([{column: item} for item in values], domains, None, [(column, ASC)])
                value = ranked[0][column] if ranked else ""
            elif name == "Max":
                # /decision/utility aggregate 8
                # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/8
                ranked = order([{column: item} for item in values], domains, None, [(column, DESC)])
                value = ranked[0][column] if ranked else ""
            # /decision/utility aggregate 9
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.7 GroupConcat/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.7 GroupConcat/10
            elif name == "GroupConcat":
                separator = function.get("separator", " ")
                if values and all(isinstance(item, tuple) for item in values):
                    value = (separator.join(item[0] for item in values), XSD_STRING, "")
                elif not values and column != "*" and any(isinstance(row.get(column), tuple) for row in group):
                    value = ("", XSD_STRING, "")
                else:
                    value = separator.join(str(item) for item in values)
            # /decision/utility aggregate 10
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.8 Sample/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.8 Sample/6
            elif name == "Sample":
                value = values[0] if values else ""
            # /decision/utility aggregate 3
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Extend/5
            # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/28 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/31
            result[function["result"]] = value
        out.append(result)
    return out


def project(rows, columns):
    # /decision/utility project 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Project/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Project/5
    return [{column: row[column] for column in columns if column in row} for row in rows]


def distinct(rows):
    # /decision/utility distinct 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Distinct/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Distinct/4
    seen = set()
    out = []
    for row in rows:
        key = tuple(sorted(row.items()))
        if key not in seen:
            seen.add(key)
            out.append(row)
    return out


def reduced(rows):
    # /decision/utility reduced 1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Reduced/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/Definition: Reduced/4
    return list(rows)


def slice(rows, offset, size):
    # /decision/utility slice 1
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.4 OFFSET/1 to /15 Solution Sequences and Modifiers/15.4 OFFSET/1
    rows = rows[offset:]
    # /decision/utility slice 2
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.5 LIMIT/1 to /15 Solution Sequences and Modifiers/15.5 LIMIT/1
    return rows[:size]


def _substitute(pattern, solution):
    # /decision/utility eval 6
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/17 to /18 Definition of SPARQL/18.6 Evaluation Semantics/19
    if isinstance(pattern, str) and pattern.startswith("?") and pattern[1:] in solution:
        return solution[pattern[1:]]
    if isinstance(pattern, list):
        return [_substitute(part, solution) for part in pattern]
    return pattern


def _pattern_terms(pattern):
    terms = {}
    variables = {}
    for column, part in zip(("subject", "predicate", "object"), pattern):
        if isinstance(part, str):
            variables.setdefault(part[1:], []).append(column)
        elif column == "object":
            terms["object"] = part[0]
            terms["datatype IRI"] = "" if part[1] == RDF_LANG_STRING else part[1]
            terms["language tag"] = part[2]
        else:
            terms[column] = part[0]
    return terms, variables


class _Context:
    def __init__(self, named, now):
        self.named = named
        self.now = now


def _value(expression, solution, context, active, labels):
    # /decision/utility eval 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/1 to /17 Expressions and Testing Values/17.2 Filter Evaluation/19
    if isinstance(expression, str):
        return solution.get(expression[1:])
    if isinstance(expression, tuple):
        return expression
    head = expression[0]
    if head == "BOUND":
        return functions(head, [solution.get(expression[1][1:])], now=context.now, labels=labels)
    # /decision/utility eval 7
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/20 to /18 Definition of SPARQL/18.6 Evaluation Semantics/22
    if head == "exists":
        return _boolean(bool(_evaluate(_substitute(expression[1], solution), context, active)))
    if head == "Aggregation":
        return None
    # /decision/utility eval 2
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.2 Filter Evaluation/1 to /17 Expressions and Testing Values/17.2 Filter Evaluation/19
    values = [_value(argument, solution, context, active, labels) for argument in expression[1:]]
    if head in BUILT_INS or head in ("IN", "NOT IN"):
        return functions(head, values, now=context.now, labels=labels)
    if ":" in head:
        if len(values) == 1:
            return casts(head, values[0])
        return None
    return operators(head, values)


def _arguments(aggregation):
    # /decision/utility eval 14
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/42 to /18 Definition of SPARQL/18.6 Evaluation Semantics/43
    expressions = aggregation[1]
    return expressions[1] if expressions[0] == "Distinct" else expressions


def _truth(expression, solution, context, active):
    return ebv(_value(expression, solution, context, active, {})) is True


def _evaluate(algebra, context, active):
    # /decision/utility eval 18
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/59 to /18 Definition of SPARQL/18.6 Evaluation Semantics/60
    if not algebra or isinstance(algebra[0], dict):
        return [dict(solution) for solution in algebra]
    head = algebra[0]
    if head == "Z":
        return [{}]
    # /decision/utility eval 3
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/8 to /18 Definition of SPARQL/18.6 Evaluation Semantics/10
    if head == "BGP":
        solutions = [{}]
        for pattern in algebra[1]:
            terms, variables = _pattern_terms(pattern)
            found = []
            for row in match(active, terms):
                solution = {}
                consistent = True
                for name, columns in variables.items():
                    values = [_node(row, column) for column in columns]
                    if any(value != values[0] for value in values):
                        consistent = False
                    solution[name] = values[0]
                if consistent:
                    found.append(solution)
            solutions = join(solutions, found)
        return solutions
    # /decision/utility eval 4
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/11 to /18 Definition of SPARQL/18.6 Evaluation Semantics/13
    if head == "Path":
        start = algebra[1] if isinstance(algebra[1], str) else algebra[1][0]
        end = algebra[3] if isinstance(algebra[3], str) else algebra[3][0]
        return path(active, start, algebra[2], end)
    # /decision/utility eval 5
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/14 to /18 Definition of SPARQL/18.6 Evaluation Semantics/16
    if head == "Filter":
        solutions = _evaluate(algebra[2], context, active)
        kept = [_truth(algebra[1], solution, context, active) for solution in solutions]
        return filter(solutions, kept)
    # /decision/utility eval 8
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/23 to /18 Definition of SPARQL/18.6 Evaluation Semantics/24
    if head == "Join":
        return join(_evaluate(algebra[1], context, active), _evaluate(algebra[2], context, active))
    # /decision/utility eval 9
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/25 to /18 Definition of SPARQL/18.6 Evaluation Semantics/26
    if head == "LeftJoin":
        first = _evaluate(algebra[1], context, active)
        joined = join(first, _evaluate(algebra[2], context, active))
        kept = [_truth(algebra[3], solution, context, active) for solution in joined]
        return left_join(first, joined, kept)
    # /decision/utility eval 10
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/27 to /18 Definition of SPARQL/18.6 Evaluation Semantics/28
    if head == "Union":
        return union(_evaluate(algebra[1], context, active), _evaluate(algebra[2], context, active))
    # /decision/utility eval 11
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/27 to /18 Definition of SPARQL/18.6 Evaluation Semantics/28
    if head == "Minus":
        return minus(_evaluate(algebra[1], context, active), _evaluate(algebra[2], context, active))
    # /decision/utility eval 12
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/29 to /18 Definition of SPARQL/18.6 Evaluation Semantics/39
    if head == "Graph":
        name = algebra[1]
        if isinstance(name, tuple):
            if name[0] not in context.named:
                return []
            return _evaluate(algebra[2], context, context.named[name[0]])
        solutions = []
        for graph_name, rows in context.named.items():
            found = _evaluate(algebra[2], context, rows)
            solutions = union(solutions, join(found, [{name[1:]: (graph_name, "", "")}]))
        return solutions
    # /decision/utility eval 16
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/47 to /18 Definition of SPARQL/18.6 Evaluation Semantics/48
    if head == "Extend":
        solutions = _evaluate(algebra[1], context, active)
        values = [_value(algebra[3], solution, context, active, {}) for solution in solutions]
        return extend(solutions, algebra[2], values)
    # /decision/utility eval 17
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/49 to /18 Definition of SPARQL/18.6 Evaluation Semantics/50
    if head == "ToList":
        return list(_evaluate(algebra[1], context, active))
    # /decision/utility eval 18
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/59 to /18 Definition of SPARQL/18.6 Evaluation Semantics/60
    if head == "ToMultiSet":
        return list(_evaluate(algebra[1], context, active))
    # /decision/utility eval 13
    # SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/2 to /11 Aggregates/11.2 GROUP BY/2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/40 to /18 Definition of SPARQL/18.6 Evaluation Semantics/41
    # /decision/utility eval 14
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/42 to /18 Definition of SPARQL/18.6 Evaluation Semantics/43
    # /decision/utility eval 15
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/44 to /18 Definition of SPARQL/18.6 Evaluation Semantics/46
    if head == "AggregateJoin":
        aggregations = algebra[1:]
        group = aggregations[0][4]
        keys = group[1]
        solutions = _evaluate(group[2], context, active)
        rows = []
        for solution in solutions:
            row = dict(solution)
            for place, key in enumerate(keys):
                value = _value(key, solution, context, active, {})
                if value is not None:
                    row["\x00g" + str(place)] = value
            # /decision/utility eval 14
            # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/42 to /18 Definition of SPARQL/18.6 Evaluation Semantics/43
            for place, aggregation in enumerate(aggregations):
                argument = _arguments(aggregation)[0]
                if argument != "*":
                    item = _value(argument, solution, context, active, {})
                    if item is not None:
                        row["\x00a" + str(place)] = item
            rows.append(row)
        set_functions = []
        for place, aggregation in enumerate(aggregations):
            function = {
                "name": aggregation[2],
                "column": "*" if _arguments(aggregation)[0] == "*" else "\x00a" + str(place),
                "distinct": aggregation[1][0] == "Distinct",
                "result": AGG + str(place + 1),
            }
            if "separator" in aggregation[3]:
                function["separator"] = aggregation[3]["separator"]
            set_functions.append(function)
        # /decision/utility eval 13
        # SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/2 to /11 Aggregates/11.2 GROUP BY/2
        # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/2
        # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/40 to /18 Definition of SPARQL/18.6 Evaluation Semantics/41
        columns = [] if keys == [("1", XSD_INTEGER, "")] else ["\x00g" + str(place) for place in range(len(keys))]
        groups = aggregate(rows, None, columns, set_functions)
        # /decision/utility eval 15
        # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/44 to /18 Definition of SPARQL/18.6 Evaluation Semantics/46
        out = []
        for found in groups:
            solution = {}
            for function in set_functions:
                value = found.get(function["result"], "")
                if isinstance(value, int):
                    value = (canonical_integer(value), XSD_INTEGER, "")
                if value != "":
                    solution[function["result"]] = value
            out.append(solution)
        return out
    # /decision/utility eval 19
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/57 to /18 Definition of SPARQL/18.6 Evaluation Semantics/58
    if head == "OrderBy":
        solutions = _evaluate(algebra[1], context, active)
        rows = []
        for solution in solutions:
            row = dict(solution)
            for place, (direction, expression) in enumerate(algebra[2]):
                value = _value(expression, solution, context, active, {})
                if value is not None:
                    row["\x00o" + str(place)] = value
            rows.append(row)
        comparators = [["\x00o" + str(place), direction] for place, (direction, expression) in enumerate(algebra[2])]
        return [{name: value for name, value in row.items() if not name.startswith("\x00o")} for row in order(rows, None, None, comparators)]
    # /decision/utility eval 20
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/55 to /18 Definition of SPARQL/18.6 Evaluation Semantics/56
    if head == "Project":
        return project(_evaluate(algebra[1], context, active), algebra[2])
    # /decision/utility eval 21
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/51 to /18 Definition of SPARQL/18.6 Evaluation Semantics/52
    if head == "Distinct":
        return distinct(_evaluate(algebra[1], context, active))
    # /decision/utility eval 22
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/53 to /18 Definition of SPARQL/18.6 Evaluation Semantics/54
    if head == "Reduced":
        return reduced(_evaluate(algebra[1], context, active))
    # /decision/utility eval 23
    # SPARQL11-QUERY /18 Definition of SPARQL/18.6 Evaluation Semantics/61 to /18 Definition of SPARQL/18.6 Evaluation Semantics/62
    if head == "Slice":
        rows = _evaluate(algebra[1], context, active)
        return slice(rows, algebra[2], len(rows) if algebra[3] is None else algebra[3])
    return []


def _graph(rows):
    seen = set()
    out = []
    for row in rows:
        triple = {column: row.get(column, "") for column in ("subject", "predicate", "object", "datatype IRI", "language tag")}
        key = tuple(triple.values())
        if key not in seen:
            seen.add(key)
            out.append(triple)
    return out


def eval(query, dataset, now):
    # /decision/utility eval 1
    # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/5
    # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/13.2.1 Specifying the Default Graph/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/13.2.1 Specifying the Default Graph/14
    # RDF11-CONCEPTS /3. RDF Graphs/1 to /3. RDF Graphs/1
    by_name = {}
    for row in dataset:
        by_name.setdefault(row["graph name"], []).append(row)
    default_names, named_names = query[1]
    if default_names or named_names:
        default = _graph([row for name in default_names for row in by_name.get(name, [])])
        named = {name: _graph(by_name.get(name, [])) for name in named_names if name in by_name}
    else:
        default = _graph(dataset)
        named = {name: _graph(rows) for name, rows in by_name.items()}
    return _evaluate(query[0], _Context(named, now), default)


def construct(template, solutions):
    triples = []
    seen = set()
    for place, solution in enumerate(solutions):
        # /decision/utility construct 2
        # SPARQL11-QUERY /16 Query Forms/16.2 CONSTRUCT/16.2.1 Templates with Blank Nodes/1 to /16 Query Forms/16.2 CONSTRUCT/16.2.1 Templates with Blank Nodes/30
        fresh = {}
        for pattern in template:
            parts = []
            for part in pattern:
                # /decision/utility construct 1
                # SPARQL11-QUERY /16 Query Forms/16.2 CONSTRUCT/1 to /16 Query Forms/16.2 CONSTRUCT/14
                if isinstance(part, str):
                    part = solution.get(part[1:])
                elif _is_blank(part):
                    part = fresh.setdefault(part[0], (part[0] + "_" + str(place), "", ""))
                parts.append(part)
            subject, predicate, object = parts
            # /decision/utility construct 3
            # SPARQL11-QUERY /16 Query Forms/16.2 CONSTRUCT/1 to /16 Query Forms/16.2 CONSTRUCT/14
            if subject is None or predicate is None or object is None or _is_literal(subject) or not _is_iri(predicate):
                continue
            triple = {
                "subject": subject[0],
                "predicate": predicate[0],
                "object": object[0],
                "datatype IRI": object[1],
                "language tag": object[2],
            }
            key = tuple(triple.values())
            if key not in seen:
                seen.add(key)
                triples.append(triple)
    return triples


def ask(solutions):
    # /decision/utility ask 1
    # SPARQL11-QUERY /16 Query Forms/16.3 ASK/1 to /16 Query Forms/16.3 ASK/22
    return [{"boolean": bool(solutions)}]


def describe(dataset, resources):
    # /decision/utility describe 1
    # SPARQL11-QUERY /16 Query Forms/16.4 DESCRIBE (Informative)/1 to /16 Query Forms/16.4 DESCRIBE (Informative)/1
    # SPARQL11-QUERY /16 Query Forms/16.4 DESCRIBE (Informative)/16.4.3 Descriptions of Resources/1 to /16 Query Forms/16.4 DESCRIBE (Informative)/16.4.3 Descriptions of Resources/21
    triples = []
    for resource in resources:
        triples = union(triples, union(
            match(dataset, {"subject": resource}),
            match(dataset, {"object": resource, "datatype IRI": "", "language tag": ""}),
        ))
    return triples
