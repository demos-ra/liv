import os
import tempfile
import unittest

from liv import banker, find, relations

SKOS = "http://www.w3.org/2004/02/skos/core#"


def row(subject, predicate, object, language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": "", "language tag": language, "graph name": "urn:uuid:g"}


class TestFind(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = self.temporary.name

    def tearDown(self):
        self.temporary.cleanup()

    def keep(self, *rows):
        banker.insert(os.path.join(self.directory, "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], list(rows))

    def refusal(self, args):
        with self.assertRaises(ValueError) as refused:
            find.find(self.directory, args)
        return str(refused.exception)

    def test_find_1(self):
        self.keep(row("http://m", SKOS + "altLabel", "Mike", "en"))
        banker.insert(
            os.path.join(self.directory, "entities.mtsv"),
            "entities",
            [column for column, _ in relations.ENTITIES],
            [
                {"entity": "urn:uuid:e1", "activity": "urn:uuid:a1", "agent": "http://www.w3.org/ns/prov#Person", "time": "2026-11-09T09:00:00Z"},
                {"entity": "urn:uuid:e2", "activity": "urn:uuid:a2", "agent": "http://www.w3.org/ns/prov#Person", "time": "2026-11-11T09:00:00Z"},
            ],
        )
        banker.insert(
            os.path.join(self.directory, "words.mtsv"),
            "words",
            [column for column, _ in relations.WORDS],
            [{"entity": "urn:uuid:e1", "text": "one"}, {"entity": "urn:uuid:e2", "text": "two"}],
        )
        named = find.find(self.directory, {"action": "filter", "item": "Mik", "offset": 0}).split("\n")[2].split("\t")[0]
        after = find.find(self.directory, {"action": "filter", "after": "2026-11-10T00:00:00Z"}).split("\f")[2].split("\n")[2:-1]
        self.assertEqual([named, [line.split("\t")[0] for line in after]], ["http://m", ["urn:uuid:e2"]])

    def test_find_2(self):
        self.keep(row("http://c", SKOS + "prefLabel", "Friends", "en"))
        self.assertEqual(find.find(self.directory, {"action": "overview"}).split("\n")[2].split("\t")[0], "http://c")

    def test_find_3(self):
        self.assertEqual(self.refusal({"action": "zoom"}), "no item")

    def test_find_4(self):
        self.keep(row("http://a", "http://p", "http://o"))
        text = find.find(self.directory, {"action": "query", "query": "SELECT ?s { ?s ?p ?o }"})
        self.assertEqual(text, "\fsolutions\n?s\n<http://a>\n")

    def test_find_5(self):
        self.assertEqual(find.find(self.directory, {"action": "query", "query": "ASK { ?s ?p ?o }"}), "\fboolean\nboolean\nfalse\n")

    def test_find_6(self):
        self.keep(row("http://a", "http://p", "http://o"))
        self.assertEqual(
            find.find(self.directory, {"action": "query", "query": "DESCRIBE <http://a>"}),
            "\ftriples\nsubject\tpredicate\tobject\tdatatype IRI\tlanguage tag\nhttp://a\thttp://p\thttp://o\t\t\n",
        )

    def test_find_7(self):
        self.assertEqual(self.refusal({"action": "query"}), "no query")
