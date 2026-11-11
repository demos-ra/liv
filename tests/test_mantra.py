import os
import tempfile
import unittest

from liv import mantra
from liv import mtsv
from liv import relations
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


class TestMantra(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = self.temporary.name

    def tearDown(self):
        self.temporary.cleanup()

    def keep(self, dataset):
        store.append(
            os.path.join(self.directory, "dataset.mtsv"),
            "dataset",
            [column for column, type in relations.DATASET],
            dataset,
        )

    def names(self, text):
        sheets, fields = mtsv.parse(text)
        return [sheet["sheet name"] for sheet in sheets]

    def test_overview_1(self):
        self.keep([row("c", SKOS + "topConceptOf", skos.SCHEME), row("c", SKOS + "prefLabel", "Friends", "en")])
        self.assertEqual(
            mantra.overview(self.directory, 0),
            "\franked\nconcept\tlexical label\tlanguage tag\tcount\tlast\nc\tFriends\ten\t1\t\n",
        )

    def test_zoom_1(self):
        self.keep([row("m", SKOS + "broader", "f"), row("m", SKOS + "broader", "g")])
        self.assertEqual(
            [mantra.zoom(self.directory, item, 0) for item in ("f", "g")],
            ["\fconcepts\nconcept\tlexical label\tlanguage tag\nm\t\t\n"] * 2,
        )

    def test_filter_1(self):
        self.keep([row("m", SKOS + "altLabel", "Mike")])
        self.assertEqual(self.names(mantra.filter(self.directory, "Mik", 0)), ["concepts", "found"])

    def test_details_on_demand_1(self):
        self.keep([row("m", SKOS + "prefLabel", "Mike", "en")])
        self.assertEqual(self.names(mantra.details_on_demand(self.directory, "m", 0)), ["counts", "dataset"])
