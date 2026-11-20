import os
import tempfile
import unittest

from liv import banker, write


class TestWrite(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.book = os.path.join(self.temporary.name, "q.mtsv")

    def tearDown(self):
        self.temporary.cleanup()

    def test_write_triples_1(self):
        with self.assertRaises(ValueError) as refused:
            write.write_triples(self.book, "", "<http://a> <http://p> <http://o> .")
        self.assertEqual(str(refused.exception), "no turn")

    def test_write_triples_2(self):
        write.write_triples(self.book, "urn:uuid:a", '<http://a> <http://p> "x" .')
        found = banker.obtain(self.book)
        self.assertEqual([(row["subject"], row["predicate"], row["object"], row["graph name"]) for row in found], [("http://a", "http://p", "x", "urn:uuid:a")])

    def test_write_triples_3(self):
        text = write.write_triples(self.book, "urn:uuid:a", '_:k <http://p> "x" .')
        lines = text.split("\n")
        self.assertEqual([lines[0], lines[1], lines[2].split("\t")[0], lines[2].split("\t")[1].startswith("urn:uuid:")], ["\fminted", "blank node\tSkolem IRI", "_:k", True])
