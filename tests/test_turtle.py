import unittest

from liv import turtle

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
XSD = "http://www.w3.org/2001/XMLSchema#"


class TestTurtle(unittest.TestCase):
    def refusal(self, document):
        with self.assertRaises(ValueError) as refusal:
            turtle.parse(document)
        return str(refusal.exception)

    def test_parse_1(self):
        self.assertEqual(
            turtle.parse('<http://a> <http://p> "x" .'),
            [{"subject": "http://a", "predicate": "http://p", "object": "x", "datatype IRI": XSD + "string", "language tag": ""}],
        )

    def test_parse_2(self):
        self.assertEqual(
            [(t["subject"], t["predicate"], t["object"]) for t in turtle.parse("@prefix ex: <http://e/> . ex:a ex:p ex:o .")],
            [("http://e/a", "http://e/p", "http://e/o")],
        )

    def test_parse_3(self):
        self.assertEqual(
            [(t["subject"], t["object"]) for t in turtle.parse("@base <http://e/a/b> . <../c> <http://p> <d> .")],
            [("http://e/c", "http://e/a/d")],
        )

    def test_parse_4(self):
        self.assertEqual(
            [t["subject"] for t in turtle.parse("@prefix : <http://e/> . :a\\.b :p :o .")],
            ["http://e/a.b"],
        )

    def test_parse_5(self):
        self.assertEqual(self.refusal("x:a <http://p> <http://o> ."), "no namespace x")

    def test_parse_6(self):
        self.assertEqual(
            [(t["object"], t["datatype IRI"], t["language tag"]) for t in turtle.parse('<http://a> <http://p> """x\\ny"""@en .')],
            [("x\ny", RDF + "langString", "en")],
        )

    def test_parse_7(self):
        self.assertEqual(
            [(t["object"], t["datatype IRI"]) for t in turtle.parse("<http://a> <http://p> 4, 4.5, true .")],
            [("4", XSD + "integer"), ("4.5", XSD + "decimal"), ("true", XSD + "boolean")],
        )

    def test_parse_8(self):
        triples = turtle.parse("<http://a> a <http://C> ; <http://p> <http://o>, <http://q> .")
        self.assertEqual(
            ([t["subject"] for t in triples], triples[0]["predicate"]),
            (["http://a", "http://a", "http://a"], RDF + "type"),
        )

    def test_parse_9(self):
        triples = turtle.parse("_:b <http://p> [ <http://q> <http://o> ] .")
        node = [t["object"] for t in triples if t["subject"] == "_:b"][0]
        self.assertEqual(
            (sorted((t["subject"], t["predicate"], t["object"]) for t in triples), node[:2], node != "_:b"),
            (sorted([("_:b", "http://p", node), (node, "http://q", "http://o")]), "_:", True),
        )

    def test_parse_10(self):
        triples = turtle.parse("<http://a> <http://p> ( <http://x> ) .")
        node = [t["object"] for t in triples if t["subject"] == "http://a"][0]
        self.assertEqual(
            (sorted((t["subject"], t["predicate"], t["object"]) for t in triples), node[:2]),
            (
                sorted([("http://a", "http://p", node), (node, RDF + "first", "http://x"), (node, RDF + "rest", RDF + "nil")]),
                "_:",
            ),
        )

    def test_parse_11(self):
        self.assertEqual(self.refusal("<http://a> <http://p> ."), "not Turtle 1")

    def test_parse_12(self):
        self.assertEqual(self.refusal("<p> <http://p> <http://o> ."), "not an absolute IRI 1")
