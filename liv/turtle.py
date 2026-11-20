import re

from .types import STRING_LITERAL_QUOTE, XSD, XSD_INTEGER, transform_references, unescape

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
RDF_TYPE = RDF + "type"
RDF_LANG_STRING = RDF + "langString"
RDF_NIL = RDF + "nil"
RDF_FIRST = RDF + "first"
RDF_REST = RDF + "rest"
XSD_STRING = XSD + "string"
XSD_DECIMAL = XSD + "decimal"
XSD_DOUBLE = XSD + "double"
XSD_BOOLEAN = XSD + "boolean"
TRIPLES_NAME = "triples"
TRIPLES = [
    ("subject", "term"),
    ("predicate", "iri"),
    ("object", "term"),
    ("datatype IRI", "iri"),
    ("language tag", "string"),
]
TRIPLES_KEY = ["subject", "predicate", "object", "datatype IRI", "language tag"]

# /interface/turtle parse 1
# RDF11-TURTLE /5. Conformance/6 to /5. Conformance/6
# RDF11-TURTLE /6. Turtle Grammar/1 to /6. Turtle Grammar/6.2 Comments/1
# RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/1 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/26
# RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/10 to /6. Turtle Grammar/6.5 Grammar/10
HEX = "[0-9A-Fa-f]"
UCHAR = "\\\\u" + HEX + "{4}|\\\\U" + HEX + "{8}"
ECHAR = "\\\\[tbnrf\"'\\\\]"
PN_CHARS_BASE = (
    "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D"
    "\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\U00010000-\U000EFFFF"
)
PN_CHARS_U = PN_CHARS_BASE + "_"
PN_CHARS = PN_CHARS_U + "\\-0-9\u00B7\u0300-\u036F\u203F-\u2040"
PN_PREFIX = "[" + PN_CHARS_BASE + "](?:[" + PN_CHARS + ".]*[" + PN_CHARS + "])?"
PN_LOCAL_ESC = "\\\\[_~.\\-!$&'()*+,;=/?#@%]"
PLX = "%" + HEX + HEX + "|" + PN_LOCAL_ESC
PN_LOCAL = (
    "(?:[" + PN_CHARS_U + ":0-9]|" + PLX + ")"
    + "(?:(?:[" + PN_CHARS + ".:]|" + PLX + ")*(?:[" + PN_CHARS + ":]|" + PLX + "))?"
)
PNAME_NS = "(?:" + PN_PREFIX + ")?:"
PNAME_LN = PNAME_NS + PN_LOCAL
BLANK_NODE_LABEL = "_:[" + PN_CHARS_U + "0-9](?:[" + PN_CHARS + ".]*[" + PN_CHARS + "])?"
IRIREF = "<(?:[^\\x00-\\x20<>\"{}|^`\\\\]|" + UCHAR + ")*>"
LANGTAG = "@[a-zA-Z]+(?:-[a-zA-Z0-9]+)*"
EXPONENT = "[eE][+-]?[0-9]+"
INTEGER = "[+-]?[0-9]+"
DECIMAL = "[+-]?[0-9]*[.][0-9]+"
DOUBLE = "[+-]?(?:[0-9]+[.][0-9]*" + EXPONENT + "|[.][0-9]+" + EXPONENT + "|[0-9]+" + EXPONENT + ")"
STRING_LITERAL_SINGLE_QUOTE = "'(?:[^\\x27\\x5C\\x0A\\x0D]|" + ECHAR + "|" + UCHAR + ")*'"
STRING_LITERAL_LONG_SINGLE_QUOTE = "'''(?:(?:'|'')?(?:[^'\\\\]|" + ECHAR + "|" + UCHAR + "))*'''"
STRING_LITERAL_LONG_QUOTE = "\"\"\"(?:(?:\"|\"\")?(?:[^\"\\\\]|" + ECHAR + "|" + UCHAR + "))*\"\"\""
WS = "[\\x20\\x09\\x0D\\x0A]"
COMMENT = "#[^\\x0D\\x0A]*"
ANON = "\\[(?:" + WS + "|" + COMMENT + ")*\\]"
SKIP = re.compile("(?:" + WS + "|" + COMMENT + ")*")
TERMINALS = [
    ("IRIREF", re.compile(IRIREF)),
    ("PNAME_LN", re.compile(PNAME_LN)),
    ("PNAME_NS", re.compile(PNAME_NS)),
    ("BLANK_NODE_LABEL", re.compile(BLANK_NODE_LABEL)),
    ("LANGTAG", re.compile(LANGTAG)),
    ("DOUBLE", re.compile(DOUBLE)),
    ("DECIMAL", re.compile(DECIMAL)),
    ("INTEGER", re.compile(INTEGER)),
    ("STRING_LITERAL_LONG_QUOTE", re.compile(STRING_LITERAL_LONG_QUOTE)),
    ("STRING_LITERAL_LONG_SINGLE_QUOTE", re.compile(STRING_LITERAL_LONG_SINGLE_QUOTE)),
    ("STRING_LITERAL_QUOTE", re.compile(STRING_LITERAL_QUOTE)),
    ("STRING_LITERAL_SINGLE_QUOTE", re.compile(STRING_LITERAL_SINGLE_QUOTE)),
    ("ANON", re.compile(ANON)),
    ("^^", re.compile("\\^\\^")),
    ("[", re.compile("\\[")),
    ("]", re.compile("\\]")),
    ("(", re.compile("\\(")),
    (")", re.compile("\\)")),
    (".", re.compile("[.]")),
    (";", re.compile(";")),
    (",", re.compile(",")),
    ("true", re.compile("true")),
    ("false", re.compile("false")),
    ("a", re.compile("a")),
    ("BASE", re.compile("(?i:BASE)")),
    ("PREFIX", re.compile("(?i:PREFIX)")),
]
STRINGS = {
    "STRING_LITERAL_QUOTE": 1,
    "STRING_LITERAL_SINGLE_QUOTE": 1,
    "STRING_LITERAL_LONG_SINGLE_QUOTE": 3,
    "STRING_LITERAL_LONG_QUOTE": 3,
}
IRIS = ("IRIREF", "PNAME_LN", "PNAME_NS")
VERBS = ("a",) + IRIS

# /interface/turtle parse 3
# RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
# RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
BASE = "@base"
# /interface/turtle parse 4
# RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/4 to /7. Parsing/7.2 RDF Term Constructors/4
PREFIX_ID = "@prefix"

# /interface/turtle parse 5
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/3 to /7. Parsing/7.2 RDF Term Constructors/3
# RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/1 to /6. Turtle Grammar/6.3 IRI References/1
NUMERIC_ESCAPE = re.compile(UCHAR)

# /interface/turtle parse 7
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/5 to /7. Parsing/7.2 RDF Term Constructors/6
# RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/18 to /6. Turtle Grammar/6.4 Escape Sequences/22
RESERVED_ESCAPE = re.compile(PN_LOCAL_ESC)

# /interface/turtle parse 8
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/6 to /7. Parsing/7.2 RDF Term Constructors/6
NO_NAMESPACE = "no namespace"

# /interface/turtle parse 9
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/7 to /7. Parsing/7.2 RDF Term Constructors/12
# RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/1 to /6. Turtle Grammar/6.4 Escape Sequences/17
STRING_ESCAPE = re.compile(ECHAR + "|" + UCHAR)

# /interface/turtle parse 10
# RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/13 to /7. Parsing/7.2 RDF Term Constructors/16
NUMERIC = {
    "INTEGER": XSD_INTEGER,
    "DECIMAL": XSD_DECIMAL,
    "DOUBLE": XSD_DOUBLE,
    "true": XSD_BOOLEAN,
    "false": XSD_BOOLEAN,
}

# /interface/turtle parse 2
# RDF11-TURTLE /5. Conformance/9 to /5. Conformance/9
LINE_BREAK = re.compile("\r\n|\n|\r")
NOT_TURTLE = "not Turtle"

# /interface/turtle parse 6
# RDF11-CONCEPTS /3. RDF Graphs/3.2 IRIs/1 to /3. RDF Graphs/3.2 IRIs/2
# RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
# RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
# RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
# RFC3986 /5. Reference Resolution/5.1. Establishing a Base URI/1 to /5. Reference Resolution/5.1. Establishing a Base URI/5.1.4. Default Base URI/2
UCSCHAR = (
    "\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF"
    "\U00010000-\U0001FFFD\U00020000-\U0002FFFD\U00030000-\U0003FFFD"
    "\U00040000-\U0004FFFD\U00050000-\U0005FFFD\U00060000-\U0006FFFD"
    "\U00070000-\U0007FFFD\U00080000-\U0008FFFD\U00090000-\U0009FFFD"
    "\U000A0000-\U000AFFFD\U000B0000-\U000BFFFD\U000C0000-\U000CFFFD"
    "\U000D0000-\U000DFFFD\U000E1000-\U000EFFFD"
)
IPRIVATE = "\uE000-\uF8FF\U000F0000-\U000FFFFD\U00100000-\U0010FFFD"
SUB_DELIMS = "!$&'()*+,;="
IUNRESERVED = "[A-Za-z0-9\\-._~" + UCSCHAR + "]"
PCT_ENCODED = "%[0-9A-Fa-f][0-9A-Fa-f]"
IPCHAR = "(?:" + IUNRESERVED + "|" + PCT_ENCODED + "|[" + SUB_DELIMS + ":@])"
ISEGMENT = IPCHAR + "*"
ISEGMENT_NZ = IPCHAR + "+"
IPATH_ABEMPTY = "(?:/" + ISEGMENT + ")*"
IPATH_ABSOLUTE = "/(?:" + ISEGMENT_NZ + "(?:/" + ISEGMENT + ")*)?"
IPATH_ROOTLESS = ISEGMENT_NZ + "(?:/" + ISEGMENT + ")*"
IPATH_EMPTY = ""
DEC_OCTET = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])"
IPV4ADDRESS = DEC_OCTET + "\\." + DEC_OCTET + "\\." + DEC_OCTET + "\\." + DEC_OCTET
H16 = "[0-9A-Fa-f]{1,4}"
LS32 = "(?:" + H16 + ":" + H16 + "|" + IPV4ADDRESS + ")"
IPV6ADDRESS = (
    "(?:(?:" + H16 + ":){6}" + LS32
    + "|::(?:" + H16 + ":){5}" + LS32
    + "|(?:" + H16 + ")?::(?:" + H16 + ":){4}" + LS32
    + "|(?:(?:" + H16 + ":){0,1}" + H16 + ")?::(?:" + H16 + ":){3}" + LS32
    + "|(?:(?:" + H16 + ":){0,2}" + H16 + ")?::(?:" + H16 + ":){2}" + LS32
    + "|(?:(?:" + H16 + ":){0,3}" + H16 + ")?::" + H16 + ":" + LS32
    + "|(?:(?:" + H16 + ":){0,4}" + H16 + ")?::" + LS32
    + "|(?:(?:" + H16 + ":){0,5}" + H16 + ")?::" + H16
    + "|(?:(?:" + H16 + ":){0,6}" + H16 + ")?::)"
)
IPVFUTURE = "[vV][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~" + SUB_DELIMS + ":]+"
IP_LITERAL = "\\[(?:" + IPV6ADDRESS + "|" + IPVFUTURE + ")\\]"
IREG_NAME = "(?:" + IUNRESERVED + "|" + PCT_ENCODED + "|[" + SUB_DELIMS + "])*"
IHOST = "(?:" + IP_LITERAL + "|" + IPV4ADDRESS + "|" + IREG_NAME + ")"
IUSERINFO = "(?:" + IUNRESERVED + "|" + PCT_ENCODED + "|[" + SUB_DELIMS + ":])*"
PORT = "[0-9]*"
IAUTHORITY = "(?:" + IUSERINFO + "@)?" + IHOST + "(?::" + PORT + ")?"
IHIER_PART = "(?://" + IAUTHORITY + IPATH_ABEMPTY + "|" + IPATH_ABSOLUTE + "|" + IPATH_ROOTLESS + "|" + IPATH_EMPTY + ")"
IQUERY = "(?:" + IPCHAR + "|[" + IPRIVATE + "/?])*"
IFRAGMENT = "(?:" + IPCHAR + "|[/?])*"
SCHEME = "[A-Za-z][A-Za-z0-9+\\-.]*"
IRI = re.compile(SCHEME + ":" + IHIER_PART + "(?:\\?" + IQUERY + ")?(?:#" + IFRAGMENT + ")?")
NOT_AN_ABSOLUTE_IRI = "not an absolute IRI"


def _string_escape(escape):
    # /interface/turtle parse 9
    # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/7 to /7. Parsing/7.2 RDF Term Constructors/12
    # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/1 to /6. Turtle Grammar/6.4 Escape Sequences/17
    text = escape.group()
    if text[1] in "uU":
        return chr(int(text[2:], 16))
    return unescape(text)


def parse(document):
    triples = []

    # /interface/turtle parse 2
    # RDF11-TURTLE /5. Conformance/9 to /5. Conformance/9
    def number(position):
        return 1 + len(LINE_BREAK.findall(document, 0, position))

    # /interface/turtle parse 1
    # RDF11-TURTLE /5. Conformance/6 to /5. Conformance/6
    # RDF11-TURTLE /6. Turtle Grammar/1 to /6. Turtle Grammar/6.2 Comments/1
    # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/1 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/26
    # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/10 to /6. Turtle Grammar/6.5 Grammar/10
    tokens = []
    position = 0
    while True:
        position = SKIP.match(document, position).end()
        if position == len(document):
            break
        longest = None
        for kind, terminal in TERMINALS:
            match = terminal.match(document, position)
            if match is not None and (longest is None or match.end() > longest[1].end()):
                longest = (kind, match)
        # /interface/turtle parse 2
        # RDF11-TURTLE /5. Conformance/9 to /5. Conformance/9
        if longest is None:
            raise ValueError(NOT_TURTLE + " " + str(number(position)))
        tokens.append((longest[0], longest[1].group(), number(position)))
        position = longest[1].end()
    tokens.append(("end", "", number(position)))
    at = 0

    def peek():
        return tokens[at][0]

    def take(*kinds):
        nonlocal at
        kind, text, line = tokens[at]
        # /interface/turtle parse 2
        # RDF11-TURTLE /5. Conformance/9 to /5. Conformance/9
        if kind not in kinds:
            raise ValueError(NOT_TURTLE + " " + str(line))
        at += 1
        return text, line

    # /interface/turtle parse 3
    # RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
    # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
    base = None
    # /interface/turtle parse 4
    # RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
    # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/4 to /7. Parsing/7.2 RDF Term Constructors/4
    namespaces = {}

    # /interface/turtle parse 12
    # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
    # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1 to /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1
    used = {text for kind, text, line in tokens if kind == "BLANK_NODE_LABEL"}
    count = 0

    def novel():
        nonlocal count
        count += 1
        while "_:" + "b" + str(count) in used:
            count += 1
        return "_:" + "b" + str(count)

    # /interface/turtle parse 6
    # RDF11-CONCEPTS /3. RDF Graphs/3.2 IRIs/1 to /3. RDF Graphs/3.2 IRIs/2
    # RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
    # RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
    # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
    # RFC3986 /5. Reference Resolution/5.1. Establishing a Base URI/1 to /5. Reference Resolution/5.1. Establishing a Base URI/5.1.4. Default Base URI/2
    def absolute(iri, line):
        if IRI.fullmatch(iri) is None:
            raise ValueError(NOT_AN_ABSOLUTE_IRI + " " + str(line))
        return iri

    def iri_reference(directive=False):
        text, line = take("IRIREF")
        # /interface/turtle parse 5
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/3 to /7. Parsing/7.2 RDF Term Constructors/3
        # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/1 to /6. Turtle Grammar/6.3 IRI References/1
        iri = NUMERIC_ESCAPE.sub(lambda escape: chr(int(escape.group()[2:], 16)), text[1:-1])
        if not directive and base is not None and re.match(SCHEME + ":", iri) is None:
            iri = transform_references(iri, base)
        # /interface/turtle parse 3
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
        # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
        if directive and base is not None:
            iri = transform_references(iri, base)
        # /interface/turtle parse 6
        # RDF11-CONCEPTS /3. RDF Graphs/3.2 IRIs/1 to /3. RDF Graphs/3.2 IRIs/2
        # RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
        # RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
        # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
        # RFC3986 /5. Reference Resolution/5.1. Establishing a Base URI/1 to /5. Reference Resolution/5.1. Establishing a Base URI/5.1.4. Default Base URI/2
        return absolute(iri, line)

    def iri():
        if peek() == "IRIREF":
            return iri_reference()
        text, line = take("PNAME_LN", "PNAME_NS")
        prefix, local = text.split(":", 1)
        # /interface/turtle parse 8
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/6 to /7. Parsing/7.2 RDF Term Constructors/6
        if prefix not in namespaces:
            raise ValueError(NO_NAMESPACE + " " + prefix)
        # /interface/turtle parse 7
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/5 to /7. Parsing/7.2 RDF Term Constructors/6
        # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/18 to /6. Turtle Grammar/6.4 Escape Sequences/22
        iri = namespaces[prefix] + RESERVED_ESCAPE.sub(lambda escape: escape.group()[1], local)
        # /interface/turtle parse 6
        # RDF11-CONCEPTS /3. RDF Graphs/3.2 IRIs/1 to /3. RDF Graphs/3.2 IRIs/2
        # RFC3987 /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/1 to /2. IRI Syntax/2.2. ABNF for IRI References and IRIs/102
        # RFC5234 /2. Rule Definition/2.3. Terminal Values/1 to /Appendix B. Core ABNF of ABNF/B.1. Core Rules/25
        # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
        # RFC3986 /5. Reference Resolution/5.1. Establishing a Base URI/1 to /5. Reference Resolution/5.1. Establishing a Base URI/5.1.4. Default Base URI/2
        return absolute(iri, line)

    # /interface/turtle parse 14
    # RDF11-TURTLE /7. Parsing/7.1 Parser State/5 to /7. Parsing/7.1 Parser State/6
    # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/1 to /7. Parsing/7.3 RDF Triples Constructors/1
    def emit(subject, predicate, object, datatype="", language=""):
        triples.append({
            "subject": subject,
            "predicate": predicate,
            "object": object,
            "datatype IRI": datatype,
            "language tag": language,
        })

    # /interface/turtle parse 13
    # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/20 to /7. Parsing/7.2 RDF Term Constructors/21
    # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Collections/1 to /7. Parsing/7.3 RDF Triples Constructors/Collections/1
    def members(node):
        while True:
            object(node, RDF_FIRST)
            if peek() == ")":
                take(")")
                emit(node, RDF_REST, RDF_NIL)
                return
            rest = novel()
            emit(node, RDF_REST, rest)
            node = rest

    def collection():
        take("(")
        if peek() == ")":
            take(")")
            return RDF_NIL, False
        return novel(), True

    def subject():
        kind = peek()
        if kind in IRIS:
            return iri()
        # /interface/turtle parse 11
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/4 to /7. Parsing/7.1 Parser State/4
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
        if kind == "BLANK_NODE_LABEL":
            return take(kind)[0]
        # /interface/turtle parse 12
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1 to /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1
        if kind == "ANON":
            take(kind)
            return novel()
        # /interface/turtle parse 13
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/20 to /7. Parsing/7.2 RDF Term Constructors/21
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Collections/1 to /7. Parsing/7.3 RDF Triples Constructors/Collections/1
        if kind == "(":
            node, filled = collection()
            if filled:
                members(node)
            return node
        # /interface/turtle parse 2
        # RDF11-TURTLE /5. Conformance/9 to /5. Conformance/9
        return iri()

    def object(subject, predicate):
        kind = peek()
        # /interface/turtle parse 14
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/5 to /7. Parsing/7.1 Parser State/6
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/1 to /7. Parsing/7.3 RDF Triples Constructors/1
        if kind in IRIS:
            emit(subject, predicate, iri())
        # /interface/turtle parse 11
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/4 to /7. Parsing/7.1 Parser State/4
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
        elif kind == "BLANK_NODE_LABEL":
            emit(subject, predicate, take(kind)[0])
        # /interface/turtle parse 12
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1 to /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1
        elif kind == "ANON":
            take(kind)
            emit(subject, predicate, novel())
        elif kind == "[":
            take("[")
            node = novel()
            emit(subject, predicate, node)
            predicate_object_list(node)
            take("]")
        # /interface/turtle parse 13
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/20 to /7. Parsing/7.2 RDF Term Constructors/21
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Collections/1 to /7. Parsing/7.3 RDF Triples Constructors/Collections/1
        elif kind == "(":
            node, filled = collection()
            emit(subject, predicate, node)
            if filled:
                members(node)
        # /interface/turtle parse 9
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/7 to /7. Parsing/7.2 RDF Term Constructors/12
        # RDF11-TURTLE /6. Turtle Grammar/6.4 Escape Sequences/1 to /6. Turtle Grammar/6.4 Escape Sequences/17
        elif kind in STRINGS:
            text, line = take(kind)
            lexical = STRING_ESCAPE.sub(_string_escape, text[STRINGS[kind]:-STRINGS[kind]])
            if peek() == "LANGTAG":
                emit(subject, predicate, lexical, RDF_LANG_STRING, take("LANGTAG")[0][1:])
            elif peek() == "^^":
                take("^^")
                emit(subject, predicate, lexical, iri())
            else:
                emit(subject, predicate, lexical, XSD_STRING)
        # /interface/turtle parse 10
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/13 to /7. Parsing/7.2 RDF Term Constructors/16
        else:
            text, line = take(*NUMERIC)
            emit(subject, predicate, text, NUMERIC[kind])

    def predicate_object_list(subject):
        while True:
            # /interface/turtle parse 14
            # RDF11-TURTLE /7. Parsing/7.1 Parser State/5 to /7. Parsing/7.1 Parser State/6
            # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/1 to /7. Parsing/7.3 RDF Triples Constructors/1
            if peek() == "a":
                take("a")
                predicate = RDF_TYPE
            else:
                predicate = iri()
            object(subject, predicate)
            while peek() == ",":
                take(",")
                object(subject, predicate)
            # /interface/turtle parse 1
            # RDF11-TURTLE /5. Conformance/6 to /5. Conformance/6
            # RDF11-TURTLE /6. Turtle Grammar/1 to /6. Turtle Grammar/6.2 Comments/1
            # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/1 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/26
            # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/10 to /6. Turtle Grammar/6.5 Grammar/10
            if peek() != ";":
                return
            while peek() == ";":
                take(";")
            if peek() not in VERBS:
                return

    while peek() != "end":
        kind, text, line = tokens[at]
        # /interface/turtle parse 4
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/4 to /7. Parsing/7.2 RDF Term Constructors/4
        if (kind, text) == ("LANGTAG", PREFIX_ID) or kind == "PREFIX":
            take(kind)
            prefix = take("PNAME_NS")[0][:-1]
            namespaces[prefix] = iri_reference()
            if kind == "LANGTAG":
                take(".")
        # /interface/turtle parse 3
        # RDF11-TURTLE /7. Parsing/7.1 Parser State/2 to /7. Parsing/7.1 Parser State/3
        # RDF11-TURTLE /6. Turtle Grammar/6.3 IRI References/2 to /6. Turtle Grammar/6.3 IRI References/2
        elif (kind, text) == ("LANGTAG", BASE) or kind == "BASE":
            take(kind)
            base = iri_reference(directive=True)
            if kind == "LANGTAG":
                take(".")
        # /interface/turtle parse 12
        # RDF11-TURTLE /7. Parsing/7.2 RDF Term Constructors/17 to /7. Parsing/7.2 RDF Term Constructors/19
        # RDF11-TURTLE /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1 to /7. Parsing/7.3 RDF Triples Constructors/Property Lists/1
        elif kind == "[":
            take("[")
            node = novel()
            predicate_object_list(node)
            take("]")
            if peek() != ".":
                predicate_object_list(node)
            take(".")
        # /interface/turtle parse 1
        # RDF11-TURTLE /5. Conformance/6 to /5. Conformance/6
        # RDF11-TURTLE /6. Turtle Grammar/1 to /6. Turtle Grammar/6.2 Comments/1
        # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/1 to /6. Turtle Grammar/6.5 Grammar/Productions for terminals/26
        # RDF11-TURTLE /6. Turtle Grammar/6.5 Grammar/10 to /6. Turtle Grammar/6.5 Grammar/10
        else:
            predicate_object_list(subject())
            take(".")
    return triples
