import os
import tempfile
import unittest

from liv import banker, memory, relations, view

SKOS = "http://www.w3.org/2004/02/skos/core#"


class TestView(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.base = os.path.join(self.temporary.name, "h")
        self.directory = os.path.join(self.temporary.name, "w")
        os.makedirs(self.directory)

    def tearDown(self):
        self.temporary.cleanup()

    def test_view_1(self):
        directory = memory.memory_directory(self.base, self.directory)
        row = {"subject": "c", "predicate": SKOS + "prefLabel", "object": "Friends", "datatype IRI": "", "language tag": "en", "graph name": "g1"}
        banker.insert(os.path.join(directory, "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], [row])
        self.assertEqual(view.view(self.base, self.directory, {"action": "overview", "offset": 0}).split("\n")[2].split("\t")[:2], ["c", "Friends"])
