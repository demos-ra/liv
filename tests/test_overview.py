import os
import tempfile
import unittest

from liv import banker, overview, relations

SKOS = "http://www.w3.org/2004/02/skos/core#"


class TestOverview(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = self.temporary.name

    def tearDown(self):
        self.temporary.cleanup()

    def test_overview_1(self):
        row = {"subject": "c", "predicate": SKOS + "prefLabel", "object": "Friends", "datatype IRI": "", "language tag": "en", "graph name": "g1"}
        banker.insert(os.path.join(self.directory, "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], [row])
        self.assertEqual(overview.overview(self.directory).startswith("\franked\nconcept\t"), True)

    def test_overview_2(self):
        row = {"subject": "a", "predicate": "http://p", "object": "b", "datatype IRI": "", "language tag": "", "graph name": "g1"}
        banker.insert(os.path.join(self.directory, "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], [row])
        self.assertEqual(overview.overview(self.directory), "")
