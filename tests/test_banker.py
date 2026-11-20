import os
import tempfile
import unittest

from liv import banker, relations


class TestBanker(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = self.temporary.name

    def tearDown(self):
        self.temporary.cleanup()

    def test_insert_1(self):
        book = os.path.join(self.root, "h", "d.mtsv")
        row = {"subject": "http://a", "predicate": "http://p", "object": "x", "datatype IRI": "", "language tag": "", "graph name": "urn:uuid:a"}
        banker.insert(book, "dataset", [column for column, _ in relations.DATASET], [row])
        with open(book, "rb") as handle:
            data = handle.read()
        self.assertEqual([data.startswith(b"\fdataset\n"), banker.obtain(book)], [True, [row]])

    def test_obtain_1(self):
        self.assertEqual(banker.obtain(os.path.join(self.root, "missing.mtsv")), [])
