import unittest

from liv import turtle

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
XSD = "http://www.w3.org/2001/XMLSchema#"


def triple(subject, predicate, object, datatype="", language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": datatype, "language tag": language}


class TestTurtle(unittest.TestCase):
    def refusal(self, document):
        with self.assertRaises(ValueError) as refused:
            turtle.parse(document)
        return str(refused.exception)

    def test_parse_1(self):
        self.assertEqual(turtle.parse('<http://a> <http://p> "x" .'), [triple("http://a", "http://p", "x", XSD + "string")])

    def test_parse_2(self):
        self.assertEqual(self.refusal("<http://a> <http://p> ."), "not Turtle 1")

    def test_parse_3(self):
        triples = turtle.parse("@base <http://e/> . BASE <a/> <b> <http://p> <c> .")
        self.assertEqual([triples[0]["subject"], triples[0]["object"]], ["http://e/a/b", "http://e/a/c"])

    def test_parse_4(self):
        self.assertEqual(turtle.parse("@prefix ex: <http://e/> . ex:a ex:p ex:o ."), [triple("http://e/a", "http://e/p", "http://e/o")])

    def test_parse_5(self):
        triples = turtle.parse("@base <http://e/a/b> . <../c> <http://p> <d> .")
        self.assertEqual([triples[0]["subject"], triples[0]["object"]], ["http://e/c", "http://e/a/d"])

    def test_parse_6(self):
        self.assertEqual(self.refusal("<p> <http://p> <http://o> ."), "not an absolute IRI 1")

    def test_parse_7(self):
        self.assertEqual(turtle.parse("@prefix : <http://e/> . :a\\.b :p :o .")[0]["subject"], "http://e/a.b")

    def test_parse_8(self):
        self.assertEqual(self.refusal("x:a <http://p> <http://o> ."), "no namespace x")

    def test_parse_9(self):
        triples = turtle.parse('<http://a> <http://p> """x\\ny"""@en .')
        self.assertEqual(triples, [triple("http://a", "http://p", "x\ny", RDF + "langString", "en")])

    def test_parse_10(self):
        triples = turtle.parse("<http://a> <http://p> 4, 4.5, true .")
        self.assertEqual(
            [(row["object"], row["datatype IRI"]) for row in triples],
            [("4", XSD + "integer"), ("4.5", XSD + "decimal"), ("true", XSD + "boolean")],
        )

    def test_parse_11(self):
        self.assertEqual(turtle.parse("_:b <http://p> _:b ."), [triple("_:b", "http://p", "_:b")])

    def test_parse_12(self):
        triples = turtle.parse("_:b <http://p> [ <http://q> <http://o> ] .")
        node = triples[0]["object"]
        self.assertEqual(
            sorted(map(lambda row: tuple(row.values()), triples)),
            sorted([("_:b", "http://p", node, "", ""), (node, "http://q", "http://o", "", "")]),
        )
        self.assertNotEqual(node, "_:b")

    def test_parse_13(self):
        triples = turtle.parse("<http://a> <http://p> ( <http://x> ) .")
        node = triples[0]["object"]
        self.assertEqual(
            sorted(map(lambda row: tuple(row.values()), triples)),
            sorted([("http://a", "http://p", node, "", ""), (node, RDF + "first", "http://x", "", ""), (node, RDF + "rest", RDF + "nil", "", "")]),
        )

    def test_parse_14(self):
        triples = turtle.parse("<http://a> a <http://C> ; <http://p> <http://o>, <http://q> .")
        self.assertEqual([len(triples), {row["subject"] for row in triples}, triples[0]["predicate"]], [3, {"http://a"}, RDF + "type"])
