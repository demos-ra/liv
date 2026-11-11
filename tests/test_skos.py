import os
import tempfile
import unittest

from liv import skos
from liv import store

SKOS = "http://www.w3.org/2004/02/skos/core#"
LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"


def row(subject, predicate, object, language_tag="", graph_name="g1"):
    return {
        "subject": subject,
        "predicate": predicate,
        "object": object,
        "datatype IRI": LANG_STRING if language_tag else "",
        "language tag": language_tag,
        "graph name": graph_name,
    }


class TestSkos(unittest.TestCase):
    def test_labels_1(self):
        dataset = [row("c", SKOS + "prefLabel", "Friends", "en"), row("c", SKOS + "altLabel", "Pals", "en")]
        self.assertEqual(
            skos.labels(dataset, "c"),
            [
                {"concept": "c", "lexical label": "Friends", "language tag": "en"},
                {"concept": "c", "lexical label": "Pals", "language tag": "en"},
            ],
        )

    def test_top_concepts_1(self):
        dataset = [row("c", SKOS + "topConceptOf", skos.SCHEME), row(skos.SCHEME, SKOS + "hasTopConcept", "d")]
        self.assertEqual(skos.top_concepts(dataset), ["c", "d"])

    def test_narrower_1(self):
        dataset = [row("m", SKOS + "broader", "f"), row("f", SKOS + "narrower", "n")]
        self.assertEqual(skos.narrower(dataset, "f"), ["m", "n"])

    def test_integrity_check_1(self):
        with self.assertRaises(ValueError) as refusal:
            skos.integrity_check([row("m", SKOS + "prefLabel", "Michael", "en")], [row("m", SKOS + "prefLabel", "Mike", "en")])
        self.assertEqual(str(refusal.exception), "S14 m")

    def test_integrity_check_2(self):
        with self.assertRaises(ValueError) as refusal:
            skos.integrity_check([row("m", SKOS + "prefLabel", "Mike", "en")], [row("m", SKOS + "altLabel", "Mike", "en")])
        self.assertEqual(str(refusal.exception), "S13 m")

    def test_integrity_check_3(self):
        with self.assertRaises(ValueError) as refusal:
            skos.integrity_check([row("s", SKOS + "hasTopConcept", "c")], [row("s", SKOS + "broader", "x")])
        self.assertEqual(str(refusal.exception), "S9 s")

    def test_integrity_check_4(self):
        with self.assertRaises(ValueError) as refusal:
            skos.integrity_check(
                [row("a", SKOS + "broader", "b"), row("b", SKOS + "broader", "c")],
                [row("a", SKOS + "related", "c")],
            )
        self.assertEqual(str(refusal.exception), "S27 a")

    def test_write_triples_1(self):
        with tempfile.TemporaryDirectory() as h:
            book = os.path.join(h, "q.mtsv")
            skos.write_triples(book, "urn:uuid:a", '<http://a> <http://p> "x" .')
            self.assertEqual(
                [(row["subject"], row["predicate"], row["object"], row["graph name"]) for row in store.read(book)],
                [("http://a", "http://p", "x", "urn:uuid:a")],
            )
