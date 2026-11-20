import decimal
import hashlib
import unittest

from liv import mtsv, relations, sparql, utility

XSD = "http://www.w3.org/2001/XMLSchema#"
RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
LANG = RDF + "langString"
TRUE = ("true", XSD + "boolean", "")
FALSE = ("false", XSD + "boolean", "")
NOW = "2026-11-19T09:00:00Z"
TIME = "2011-01-10T14:45:13.815-05:00"


def iri(value):
    return (value, "", "")


def string(value):
    return (value, XSD + "string", "")


def integer(value):
    return (str(value), XSD + "integer", "")


def typed(value, name):
    return (value, XSD + name, "")


def row(subject, predicate, object, graph="g1", datatype="", language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": datatype, "language tag": language, "graph name": graph}


def call(name, *arguments, labels=None):
    return utility.functions(name, list(arguments), now=NOW, labels={} if labels is None else labels)


def run(query, dataset):
    return utility.eval(sparql.parse(query), dataset, NOW)


def values(solutions, name):
    return sorted(solution[name][0] for solution in solutions if name in solution)


A, P, Q, B, C = "http://e/a", "http://e/p", "http://e/q", "http://e/b", "http://e/c"
E = "http://e/"


class TestUtility(unittest.TestCase):
    def test_ebv_1(self):
        self.assertEqual(utility.ebv(("abc", XSD + "integer", "")), False)

    def test_ebv_2(self):
        self.assertEqual(utility.ebv(TRUE), True)

    def test_ebv_3(self):
        self.assertEqual([utility.ebv(string("")), utility.ebv(string("a"))], [False, True])

    def test_ebv_4(self):
        self.assertEqual([utility.ebv(integer(0)), utility.ebv(typed("2.5", "decimal"))], [False, True])

    def test_ebv_5(self):
        self.assertEqual(utility.ebv(iri(A)), None)

    def operator(self, operator, *operands):
        return utility.operators(operator, list(operands))

    def test_operators_1(self):
        self.assertEqual(self.operator("!", TRUE), FALSE)

    def test_operators_2(self):
        self.assertEqual(self.operator("+", integer(1)), integer(1))

    def test_operators_3(self):
        self.assertEqual(self.operator("-", integer(1)), integer(-1))

    def test_operators_4(self):
        self.assertEqual(self.operator("||", TRUE, FALSE), TRUE)

    def test_operators_5(self):
        self.assertEqual(self.operator("&&", TRUE, FALSE), FALSE)

    def test_operators_6(self):
        self.assertEqual(self.operator("=", integer(1), integer(2)), FALSE)

    def test_operators_7(self):
        self.assertEqual(self.operator("=", string("a"), string("b")), FALSE)

    def test_operators_8(self):
        self.assertEqual(self.operator("=", string("a"), string("b")), FALSE)

    def test_operators_9(self):
        self.assertEqual(self.operator("=", TRUE, FALSE), FALSE)

    def test_operators_10(self):
        self.assertEqual(
            [self.operator("=", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator("=", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T00:00:00Z", "dateTime"))],
            [FALSE, TRUE],
        )

    def test_operators_11(self):
        self.assertEqual(self.operator("!=", integer(1), integer(2)), TRUE)

    def test_operators_12(self):
        self.assertEqual(self.operator("!=", string("a"), string("b")), TRUE)

    def test_operators_13(self):
        self.assertEqual(self.operator("!=", string("a"), string("b")), TRUE)

    def test_operators_14(self):
        self.assertEqual(self.operator("!=", TRUE, FALSE), TRUE)

    def test_operators_15(self):
        self.assertEqual(
            [self.operator("!=", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator("!=", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T00:00:00Z", "dateTime"))],
            [TRUE, FALSE],
        )

    def test_operators_16(self):
        self.assertEqual(self.operator("<", integer(1), integer(2)), TRUE)

    def test_operators_17(self):
        self.assertEqual(self.operator("<", string("a"), string("b")), TRUE)

    def test_operators_18(self):
        self.assertEqual(self.operator("<", string("a"), string("b")), TRUE)

    def test_operators_19(self):
        self.assertEqual(self.operator("<", TRUE, FALSE), FALSE)

    def test_operators_20(self):
        self.assertEqual(
            [self.operator("<", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator("<", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T01:00:00+02:00", "dateTime"))],
            [TRUE, FALSE],
        )

    def test_operators_21(self):
        self.assertEqual(self.operator(">", integer(1), integer(2)), FALSE)

    def test_operators_22(self):
        self.assertEqual(self.operator(">", string("a"), string("b")), FALSE)

    def test_operators_23(self):
        self.assertEqual(self.operator(">", string("a"), string("b")), FALSE)

    def test_operators_24(self):
        self.assertEqual(self.operator(">", TRUE, FALSE), TRUE)

    def test_operators_25(self):
        self.assertEqual(
            [self.operator(">", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator(">", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T01:00:00+02:00", "dateTime"))],
            [FALSE, TRUE],
        )

    def test_operators_26(self):
        self.assertEqual(self.operator("<=", integer(1), integer(2)), TRUE)

    def test_operators_27(self):
        self.assertEqual(self.operator("<=", string("a"), string("b")), TRUE)

    def test_operators_28(self):
        self.assertEqual(self.operator("<=", string("a"), string("b")), TRUE)

    def test_operators_29(self):
        self.assertEqual(self.operator("<=", TRUE, FALSE), FALSE)

    def test_operators_30(self):
        self.assertEqual(
            [self.operator("<=", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator("<=", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T00:00:00Z", "dateTime"))],
            [TRUE, TRUE],
        )

    def test_operators_31(self):
        self.assertEqual(self.operator(">=", integer(1), integer(2)), FALSE)

    def test_operators_32(self):
        self.assertEqual(self.operator(">=", string("a"), string("b")), FALSE)

    def test_operators_33(self):
        self.assertEqual(self.operator(">=", string("a"), string("b")), FALSE)

    def test_operators_34(self):
        self.assertEqual(self.operator(">=", TRUE, FALSE), TRUE)

    def test_operators_35(self):
        self.assertEqual(
            [self.operator(">=", typed("2026-01-01T00:00:00Z", "dateTime"), typed("2026-01-02T00:00:00Z", "dateTime")), self.operator(">=", typed("2026-01-01T00:00:00", "dateTime"), typed("2026-01-01T01:00:00+02:00", "dateTime"))],
            [FALSE, TRUE],
        )

    def test_operators_36(self):
        self.assertEqual(self.operator("*", integer(1), integer(2)), integer(2))

    def test_operators_37(self):
        self.assertEqual(self.operator("/", integer(1), integer(2)), typed("0.5", "decimal"))

    def test_operators_38(self):
        self.assertEqual(self.operator("+", integer(1), integer(2)), integer(3))

    def test_operators_39(self):
        self.assertEqual(self.operator("-", integer(1), integer(2)), integer(-1))

    def test_operators_40(self):
        self.assertEqual(self.operator("=", iri(A), iri(A)), TRUE)

    def test_operators_41(self):
        self.assertEqual(self.operator("!=", iri(A), iri(A)), FALSE)

    def test_functions_1(self):
        self.assertEqual([call("BOUND", integer(1)), call("BOUND", None)], [TRUE, FALSE])

    def test_functions_2(self):
        self.assertEqual(call("IF", TRUE, string("yes"), string("no")), string("yes"))

    def test_functions_3(self):
        self.assertEqual(call("COALESCE", integer(2), None), integer(2))

    def test_functions_4(self):
        self.assertEqual(call("logical-or", TRUE, FALSE), TRUE)

    def test_functions_5(self):
        self.assertEqual(call("logical-and", TRUE, FALSE), FALSE)

    def test_functions_6(self):
        self.assertEqual(call("RDFterm-equal", iri(A), iri(A)), TRUE)

    def test_functions_7(self):
        self.assertEqual(call("sameTerm", integer(1), ("01", XSD + "integer", "")), FALSE)

    def test_functions_8(self):
        self.assertEqual(call("IN", integer(2), integer(1), integer(2), integer(3)), TRUE)

    def test_functions_9(self):
        self.assertEqual(call("NOT IN", integer(2), integer(1), integer(2), integer(3)), FALSE)

    def test_functions_10(self):
        self.assertEqual(call("isIRI", iri(A)), TRUE)

    def test_functions_11(self):
        self.assertEqual(call("isBlank", iri("_:b")), TRUE)

    def test_functions_12(self):
        self.assertEqual(call("isLiteral", string("x")), TRUE)

    def test_functions_13(self):
        self.assertEqual(call("isNumeric", integer(12)), TRUE)

    def test_functions_14(self):
        self.assertEqual(call("str", iri(A)), string(A))

    def test_functions_15(self):
        self.assertEqual(call("lang", ("chat", LANG, "en")), string("en"))

    def test_functions_16(self):
        self.assertEqual(call("datatype", integer(1)), iri(XSD + "integer"))

    def test_functions_17(self):
        self.assertEqual(call("IRI", string("http://example/")), iri("http://example/"))

    def test_functions_18(self):
        labels = {}
        first, second = call("BNODE", labels=labels), call("BNODE", labels=labels)
        self.assertEqual([first[0].startswith("_:"), second[0].startswith("_:"), first == second], [True, True, False])

    def test_functions_19(self):
        self.assertEqual(call("STRDT", string("123"), iri(XSD + "integer")), ("123", XSD + "integer", ""))

    def test_functions_20(self):
        self.assertEqual(call("STRLANG", string("chat"), string("en")), ("chat", LANG, "en"))

    def test_functions_21(self):
        first, second = call("UUID"), call("UUID")
        self.assertEqual([first[0][:9], first[0][23], first == second], ["urn:uuid:", "4", False])

    def test_functions_22(self):
        first, second = call("STRUUID"), call("STRUUID")
        self.assertEqual([len(first[0]), first[0][14], first == second], [36, "4", False])

    def test_functions_23(self):
        self.assertEqual(call("strlen", string("chat")), integer(4))

    def test_functions_24(self):
        self.assertEqual(call("substr", string("foobar"), integer(4)), string("bar"))

    def test_functions_25(self):
        self.assertEqual(call("ucase", string("foo")), string("FOO"))

    def test_functions_26(self):
        self.assertEqual(call("lcase", string("BAR")), string("bar"))

    def test_functions_27(self):
        self.assertEqual(call("strStarts", string("foobar"), string("foo")), TRUE)

    def test_functions_28(self):
        self.assertEqual(call("strEnds", string("foobar"), string("bar")), TRUE)

    def test_functions_29(self):
        self.assertEqual(call("contains", string("foobar"), string("bar")), TRUE)

    def test_functions_30(self):
        self.assertEqual(call("strbefore", string("abc"), string("b")), string("a"))

    def test_functions_31(self):
        self.assertEqual(call("strafter", string("abc"), string("b")), string("c"))

    def test_functions_32(self):
        self.assertEqual(call("encode_for_uri", string("Los Angeles")), string("Los%20Angeles"))

    def test_functions_33(self):
        self.assertEqual(call("concat", string("foo"), string("bar")), string("foobar"))

    def test_functions_34(self):
        self.assertEqual(call("langMatches", string("en-US"), string("en")), TRUE)

    def test_functions_35(self):
        self.assertEqual(call("REGEX", string("Alice"), string("^ali"), string("i")), TRUE)

    def test_functions_36(self):
        self.assertEqual(call("replace", string("abcd"), string("b"), string("Z")), string("aZcd"))

    def test_functions_37(self):
        self.assertEqual(call("abs", integer(-1)), integer(1))

    def test_functions_38(self):
        self.assertEqual(call("round", typed("2.4999", "decimal")), typed("2", "decimal"))

    def test_functions_39(self):
        self.assertEqual(call("ceil", typed("10.5", "decimal")), typed("11", "decimal"))

    def test_functions_40(self):
        self.assertEqual(call("floor", typed("10.5", "decimal")), typed("10", "decimal"))

    def test_functions_41(self):
        first, second = call("RAND"), call("RAND")
        numbers = [float(first[0]), float(second[0])]
        self.assertEqual([first[1], second[1], all(0 <= number < 1 for number in numbers)], [XSD + "double", XSD + "double", True])

    def test_functions_42(self):
        self.assertEqual([call("now"), call("now")], [typed(NOW, "dateTime"), typed(NOW, "dateTime")])

    def test_functions_43(self):
        self.assertEqual(call("year", typed(TIME, "dateTime")), integer(2011))

    def test_functions_44(self):
        self.assertEqual(call("month", typed(TIME, "dateTime")), integer(1))

    def test_functions_45(self):
        self.assertEqual(call("day", typed(TIME, "dateTime")), integer(10))

    def test_functions_46(self):
        self.assertEqual(call("hours", typed(TIME, "dateTime")), integer(14))

    def test_functions_47(self):
        self.assertEqual(call("minutes", typed(TIME, "dateTime")), integer(45))

    def test_functions_48(self):
        self.assertEqual(call("seconds", typed(TIME, "dateTime")), typed("13.815", "decimal"))

    def test_functions_49(self):
        self.assertEqual(call("timezone", typed(TIME, "dateTime")), typed("-PT5H", "dayTimeDuration"))

    def test_functions_50(self):
        self.assertEqual(call("tz", typed(TIME, "dateTime")), string("-05:00"))

    def test_functions_51(self):
        self.assertEqual(call("MD5", string("abc")), string("900150983cd24fb0d6963f7d28e17f72"))

    def test_functions_52(self):
        self.assertEqual(call("SHA1", string("abc")), string("a9993e364706816aba3e25717850c26c9cd0d89d"))

    def test_functions_53(self):
        self.assertEqual(call("SHA256", string("abc")), string("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"))

    def test_functions_54(self):
        self.assertEqual(call("SHA384", string("abc")), string(hashlib.sha384(b"abc").hexdigest()))

    def test_functions_55(self):
        self.assertEqual(call("SHA512", string("abc")), string(hashlib.sha512(b"abc").hexdigest()))

    def test_functions_56(self):
        self.assertEqual(call("strlen", iri(A)), None)

    def test_functions_57(self):
        self.assertEqual(call("contains", ("abc", LANG, "en"), ("b", LANG, "fr")), None)

    def test_functions_58(self):
        self.assertEqual(call("ucase", ("foo", LANG, "en")), ("FOO", LANG, "en"))

    def test_casts_1(self):
        self.assertEqual(utility.casts(XSD + "string", iri(A)), string(A))

    def test_casts_2(self):
        self.assertEqual(utility.casts(XSD + "float", string("1.5")), typed("1.5E0", "float"))

    def test_casts_3(self):
        self.assertEqual(utility.casts(XSD + "double", integer(1)), typed("1.0E0", "double"))

    def test_casts_4(self):
        self.assertEqual(utility.casts(XSD + "decimal", string("2.50")), typed("2.5", "decimal"))

    def test_casts_5(self):
        self.assertEqual([utility.casts(XSD + "integer", string("12")), utility.casts(XSD + "integer", string("abc"))], [integer(12), None])

    def test_casts_6(self):
        self.assertEqual(utility.casts(XSD + "dateTime", string("2026-01-01T00:00:00Z")), typed("2026-01-01T00:00:00Z", "dateTime"))

    def test_casts_7(self):
        self.assertEqual([utility.casts(XSD + "boolean", string("1")), utility.casts(XSD + "boolean", integer(0))], [TRUE, FALSE])

    def test_match_1(self):
        rows = [row(E + "m", E + "p", E + "o"), row(E + "a", E + "p", E + "m")]
        self.assertEqual(utility.match(rows, {"subject": E + "m"}), [rows[0]])

    def path(self, rows, start, expression, end):
        return values(utility.path(rows, start, expression, end), end[1:])

    def test_path_1(self):
        self.assertEqual(self.path([row(E + "a", E + "p", E + "b")], E + "a", ["link", iri(E + "p")], "?y"), [E + "b"])

    def test_path_2(self):
        self.assertEqual(self.path([row(E + "a", E + "p", E + "b")], E + "b", ["inv", ["link", iri(E + "p")]], "?y"), [E + "a"])

    def test_path_3(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "b", E + "q", E + "c")]
        self.assertEqual(self.path(rows, E + "a", ["seq", ["link", iri(E + "p")], ["link", iri(E + "q")]], "?y"), [E + "c"])

    def test_path_4(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "a", E + "q", E + "c")]
        self.assertEqual(self.path(rows, E + "a", ["alt", ["link", iri(E + "p")], ["link", iri(E + "q")]], "?y"), [E + "b", E + "c"])

    def test_path_5(self):
        self.assertEqual(self.path([row(E + "a", E + "p", E + "b")], E + "a", ["ZeroOrOnePath", ["link", iri(E + "p")]], "?y"), [E + "a", E + "b"])

    def test_path_6(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "b", E + "p", E + "c")]
        self.assertEqual(self.path(rows, E + "a", ["ZeroOrMorePath", ["link", iri(E + "p")]], "?y"), [E + "a", E + "b", E + "c"])

    def test_path_7(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "b", E + "p", E + "c")]
        self.assertEqual(self.path(rows, E + "a", ["OneOrMorePath", ["link", iri(E + "p")]], "?y"), [E + "b", E + "c"])

    def test_path_8(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "a", E + "q", E + "c")]
        self.assertEqual(self.path(rows, E + "a", ["NPS", [iri(E + "p")]], "?y"), [E + "c"])

    def test_filter_1(self):
        self.assertEqual(utility.filter([{"x": integer(1)}, {"x": integer(2)}], [False, True]), [{"x": integer(2)}])

    def test_join_1(self):
        entities = [{"entity": E + "e1", "activity": E + "a1"}, {"entity": E + "e2", "activity": E + "a2"}]
        words = [{"entity": E + "e1", "text": "hi"}]
        self.assertEqual(utility.join(entities, words), [{"entity": E + "e1", "activity": E + "a1", "text": "hi"}])

    def test_left_join_1(self):
        first = [{"x": integer(1)}, {"x": integer(2)}]
        joined = [{"x": integer(1), "y": integer(3)}]
        self.assertEqual(utility.left_join(first, joined, [True]), [{"x": integer(1), "y": integer(3)}, {"x": integer(2)}])

    def test_union_1(self):
        self.assertEqual(utility.union([{"a": "a"}], [{"b": "b"}]), [{"a": "a"}, {"b": "b"}])

    def test_minus_1(self):
        things = [{"concept": E + "a"}, {"concept": E + "b"}, {"concept": E + "c"}]
        self.assertEqual(utility.minus(things, [{"concept": E + "b"}]), [{"concept": E + "a"}, {"concept": E + "c"}])

    def test_extend_1(self):
        self.assertEqual(utility.extend([{"x": integer(1)}], "y", [integer(2)]), [{"x": integer(1), "y": integer(2)}])

    def test_extend_2(self):
        self.assertEqual(utility.extend([{"x": integer(1)}], "y", [None]), [{"x": integer(1)}])

    def test_order_1(self):
        rows = [{"count": 1}, {"count": 2}]
        self.assertEqual([found["count"] for found in utility.order(rows, [("count", "integer")], [], [["count", "DESC"]])], [2, 1])

    def test_order_2(self):
        rows = [{"Sheet": 10, "sheet name": "s"}, {"Sheet": 2, "sheet name": "t"}]
        self.assertEqual([found["Sheet"] for found in utility.order(rows, mtsv.SHEETS, mtsv.SHEETS_KEY, [])], [2, 10])

    def test_order_3(self):
        rows = [{"x": "b"}, {"x": "a"}]
        self.assertEqual([found["x"] for found in utility.order(rows, [("x", "string")], ["x"], [])], ["a", "b"])

    def test_order_4(self):
        rows = [{"v": string("b")}, {"v": iri(A)}, {}]
        self.assertEqual(utility.order(rows, None, None, [["v", "ASC"]]), [{}, {"v": iri(A)}, {"v": string("b")}])

    def counted(self, rows, function, distinct=False, separator=" ", columns=None):
        return utility.aggregate(rows, None, [] if columns is None else columns, [{"name": function, "column": "v", "distinct": distinct, "separator": separator, "result": "r"}])

    def test_aggregate_1(self):
        rows = [row(E + "m", E + "p", E + "o", E + "g1"), row(E + "m", E + "p", E + "o", E + "g2"), row(E + "n", E + "p", E + "o", E + "g1")]
        self.assertEqual(
            [utility.aggregate(rows, relations.DATASET, ["subject"], []), utility.aggregate([], relations.DATASET, [], [])],
            [[{"subject": E + "m"}, {"subject": E + "n"}], [{}]],
        )

    def test_aggregate_2(self):
        rows = [row(E + "m", E + "p", E + "o", E + "g1"), row(E + "m", E + "p", E + "o", E + "g2"), row(E + "m", E + "p", E + "o", E + "g2")]
        function = {"name": "Count", "column": "graph name", "distinct": True, "separator": " ", "result": "count"}
        self.assertEqual(utility.aggregate(rows, relations.DATASET, ["subject"], [function]), [{"subject": E + "m", "count": 2}])

    def test_aggregate_3(self):
        rows = [{"concept": E + "m", "time": ""}]
        function = {"name": "Max", "column": "time", "distinct": False, "separator": " ", "result": "last"}
        self.assertEqual(utility.aggregate(rows, [("concept", "iri"), ("time", "time")], ["concept"], [function]), [{"concept": E + "m", "last": ""}])

    def test_aggregate_4(self):
        rows = [{"v": integer(1)}, {"v": integer(2)}]
        self.assertEqual(utility.aggregate(rows, None, [], [{"name": "Count", "column": "*", "distinct": False, "separator": " ", "result": "r"}]), [{"r": 2}])

    def test_aggregate_5(self):
        self.assertEqual(self.counted([{"v": integer(1)}, {"v": integer(2)}], "Sum"), [{"r": integer(3)}])

    def test_aggregate_6(self):
        self.assertEqual(self.counted([{"v": integer(1)}, {"v": integer(2)}], "Avg"), [{"r": typed("1.5", "decimal")}])

    def test_aggregate_7(self):
        self.assertEqual(self.counted([{"v": integer(1)}, {"v": integer(2)}], "Min"), [{"r": integer(1)}])

    def test_aggregate_8(self):
        rows = [
            {"entity": E + "e1", "activity": E + "m", "agent": "", "time": "2026-11-10T09:00:00Z"},
            {"entity": E + "e2", "activity": E + "m", "agent": "", "time": "2026-11-11T09:00:00Z"},
        ]
        function = {"name": "Max", "column": "time", "distinct": False, "separator": " ", "result": "last"}
        self.assertEqual(utility.aggregate(rows, relations.ENTITIES, ["activity"], [function]), [{"activity": E + "m", "last": "2026-11-11T09:00:00Z"}])

    def test_aggregate_9(self):
        self.assertEqual(self.counted([{"v": string("a")}, {"v": string("b")}], "GroupConcat", separator=","), [{"r": string("a,b")}])

    def test_aggregate_10(self):
        self.assertEqual(self.counted([{"v": string("a")}], "Sample"), [{"r": string("a")}])

    def test_project_1(self):
        self.assertEqual(utility.project([{"x": integer(1), "y": integer(2)}], ["x"]), [{"x": integer(1)}])

    def test_distinct_1(self):
        self.assertEqual(utility.distinct([{"x": integer(1)}, {"x": integer(1)}, {"x": integer(2)}]), [{"x": integer(1)}, {"x": integer(2)}])

    def test_reduced_1(self):
        self.assertEqual(utility.reduced([{"x": integer(1)}, {"x": integer(1)}]), [{"x": integer(1)}, {"x": integer(1)}])

    def test_slice_1(self):
        self.assertEqual(utility.slice(list(range(1, 61)), 50, 60), list(range(51, 61)))

    def test_slice_2(self):
        self.assertEqual(utility.slice(list(range(1, 61)), 0, 50), list(range(1, 51)))

    def test_eval_1(self):
        both = run("SELECT * { ?s ?p ?o }", [row(E + "a", E + "p", E + "b", E + "g1"), row(E + "b", E + "p", E + "c", E + "g2")])
        once = run("SELECT * { ?s ?p ?o }", [row(E + "a", E + "p", E + "b", E + "g1"), row(E + "a", E + "p", E + "b", E + "g2")])
        self.assertEqual([len(both), len(once)], [2, 1])

    def test_eval_2(self):
        bound = run("SELECT ?y { BIND(2 AS ?x) BIND(?x + 1 AS ?y) }", [])
        unbound = run("SELECT ?y { BIND(?z + 1 AS ?y) }", [])
        self.assertEqual([bound, unbound], [[{"y": integer(3)}], [{}]])

    def test_eval_3(self):
        self.assertEqual(run("SELECT * { ?s <http://e/p> ?o }", [row(E + "a", E + "p", E + "b")]), [{"s": iri(E + "a"), "o": iri(E + "b")}])

    def test_eval_4(self):
        self.assertEqual(values(run("SELECT * { <http://e/a> <http://e/p>* ?o }", [row(E + "a", E + "p", E + "b")]), "o"), [E + "a", E + "b"])

    def test_eval_5(self):
        self.assertEqual(run("SELECT ?x { VALUES ?x { 1 2 } FILTER(?x > 1) }", []), [{"x": integer(2)}])

    def test_eval_6(self):
        found = run("SELECT ?s { VALUES ?s { <http://e/a> <http://e/c> } FILTER EXISTS { ?s <http://e/p> ?o } }", [row(E + "a", E + "p", E + "b")])
        self.assertEqual(found, [{"s": iri(E + "a")}])

    def test_eval_7(self):
        found = run("SELECT ?x { VALUES ?x { <http://e/a> } FILTER EXISTS { ?x <http://e/p> ?y } }", [row(E + "a", E + "p", E + "b")])
        self.assertEqual(found, [{"x": iri(E + "a")}])

    def test_eval_8(self):
        found = run("SELECT * { ?x <http://e/p> ?y . ?y <http://e/q> ?z }", [row(E + "a", E + "p", E + "b"), row(E + "b", E + "q", E + "c")])
        self.assertEqual(found, [{"x": iri(E + "a"), "y": iri(E + "b"), "z": iri(E + "c")}])

    def test_eval_9(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "b", E + "q", E + "c"), row(E + "c", E + "p", E + "a")]
        found = run("SELECT * { ?x <http://e/p> ?y OPTIONAL { ?y <http://e/q> ?z } }", rows)
        self.assertEqual(sorted(len(solution) for solution in found), [2, 3])

    def test_eval_10(self):
        found = run("SELECT * { { ?x <http://e/p> ?y } UNION { ?x <http://e/q> ?y } }", [row(E + "a", E + "p", E + "b"), row(E + "b", E + "q", E + "c")])
        self.assertEqual(len(found), 2)

    def test_eval_11(self):
        rows = [row(E + "a", E + "p", E + "b"), row(E + "b", E + "p", E + "c"), row(E + "b", E + "q", E + "c")]
        found = run("SELECT * { ?x <http://e/p> ?y MINUS { ?x <http://e/q> ?z } }", rows)
        self.assertEqual(found, [{"x": iri(E + "a"), "y": iri(E + "b")}])

    def test_eval_12(self):
        found = run("SELECT * { GRAPH ?g { ?s ?p ?o } }", [row(E + "a", E + "p", E + "b", E + "g1")])
        self.assertEqual(found, [{"s": iri(E + "a"), "p": iri(E + "p"), "o": iri(E + "b"), "g": iri(E + "g1")}])

    def test_eval_13(self):
        found = run("SELECT ?s { ?s ?p ?o } GROUP BY ?s", [row(A, P, B), row(A, Q, C), row(B, P, C)])
        empty = run("SELECT (COUNT(*) AS ?n) { ?s ?p ?o }", [])
        self.assertEqual([values(found, "s"), empty], [[A, B], [{"n": integer(0)}]])

    def test_eval_14(self):
        found = run("SELECT ?s (COUNT(?o) AS ?n) { ?s ?p ?o } GROUP BY ?s", [row(A, P, B), row(A, Q, C), row(B, P, C)])
        self.assertEqual(sorted((solution["s"][0], solution["n"][0]) for solution in found), [(A, "2"), (B, "1")])

    def test_eval_15(self):
        found = run("SELECT ?s (COUNT(?o) AS ?n) (MAX(?o) AS ?m) { ?s ?p ?o } GROUP BY ?s", [row(A, P, B), row(A, Q, C)])
        self.assertEqual(found, [{"s": iri(A), "n": integer(2), "m": iri(C)}])

    def test_eval_16(self):
        self.assertEqual(run("SELECT * { ?s ?p ?o BIND(1 AS ?x) }", [row(A, P, B)])[0]["x"], integer(1))

    def test_eval_17(self):
        self.assertEqual(run("SELECT * { ?s ?p ?o }", [row(A, P, B)]), [{"s": iri(A), "p": iri(P), "o": iri(B)}])

    def test_eval_18(self):
        self.assertEqual(run("SELECT * { VALUES ?x { 1 1 } }", []), [{"x": integer(1)}, {"x": integer(1)}])

    def test_eval_19(self):
        self.assertEqual(run("SELECT ?x { VALUES ?x { 1 3 2 } } ORDER BY DESC(?x)", []), [{"x": integer(3)}, {"x": integer(2)}, {"x": integer(1)}])

    def test_eval_20(self):
        self.assertEqual(run("SELECT ?x { VALUES (?x ?y) { (1 2) } }", []), [{"x": integer(1)}])

    def test_eval_21(self):
        self.assertEqual(run("SELECT DISTINCT ?x { VALUES ?x { 1 1 } }", []), [{"x": integer(1)}])

    def test_eval_22(self):
        self.assertEqual(run("SELECT REDUCED ?x { VALUES ?x { 1 1 } }", []), [{"x": integer(1)}, {"x": integer(1)}])

    def test_eval_23(self):
        self.assertEqual(run("SELECT ?x { VALUES ?x { 1 2 3 } } OFFSET 1 LIMIT 1", []), [{"x": integer(2)}])

    def test_construct_1(self):
        triples = utility.construct([["?s", iri(E + "p"), "?o"]], [{"s": iri(E + "a"), "o": iri(E + "b")}])
        self.assertEqual(triples, [{"subject": E + "a", "predicate": E + "p", "object": E + "b", "datatype IRI": "", "language tag": ""}])

    def test_construct_2(self):
        triples = utility.construct([[iri("_:b"), iri(E + "p"), "?o"]], [{"o": integer(1)}, {"o": integer(2)}])
        self.assertEqual([len(triples), triples[0]["subject"] != triples[1]["subject"]], [2, True])

    def test_construct_3(self):
        self.assertEqual(utility.construct([["?s", iri(E + "p"), "?x"]], [{"s": iri(E + "a")}]), [])

    def test_ask_1(self):
        self.assertEqual(utility.ask([]), [{"boolean": False}])

    def test_describe_1(self):
        rows = [row(E + "m", E + "p", E + "o", E + "g1"), row(E + "a", E + "p", E + "m", E + "g2")]
        self.assertEqual(utility.describe(rows, [E + "m"]), rows)
