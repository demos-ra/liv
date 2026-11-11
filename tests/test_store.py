import os
import tempfile
import unittest
from unittest.mock import patch

from liv import store


class TestStore(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.h = self.directory.name

    def tearDown(self):
        self.directory.cleanup()

    def write(self, name, text):
        with open(os.path.join(self.h, name), "w", encoding="utf-8", newline="") as file:
            file.write(text)
        return os.path.join(self.h, name)

    def text(self, book):
        with open(book, encoding="utf-8", newline="") as file:
            return file.read()

    def test_append_1(self):
        store.append(os.path.join(self.h, "a", "b", "q.mtsv"), "s", ["a"], [])
        self.assertEqual(
            (os.path.isdir(os.path.join(self.h, "a")), os.path.isdir(os.path.join(self.h, "a", "b"))),
            (True, True),
        )

    def test_append_2(self):
        book = os.path.join(self.h, "q.mtsv")
        store.append(book, "dataset", ["a", "b"], [{"a": 1, "b": 2}])
        self.assertEqual(self.text(book), "\fdataset\na\tb\n1\t2\n")

    def test_append_3(self):
        book = self.write("s.mtsv", "\fs\na\n")
        store.append(book, "s", ["a"], [{"a": 1}, {"a": 2}])
        self.assertEqual(self.text(book)[-4:], "1\n2\n")

    def test_append_4(self):
        book = self.write("s.mtsv", "\fs\na\n")
        exists = os.path.exists
        with patch("liv.store.os.path.exists", new=lambda path: path != book and exists(path)):
            store.append(book, "s", ["a"], [{"a": 1}])
        self.assertEqual(self.text(book), "\fs\na\n1\n")

    def test_append_5(self):
        book = os.path.join(self.h, "q.mtsv")
        store.append(book, "s", ["a"], [{"a": 1}])
        self.assertEqual(os.listdir(self.h), ["q.mtsv"])

    def test_read_1(self):
        self.assertEqual(store.read(os.path.join(self.h, "missing.mtsv")), [])

    def test_read_2(self):
        book = self.write("s.mtsv", "\fs\na\n1\n1\n")
        self.assertEqual(store.read(book), [{"a": "1"}])

    def test_read_3(self):
        book = self.write("r.mtsv", "\fruns\nentity\trun\ttext\tend\ne\t10\tx\t\ne\t2\ty\tLF\n")
        self.assertEqual([row["run"] for row in store.read(book)], [10, 2])

    def test_keep_entity_1(self):
        entities_book = os.path.join(self.h, "e.mtsv")
        runs_book = os.path.join(self.h, "r.mtsv")
        store.keep_entity(entities_book, runs_book, "urn:uuid:a", "prov:Person", "", "a\nb")
        entities = store.read(entities_book)
        runs = store.read(runs_book)
        self.assertEqual(
            (self.text(entities_book)[:10], self.text(runs_book)[:6], len(entities), len(runs)),
            ("\fentities\n", "\fruns\n", 1, 2),
        )
        self.assertEqual(
            [(run["entity"], run["text"], run["end"]) for run in runs],
            [(entities[0]["entity"], "a", "LF"), (entities[0]["entity"], "b", "")],
        )
