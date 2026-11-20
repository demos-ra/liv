import re

from .mtsv import sheet
from .turtle import (
    ANON,
    BLANK_NODE_LABEL,
    DECIMAL,
    DOUBLE,
    INTEGER,
    IRI,
    IRIREF,
    LANGTAG,
    LINE_BREAK,
    NO_NAMESPACE,
    NOT_AN_ABSOLUTE_IRI,
    PN_CHARS,
    PN_CHARS_U,
    PN_LOCAL_ESC,
    PNAME_LN,
    PNAME_NS,
    RDF_FIRST,
    RDF_LANG_STRING,
    RDF_NIL,
    RDF_REST,
    RDF_TYPE,
    XSD_BOOLEAN,
    XSD_DECIMAL,
    XSD_DOUBLE,
    SCHEME,
    XSD_STRING,
)
from .types import XSD_INTEGER, string_literal_quote, transform_references, unescape

# /interface/sparql parse 1
# SPARQL11-QUERY /19 SPARQL Grammar/19.1 SPARQL Request String/1 to /19 SPARQL Grammar/19.1 SPARQL Request String/4
# SPARQL11-QUERY /19 SPARQL Grammar/19.3 White Space/1 to /19 SPARQL Grammar/19.3 White Space/4
# SPARQL11-QUERY /19 SPARQL Grammar/19.4 Comments/1 to /19 SPARQL Grammar/19.4 Comments/1
# SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
ECHAR = "\\\\[tbnrf\"'\\\\]"
VARNAME = "[" + PN_CHARS_U + "0-9][" + PN_CHARS_U + "0-9·̀-ͯ‿-⁀]*"
VAR1 = "\\?" + VARNAME
VAR2 = "\\$" + VARNAME
STRING_LITERAL1 = "'(?:[^\\x27\\x5C\\x0A\\x0D]|" + ECHAR + ")*'"
STRING_LITERAL2 = "\"(?:[^\\x22\\x5C\\x0A\\x0D]|" + ECHAR + ")*\""
STRING_LITERAL_LONG1 = "'''(?:(?:'|'')?(?:[^'\\\\]|" + ECHAR + "))*'''"
STRING_LITERAL_LONG2 = "\"\"\"(?:(?:\"|\"\")?(?:[^\"\\\\]|" + ECHAR + "))*\"\"\""
WS = "[\\x20\\x09\\x0D\\x0A]"
COMMENT = "#[^\\x0D\\x0A]*"
NIL = "\\((?:" + WS + "|" + COMMENT + ")*\\)"
SKIP = re.compile("(?:" + WS + "|" + COMMENT + ")*")
TERMINALS = [
    ("IRIREF", re.compile(IRIREF)),
    ("PNAME_LN", re.compile(PNAME_LN)),
    ("PNAME_NS", re.compile(PNAME_NS)),
    ("BLANK_NODE_LABEL", re.compile(BLANK_NODE_LABEL)),
    ("VAR", re.compile(VAR1 + "|" + VAR2)),
    ("LANGTAG", re.compile(LANGTAG)),
    ("DOUBLE", re.compile(DOUBLE.replace("[+-]?", ""))),
    ("DECIMAL", re.compile(DECIMAL.replace("[+-]?", ""))),
    ("INTEGER", re.compile(INTEGER.replace("[+-]?", ""))),
    ("STRING_LITERAL_LONG2", re.compile(STRING_LITERAL_LONG2)),
    ("STRING_LITERAL_LONG1", re.compile(STRING_LITERAL_LONG1)),
    ("STRING_LITERAL2", re.compile(STRING_LITERAL2)),
    ("STRING_LITERAL1", re.compile(STRING_LITERAL1)),
    ("NIL", re.compile(NIL)),
    ("ANON", re.compile(ANON)),
    ("NAME", re.compile("[A-Za-z_][A-Za-z0-9_]*")),
    ("PUNCT", re.compile("\\^\\^|&&|\\|\\||!=|<=|>=|[{}()\\[\\].;,|/^*+?!=<>\\-]")),
]
STRINGS = {"STRING_LITERAL1": 1, "STRING_LITERAL2": 1, "STRING_LITERAL_LONG1": 3, "STRING_LITERAL_LONG2": 3}
BUILT_INS = {
    "STR", "LANG", "LANGMATCHES", "DATATYPE", "BOUND", "IRI", "URI", "BNODE", "RAND", "ABS", "CEIL", "FLOOR",
    "ROUND", "CONCAT", "SUBSTR", "STRLEN", "REPLACE", "UCASE", "LCASE", "ENCODE_FOR_URI", "CONTAINS", "STRSTARTS",
    "STRENDS", "STRBEFORE", "STRAFTER", "YEAR", "MONTH", "DAY", "HOURS", "MINUTES", "SECONDS", "TIMEZONE", "TZ",
    "NOW", "UUID", "STRUUID", "MD5", "SHA1", "SHA256", "SHA384", "SHA512", "COALESCE", "IF", "STRLANG", "STRDT",
    "SAMETERM", "ISIRI", "ISURI", "ISBLANK", "ISLITERAL", "ISNUMERIC", "REGEX",
}
AGGREGATES = {"COUNT", "SUM", "MIN", "MAX", "AVG", "SAMPLE", "GROUP_CONCAT"}
SET_FUNCTIONS = {"COUNT": "Count", "SUM": "Sum", "MIN": "Min", "MAX": "Max", "AVG": "Avg", "SAMPLE": "Sample", "GROUP_CONCAT": "GroupConcat"}
FORMS = ("SELECT", "CONSTRUCT", "DESCRIBE", "ASK")
# /interface/sparql parse 2
# SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
NOT_SPARQL = "not SPARQL"
# /interface/sparql parse 3
# SPARQL11-QUERY /19 SPARQL Grammar/19.2 Codepoint Escape Sequences/1 to /19 SPARQL Grammar/19.2 Codepoint Escape Sequences/12
CODEPOINT_ESCAPE = re.compile("\\\\u([0-9A-Fa-f]{4})|\\\\U([0-9A-Fa-f]{8})")
# /interface/sparql parse 7
# SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/2
RESERVED_ESCAPE = re.compile(PN_LOCAL_ESC)
# /interface/sparql parse 9
# SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/16
# SPARQL11-QUERY /19 SPARQL Grammar/19.7 Escape sequences in strings/1 to /19 SPARQL Grammar/19.7 Escape sequences in strings/14
STRING_ESCAPE = re.compile(ECHAR)
# /interface/sparql parse 11
# SPARQL11-QUERY /19 SPARQL Grammar/19.6 Blank Nodes and Blank Node Labels/1 to /19 SPARQL Grammar/19.6 Blank Nodes and Blank Node Labels/11
# SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.4 Syntax for Blank Nodes/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.4 Syntax for Blank Nodes/24
ONE_LABEL_TWO_PATTERNS = "one label two patterns"
# /interface/sparql parse 16
# SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/3 to /11 Aggregates/11.2 GROUP BY/3
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/21
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/6
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.4 SELECT Expressions/35
# SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/11 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
AGG = "agg"
# /interface/sparql parse 16
# SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/3 to /11 Aggregates/11.2 GROUP BY/3
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/21
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/6
# SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.4 SELECT Expressions/35
# SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/11 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
NOT_IN_SCOPE = "not in scope"
# /interface/sparql parse 18
# SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
NO_FEDERATED_QUERY = "no federated query"
# /interface/sparql results 1
# SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.1 Serializing the Results Table/1 to /4. TSV - Tab Separated values/4.1 Serializing the Results Table/2
SOLUTIONS = "solutions"
# /interface/sparql results 5
# SPARQL11-RESULTS-JSON /4 Boolean Results/4.2 "boolean"/1 to /4 Boolean Results/4.2 "boolean"/1
BOOLEAN = "boolean"
# /interface/sparql results 3
# SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.2 Serializing RDF Terms/1 to /4. TSV - Tab Separated values/4.2 Serializing RDF Terms/4
# SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
ABBREVIATED = {XSD_INTEGER: re.compile(INTEGER), XSD_DECIMAL: re.compile(DECIMAL), XSD_DOUBLE: re.compile(DOUBLE)}


def _variables(algebra, found):
    # /interface/sparql parse 17
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/10
    # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/5
    if isinstance(algebra, str):
        if algebra.startswith("?") and not algebra[1:].startswith("_:") and algebra[1:] not in found:
            found.append(algebra[1:])
        return found
    if not isinstance(algebra, list) or not algebra:
        return found
    if isinstance(algebra[0], dict):
        for solution in algebra:
            for name in solution:
                if name not in found:
                    found.append(name)
        return found
    head = algebra[0]
    if not isinstance(head, str) or head.startswith("?"):
        for part in algebra:
            _variables(part, found)
        return found

    def add(name):
        if name not in found and not name.startswith("_:"):
            found.append(name)

    if head == "Project":
        for name in algebra[2]:
            add(name)
    elif head == "Extend":
        _variables(algebra[1], found)
        add(algebra[2])
    elif head == "Filter":
        _variables(algebra[2], found)
    elif head == "LeftJoin":
        _variables(algebra[1], found)
        _variables(algebra[2], found)
    elif head == "OrderBy":
        _variables(algebra[1], found)
    elif head == "Path":
        _variables(algebra[1], found)
        _variables(algebra[3], found)
    elif head in ("exists", "Group", "Aggregation", "AggregateJoin"):
        pass
    else:
        for part in algebra[1:]:
            _variables(part, found)
    return found


def _contains(algebra, operator):
    if isinstance(algebra, list) and algebra:
        if algebra[0] == operator:
            return True
        return any(_contains(part, operator) for part in algebra[1:])
    return False


def parse(query):
    # /interface/sparql parse 3
    # SPARQL11-QUERY /19 SPARQL Grammar/19.2 Codepoint Escape Sequences/1 to /19 SPARQL Grammar/19.2 Codepoint Escape Sequences/12
    query = CODEPOINT_ESCAPE.sub(lambda escape: chr(int(escape.group(1) or escape.group(2), 16)), query)

    # /interface/sparql parse 2
    # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
    def number(position):
        return 1 + len(LINE_BREAK.findall(query, 0, position))

    # /interface/sparql parse 1
    # SPARQL11-QUERY /19 SPARQL Grammar/19.1 SPARQL Request String/1 to /19 SPARQL Grammar/19.1 SPARQL Request String/4
    # SPARQL11-QUERY /19 SPARQL Grammar/19.3 White Space/1 to /19 SPARQL Grammar/19.3 White Space/4
    # SPARQL11-QUERY /19 SPARQL Grammar/19.4 Comments/1 to /19 SPARQL Grammar/19.4 Comments/1
    # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
    tokens = []
    position = 0
    while True:
        position = SKIP.match(query, position).end()
        if position == len(query):
            break
        longest = None
        for kind, terminal in TERMINALS:
            match = terminal.match(query, position)
            if match is not None and (longest is None or match.end() > longest[1].end()):
                longest = (kind, match)
        # /interface/sparql parse 2
        # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
        if longest is None:
            raise ValueError(NOT_SPARQL + " " + str(number(position)))
        kind, text = longest[0], longest[1].group()
        if kind in ("NAME", "PUNCT"):
            kind = text.upper() if kind == "NAME" and text != "a" else text
        tokens.append((kind, text, number(position)))
        position = longest[1].end()
    tokens.append(("end", "", number(position)))
    state = {"at": 0, "base": None, "namespaces": {}, "fresh": 0, "pattern": 0, "labels": {}, "template": False}

    def peek(offset=0):
        return tokens[state["at"] + offset][0]

    def line():
        return tokens[state["at"]][2]

    def take(*kinds):
        kind, text, where = tokens[state["at"]]
        # /interface/sparql parse 2
        # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
        if kind not in kinds:
            raise ValueError(NOT_SPARQL + " " + str(where))
        state["at"] += 1
        return text

    def fresh():
        state["fresh"] += 1
        return "?" + "_:" + "_" + str(state["fresh"])

    # /interface/sparql parse 6
    # SPARQL11-QUERY /19 SPARQL Grammar/19.5 IRI References/1 to /19 SPARQL Grammar/19.5 IRI References/2
    # RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
    # RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
    def absolute(iri, where):
        if IRI.fullmatch(iri) is None:
            raise ValueError(NOT_AN_ABSOLUTE_IRI + " " + str(where))
        return iri

    def iri_reference(directive=False):
        where = line()
        text = take("IRIREF")
        # /interface/sparql parse 5
        # SPARQL11-QUERY /19 SPARQL Grammar/19.5 IRI References/1 to /19 SPARQL Grammar/19.5 IRI References/2
        iri = text[1:-1]
        if not directive and state["base"] is not None and re.match(SCHEME + ":", iri) is None:
            iri = transform_references(iri, state["base"])
        # /interface/sparql parse 4
        # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/2
        if directive and state["base"] is not None:
            iri = transform_references(iri, state["base"])
        # /interface/sparql parse 6
        # SPARQL11-QUERY /19 SPARQL Grammar/19.5 IRI References/1 to /19 SPARQL Grammar/19.5 IRI References/2
        # RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
        # RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
        return absolute(iri, where)

    def iri():
        if peek() == "IRIREF":
            return iri_reference()
        where = line()
        text = take("PNAME_LN", "PNAME_NS")
        prefix, local = text.split(":", 1)
        # /interface/sparql parse 8
        # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/2
        if prefix not in state["namespaces"]:
            raise ValueError(NO_NAMESPACE + " " + prefix)
        # /interface/sparql parse 7
        # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/2
        return absolute(state["namespaces"][prefix] + RESERVED_ESCAPE.sub(lambda escape: escape.group()[1], local), where)

    def is_iri():
        return peek() in ("IRIREF", "PNAME_LN", "PNAME_NS")

    # /interface/sparql parse 9
    # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/16
    # SPARQL11-QUERY /19 SPARQL Grammar/19.7 Escape sequences in strings/1 to /19 SPARQL Grammar/19.7 Escape sequences in strings/14
    def rdf_literal():
        kind = peek()
        text = take(kind)
        lexical = STRING_ESCAPE.sub(lambda escape: unescape(escape.group()), text[STRINGS[kind]:-STRINGS[kind]])
        if peek() == "LANGTAG":
            return (lexical, RDF_LANG_STRING, take("LANGTAG")[1:])
        if peek() == "^^":
            take("^^")
            return (lexical, iri(), "")
        return (lexical, XSD_STRING, "")

    # /interface/sparql parse 10
    # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.2 Syntax for Literals/16
    def numeric_literal(sign=""):
        kind = peek()
        text = take("INTEGER", "DECIMAL", "DOUBLE")
        return (sign + text, {"INTEGER": XSD_INTEGER, "DECIMAL": XSD_DECIMAL, "DOUBLE": XSD_DOUBLE}[kind], "")

    def is_literal():
        return peek() in STRINGS or peek() in ("INTEGER", "DECIMAL", "DOUBLE", "TRUE", "FALSE") or (
            peek() in ("+", "-") and peek(1) in ("INTEGER", "DECIMAL", "DOUBLE")
        )

    def literal():
        if peek() in STRINGS:
            return rdf_literal()
        if peek() in ("TRUE", "FALSE"):
            return (take("TRUE", "FALSE").lower(), XSD_BOOLEAN, "")
        sign = take("+", "-") if peek() in ("+", "-") else ""
        return numeric_literal("" if sign == "+" else sign)

    # /interface/sparql parse 12
    # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.3 Syntax for Query Variables/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.3 Syntax for Query Variables/1
    def var():
        return "?" + take("VAR")[1:]

    # /interface/sparql parse 11
    # SPARQL11-QUERY /19 SPARQL Grammar/19.6 Blank Nodes and Blank Node Labels/1 to /19 SPARQL Grammar/19.6 Blank Nodes and Blank Node Labels/11
    # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.4 Syntax for Blank Nodes/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.4 Syntax for Blank Nodes/24
    def blank_label():
        label = take("BLANK_NODE_LABEL")[2:]
        if state["template"]:
            return ("_:" + label, "", "")
        pattern = state["labels"].setdefault(label, state["pattern"])
        if pattern != state["pattern"]:
            raise ValueError(ONE_LABEL_TWO_PATTERNS + " " + label)
        return "?" + "_:" + label

    def anonymous():
        if state["template"]:
            state["fresh"] += 1
            return ("_:" + "_" + str(state["fresh"]), "", "")
        return fresh()

    def var_or_term():
        kind = peek()
        if kind == "VAR":
            return var()
        if is_iri():
            return (iri(), "", "")
        if kind == "BLANK_NODE_LABEL":
            return blank_label()
        if kind == "ANON":
            take("ANON")
            return anonymous()
        if kind == "NIL":
            take("NIL")
            return (RDF_NIL, "", "")
        if is_literal():
            return literal()
        take("VAR")

    # /interface/sparql parse 13
    # SPARQL11-QUERY /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/1 to /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/15
    # SPARQL11-QUERY /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.1 Predicate-Object Lists/1 to /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.1 Predicate-Object Lists/6
    # SPARQL11-QUERY /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.2 Object Lists/1 to /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.2 Object Lists/11
    # SPARQL11-QUERY /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.3 RDF Collections/1 to /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.3 RDF Collections/24
    # SPARQL11-QUERY /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.4 rdf:type/1 to /4 SPARQL Syntax/4.2 Syntax for Triple Patterns/4.2.4 rdf:type/7
    def graph_node(patterns, paths):
        kind = peek()
        if kind == "(":
            take("(")
            nodes = []
            while peek() != ")":
                nodes.append(graph_node(patterns, paths))
            take(")")
            heads = [anonymous() for _ in nodes]
            for place, (head, node) in enumerate(zip(heads, nodes)):
                patterns.append([head, (RDF_FIRST, "", ""), node])
                patterns.append([head, (RDF_REST, "", ""), heads[place + 1] if place + 1 < len(heads) else (RDF_NIL, "", "")])
            return heads[0]
        if kind == "[":
            take("[")
            node = anonymous()
            property_list(node, patterns, paths)
            take("]")
            return node
        return var_or_term()

    # /interface/sparql parse 14
    # SPARQL11-QUERY /9 Property Paths/9.1 Property Path Syntax/1 to /9 Property Paths/9.1 Property Path Syntax/23
    def path_one():
        if peek() == "a":
            take("a")
            return (RDF_TYPE, "", "")
        return (iri(), "", "")

    def path_primary():
        if peek() == "a" or is_iri():
            return ["link", path_one()]
        if peek() == "!":
            take("!")
            forward, inverse = [], []
            if peek() == "(":
                take("(")
                if peek() != ")":
                    while True:
                        if peek() == "^":
                            take("^")
                            inverse.append(path_one())
                        else:
                            forward.append(path_one())
                        if peek() != "|":
                            break
                        take("|")
                take(")")
            elif peek() == "NIL":
                take("NIL")
            else:
                if peek() == "^":
                    take("^")
                    inverse.append(path_one())
                else:
                    forward.append(path_one())
            if forward and inverse:
                return ["alt", ["NPS", forward], ["inv", ["NPS", inverse]]]
            if inverse:
                return ["inv", ["NPS", inverse]]
            return ["NPS", forward]
        take("(")
        expression = path_alternative()
        take(")")
        return expression

    def path_element():
        expression = path_primary()
        if peek() == "?":
            take("?")
            return ["ZeroOrOnePath", expression]
        if peek() == "*":
            take("*")
            return ["ZeroOrMorePath", expression]
        if peek() == "+":
            take("+")
            return ["OneOrMorePath", expression]
        return expression

    def path_element_or_inverse():
        if peek() == "^":
            take("^")
            return ["inv", path_element()]
        return path_element()

    def path_sequence():
        expression = path_element_or_inverse()
        while peek() == "/":
            take("/")
            expression = ["seq", expression, path_element_or_inverse()]
        return expression

    def path_alternative():
        expression = path_sequence()
        while peek() == "|":
            take("|")
            expression = ["alt", expression, path_sequence()]
        return expression

    def verb(paths):
        if peek() == "VAR":
            return var()
        if not paths:
            return path_one()
        expression = path_alternative()
        if expression[0] == "link":
            return expression[1]
        return expression

    def property_list(subject, patterns, paths):
        while True:
            predicate = verb(paths)
            while True:
                node = graph_node(patterns, paths)
                if isinstance(predicate, list):
                    patterns.append(["Path", subject, predicate, node])
                else:
                    patterns.append([subject, predicate, node])
                if peek() != ",":
                    break
                take(",")
            if peek() != ";":
                return
            while peek() == ";":
                take(";")
            if peek() not in ("VAR", "a", "IRIREF", "PNAME_LN", "PNAME_NS", "^", "!", "("):
                return

    def triples_same_subject(patterns, paths):
        kind = peek()
        if kind in ("(", "["):
            subject = graph_node(patterns, paths)
            if peek() not in (".", "}", "end"):
                property_list(subject, patterns, paths)
            return
        subject = var_or_term()
        property_list(subject, patterns, paths)

    def starts_triples():
        return peek() in ("VAR", "IRIREF", "PNAME_LN", "PNAME_NS", "BLANK_NODE_LABEL", "ANON", "NIL", "(", "[") or is_literal()

    def triples_block(patterns, paths=True):
        while starts_triples():
            triples_same_subject(patterns, paths)
            if peek() != ".":
                return
            take(".")

    # expressions
    def expression():
        left = and_expression()
        while peek() == "||":
            take("||")
            left = ["||", left, and_expression()]
        return left

    def and_expression():
        left = relational()
        while peek() == "&&":
            take("&&")
            left = ["&&", left, relational()]
        return left

    def relational():
        left = additive()
        if peek() in ("=", "!=", "<", ">", "<=", ">="):
            operator = take(peek())
            return [operator, left, additive()]
        if peek() == "IN":
            take("IN")
            return ["IN", left] + expression_list()
        if peek() == "NOT" and peek(1) == "IN":
            take("NOT")
            take("IN")
            return ["NOT IN", left] + expression_list()
        return left

    def expression_list():
        if peek() == "NIL":
            take("NIL")
            return []
        take("(")
        items = [expression()]
        while peek() == ",":
            take(",")
            items.append(expression())
        take(")")
        return items

    def additive():
        left = multiplicative()
        while peek() in ("+", "-"):
            operator = take(peek())
            left = [operator, left, multiplicative()]
        return left

    def multiplicative():
        left = unary()
        while peek() in ("*", "/"):
            operator = take(peek())
            left = [operator, left, unary()]
        return left

    def unary():
        if peek() in ("!", "+", "-"):
            operator = take(peek())
            return [operator, unary()]
        return primary()

    def call(name):
        if name == "BOUND":
            take("(")
            variable = var()
            take(")")
            return [name, variable]
        if name in ("EXISTS",):
            return ["exists", group_graph_pattern()]
        if name == "NOT":
            take("EXISTS")
            return ["!", ["exists", group_graph_pattern()]]
        if peek() == "NIL":
            take("NIL")
            return [name]
        return [name] + expression_list()

    def aggregate(name):
        take("(")
        distinct = False
        if peek() == "DISTINCT":
            take("DISTINCT")
            distinct = True
        if name == "COUNT" and peek() == "*":
            take("*")
            argument = "*"
        else:
            argument = expression()
        scalarvals = {}
        if name == "GROUP_CONCAT" and peek() == ";":
            take(";")
            take("SEPARATOR")
            take("=")
            scalarvals["separator"] = rdf_literal()[0]
        take(")")
        expressions = ["Distinct", [argument]] if distinct else [argument]
        return ["Aggregation", expressions, SET_FUNCTIONS[name], scalarvals, None]

    def iri_or_function():
        name = iri()
        if peek() in ("(", "NIL"):
            if peek() == "NIL":
                take("NIL")
                return [name]
            return [name] + expression_list()
        return (name, "", "")

    def primary():
        kind = peek()
        if kind == "(":
            take("(")
            inner = expression()
            take(")")
            return inner
        if kind in BUILT_INS or kind in ("EXISTS",) or (kind == "NOT" and peek(1) == "EXISTS"):
            take(kind)
            return call(kind)
        if kind in AGGREGATES:
            take(kind)
            return aggregate(kind)
        if is_iri():
            return iri_or_function()
        if kind == "VAR":
            return var()
        if is_literal():
            return literal()
        take("VAR")

    def constraint():
        if peek() == "(":
            take("(")
            inner = expression()
            take(")")
            return inner
        return primary()

    # graph patterns
    # /interface/sparql parse 15
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.2 Converting Graph Patterns/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.2 Converting Graph Patterns/19
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.2 Converting Graph Patterns/18.2.2.6 Translate Graph Patterns/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.2 Converting Graph Patterns/18.2.2.8 Simplification step/3
    def join(left, right):
        if left == ["Z"]:
            return right
        if right == ["Z"]:
            return left
        return ["Join", left, right]

    def basic(patterns):
        algebra = ["Z"]
        triples = []
        for pattern in patterns:
            if pattern[0] == "Path":
                if triples:
                    algebra = join(algebra, ["BGP", triples])
                    triples = []
                algebra = join(algebra, pattern)
            else:
                triples.append(pattern)
        if triples:
            algebra = join(algebra, ["BGP", triples])
        return algebra

    def group_graph_pattern():
        take("{")
        if peek() == "SELECT":
            algebra = ["ToMultiSet", select_query(sub=True)]
            take("}")
            return algebra
        state["pattern"] += 1
        algebra = ["Z"]
        filters = []
        patterns = []
        while peek() != "}":
            if starts_triples():
                triples_block(patterns)
                continue
            kind = peek()
            if patterns:
                algebra = join(algebra, basic(patterns))
                patterns = []
                state["pattern"] += 1
            if kind == "FILTER":
                take("FILTER")
                filters.append(constraint())
            elif kind == "OPTIONAL":
                take("OPTIONAL")
                right = group_graph_pattern()
                if right[0] == "Filter":
                    algebra = ["LeftJoin", algebra, right[2], right[1]]
                else:
                    algebra = ["LeftJoin", algebra, right, (("true", XSD_BOOLEAN, ""))]
            elif kind == "MINUS":
                take("MINUS")
                algebra = ["Minus", algebra, group_graph_pattern()]
            elif kind == "GRAPH":
                take("GRAPH")
                name = var() if peek() == "VAR" else (iri(), "", "")
                algebra = join(algebra, ["Graph", name, group_graph_pattern()])
            elif kind == "SERVICE":
                # /interface/sparql parse 18
                # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
                raise ValueError(NO_FEDERATED_QUERY)
            elif kind == "BIND":
                take("BIND")
                take("(")
                value = expression()
                take("AS")
                variable = var()
                take(")")
                algebra = ["Extend", algebra, variable[1:], value]
            elif kind == "VALUES":
                take("VALUES")
                algebra = join(algebra, data_block())
            elif kind == "{":
                left = group_graph_pattern()
                while peek() == "UNION":
                    take("UNION")
                    left = ["Union", left, group_graph_pattern()]
                algebra = join(algebra, left)
            elif kind == ".":
                take(".")
            else:
                take("}")
        if patterns:
            algebra = join(algebra, basic(patterns))
        take("}")
        state["pattern"] += 1
        if filters:
            conjunction = filters[0]
            for condition in filters[1:]:
                conjunction = ["&&", conjunction, condition]
            algebra = ["Filter", conjunction, algebra]
        return algebra

    def data_value():
        if peek() == "UNDEF":
            take("UNDEF")
            return None
        if is_iri():
            return (iri(), "", "")
        return literal()

    def data_block():
        if peek() == "VAR":
            variable = var()[1:]
            take("{")
            rows = []
            data = []
            while peek() != "}":
                value = data_value()
                data.append({} if value is None else {variable: value})
            take("}")
            return data
        variables = []
        if peek() == "NIL":
            take("NIL")
        else:
            take("(")
            while peek() == "VAR":
                variables.append(var()[1:])
            take(")")
        take("{")
        rows = []
        while peek() != "}":
            if peek() == "NIL":
                take("NIL")
                rows.append([])
                continue
            take("(")
            row = []
            while peek() != ")":
                row.append(data_value())
            take(")")
            rows.append(row)
        take("}")
        return [{name: value for name, value in zip(variables, row) if value is not None} for row in rows]

    # /interface/sparql parse 16
    # SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/3 to /11 Aggregates/11.2 GROUP BY/3
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.1 Variable Scope/21
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/6
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.1 Grouping and Aggregation/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.4 Converting Groups, Aggregates, HAVING, final VALUES clause and SELECT Expressions/18.2.4.4 SELECT Expressions/35
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/11 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
    def lift(value, aggregates):
        if not isinstance(value, list) or not value:
            return value
        head = value[0]
        if head == "Aggregation" and value[4] is None:
            aggregates.append(value)
            return "?" + AGG + str(len(aggregates))
        if head == "exists":
            return value
        if isinstance(head, str) and not head.startswith("?"):
            return [head] + [lift(part, aggregates) for part in value[1:]]
        return [lift(part, aggregates) for part in value]

    def solution_modifier(algebra, selections, star):
        groups = []
        if peek() == "GROUP":
            take("GROUP")
            take("BY")
            while True:
                kind = peek()
                if kind == "VAR":
                    groups.append([var(), None])
                elif kind == "(":
                    take("(")
                    value = expression()
                    name = None
                    if peek() == "AS":
                        take("AS")
                        name = var()[1:]
                    take(")")
                    groups.append([value, name])
                elif kind in BUILT_INS or is_iri():
                    groups.append([primary(), None])
                else:
                    break
        having = []
        if peek() == "HAVING":
            take("HAVING")
            while peek() in ("(",) or peek() in BUILT_INS or peek() in AGGREGATES or is_iri():
                having.append(constraint())
        orders = []
        if peek() == "ORDER":
            take("ORDER")
            take("BY")
            while True:
                kind = peek()
                if kind in ("ASC", "DESC"):
                    take(kind)
                    take("(")
                    value = expression()
                    take(")")
                    orders.append([kind, value])
                elif kind == "VAR":
                    orders.append(["ASC", var()])
                elif kind == "(" or kind in BUILT_INS or kind in AGGREGATES or is_iri():
                    orders.append(["ASC", constraint()])
                else:
                    break
        limit = offset = None
        while peek() in ("LIMIT", "OFFSET"):
            if take("LIMIT", "OFFSET").upper() == "LIMIT":
                limit = int(take("INTEGER"))
            else:
                offset = int(take("INTEGER"))
        values = None
        if peek() == "VALUES":
            take("VALUES")
            values = data_block()
        aggregates = []
        expressions = []
        grouped = bool(groups) or any(
            _contains(value, "Aggregation") for value in [value for _, value in selections] + having + [value for _, value in orders]
        )
        if grouped:
            in_scope = set()
            keys = []
            for value, name in groups:
                if name is not None:
                    algebra = ["Extend", algebra, name, value]
                    value = "?" + name
                keys.append(value)
                if isinstance(value, str):
                    in_scope.add(value[1:])
            for name, value in selections:
                for variable in [name] if value is None else _variables(value, []):
                    if variable not in in_scope:
                        raise ValueError(NOT_IN_SCOPE + " " + variable)
                in_scope.add(name)
            if star:
                raise ValueError(NOT_IN_SCOPE + " *")
            group = ["Group", keys if groups else [("1", XSD_INTEGER, "")], algebra]

            def sample(value):
                if isinstance(value, str) and value.startswith("?"):
                    return ["Aggregation", [value], "Sample", {}, None]
                if not isinstance(value, list) or not value or value[0] in ("Aggregation", "exists"):
                    return value
                return [value[0]] + [sample(part) for part in value[1:]]

            selections = [[name, value if value is None else lift(sample(value), aggregates)] for name, value in selections]
            having = [lift(sample(condition), aggregates) for condition in having]
            orders = [[direction, lift(sample(value), aggregates)] for direction, value in orders]
            for name, value in selections:
                if value is None:
                    aggregates.append(["Aggregation", ["?" + name], "Sample", {}, None])
                    expressions.append([name, "?" + AGG + str(len(aggregates))])
            algebra = ["AggregateJoin"] + [aggregation[:4] + [group] for aggregation in aggregates]
        for condition in having:
            algebra = ["Filter", condition, algebra]
        if values is not None:
            algebra = ["Join", algebra, ["ToMultiSet", values]]
        projected = []
        for name, value in selections:
            projected.append(name)
            if value is not None:
                expressions.append([name, value])
        for name, value in expressions:
            algebra = ["Extend", algebra, name, value]
        if star or not selections:
            projected = _variables(algebra, [])
        if orders:
            algebra = ["OrderBy", algebra, orders]
        return algebra, projected, limit, offset

    def select_clause():
        take("SELECT")
        modifier = None
        if peek() in ("DISTINCT", "REDUCED"):
            modifier = take(peek()).upper()
        selections = []
        star = False
        if peek() == "*":
            take("*")
            star = True
        else:
            while peek() in ("VAR", "("):
                if peek() == "VAR":
                    selections.append([var()[1:], None])
                else:
                    take("(")
                    value = expression()
                    take("AS")
                    selections.append([var()[1:], value])
                    take(")")
            if not selections:
                take("VAR")
        return modifier, selections, star

    def where_clause(required=True):
        if peek() == "WHERE":
            take("WHERE")
        elif not required and peek() != "{":
            return ["Z"]
        return group_graph_pattern()

    def finish(algebra, projected, modifier, limit, offset):
        # /interface/sparql parse 17
        # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/10
        # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/5
        algebra = ["Project", algebra, projected]
        if modifier == "DISTINCT":
            algebra = ["Distinct", algebra]
        elif modifier == "REDUCED":
            algebra = ["Reduced", algebra]
        if limit is not None or offset is not None:
            algebra = ["Slice", algebra, offset or 0, limit]
        return algebra

    def select_query(sub=False):
        modifier, selections, star = select_clause()
        datasets = [] if sub else dataset_clauses()
        algebra = where_clause()
        algebra, projected, limit, offset = solution_modifier(algebra, selections, star)
        result = finish(algebra, projected, modifier, limit, offset)
        if sub:
            return result
        return datasets, result

    def dataset_clauses():
        # /interface/sparql parse 17
        # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/10
        # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/5
        default, named = [], []
        while peek() == "FROM":
            take("FROM")
            if peek() == "NAMED":
                take("NAMED")
                named.append(iri())
            else:
                default.append(iri())
        return [default, named]

    # /interface/sparql parse 4
    # SPARQL11-QUERY /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/1 to /4 SPARQL Syntax/4.1 RDF Term Syntax/4.1.1 Syntax for IRIs/2
    while peek() in ("BASE", "PREFIX"):
        if take("BASE", "PREFIX").upper() == "BASE":
            state["base"] = iri_reference(directive=True)
        else:
            prefix = take("PNAME_NS")[:-1]
            state["namespaces"][prefix] = iri_reference()

    # /interface/sparql parse 17
    # SPARQL11-QUERY /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/1 to /18 Definition of SPARQL/18.2 Translation to the SPARQL Algebra/18.2.5 Converting Solution Modifiers/10
    # SPARQL11-QUERY /13 RDF Dataset/13.2 Specifying RDF Datasets/1 to /13 RDF Dataset/13.2 Specifying RDF Datasets/5
    form = peek()
    template = []
    if form == "SELECT":
        datasets, algebra = select_query()
    elif form == "CONSTRUCT":
        take("CONSTRUCT")
        if peek() == "{":
            take("{")
            state["template"] = True
            triples_block(template, paths=False)
            state["template"] = False
            take("}")
            datasets = dataset_clauses()
            pattern = where_clause()
        else:
            datasets = dataset_clauses()
            take("WHERE")
            take("{")
            patterns = []
            triples_block(patterns, paths=False)
            take("}")
            pattern = basic(patterns)
            template = patterns
        pattern, projected, limit, offset = solution_modifier(pattern, [], False)
        algebra = finish(pattern, projected, None, limit, offset)
    elif form == "DESCRIBE":
        take("DESCRIBE")
        star = False
        if peek() == "*":
            take("*")
            star = True
        else:
            while peek() == "VAR" or is_iri():
                template.append(var() if peek() == "VAR" else (iri(), "", ""))
        datasets = dataset_clauses()
        pattern = where_clause(required=False)
        pattern, projected, limit, offset = solution_modifier(pattern, [], False)
        if star:
            template = ["?" + name for name in projected]
        algebra = finish(pattern, projected, None, limit, offset)
    elif form == "ASK":
        take("ASK")
        datasets = dataset_clauses()
        pattern = where_clause()
        pattern, projected, limit, offset = solution_modifier(pattern, [], False)
        algebra = finish(pattern, projected, None, limit, offset)
    else:
        take(*FORMS)
    take("end")
    if form == "CONSTRUCT" or form == "DESCRIBE":
        return [algebra, datasets, [form, template]]
    return [algebra, datasets, [form]]


def _written(term):
    # /interface/sparql results 3
    # SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.2 Serializing RDF Terms/1 to /4. TSV - Tab Separated values/4.2 Serializing RDF Terms/4
    # SPARQL11-QUERY /19 SPARQL Grammar/19.8 Grammar/1 to /19 SPARQL Grammar/19.8 Grammar/191
    value, datatype, language = term
    if datatype == "" and language == "":
        if value.startswith("_:"):
            return value
        return "<" + value + ">"
    text = string_literal_quote(value)
    if language:
        return text + "@" + language
    if datatype in ABBREVIATED and ABBREVIATED[datatype].fullmatch(value) is not None:
        return value
    if datatype == XSD_STRING:
        return text
    return text + "^^<" + datatype + ">"


def results(variables, solutions, *, boolean=""):
    # /interface/sparql results 5
    # SPARQL11-RESULTS-JSON /4 Boolean Results/4.2 "boolean"/1 to /4 Boolean Results/4.2 "boolean"/1
    if boolean:
        return sheet(BOOLEAN, [BOOLEAN], [{BOOLEAN: boolean}])
    # /interface/sparql results 1
    # SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.1 Serializing the Results Table/1 to /4. TSV - Tab Separated values/4.1 Serializing the Results Table/2
    header = ["?" + variable for variable in variables]
    # /interface/sparql results 2
    # SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.1 Serializing the Results Table/3 to /4. TSV - Tab Separated values/4.1 Serializing the Results Table/4
    rows = []
    for solution in solutions:
        # /interface/sparql results 4
        # SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.1 Serializing the Results Table/4 to /4. TSV - Tab Separated values/4.1 Serializing the Results Table/4
        rows.append({"?" + variable: _written(solution[variable]) if variable in solution else "" for variable in variables})
    # /interface/sparql results 1
    # SPARQL11-RESULTS-CSV-TSV /4. TSV - Tab Separated values/4.1 Serializing the Results Table/1 to /4. TSV - Tab Separated values/4.1 Serializing the Results Table/2
    return sheet(SOLUTIONS, header, rows)
