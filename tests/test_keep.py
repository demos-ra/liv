import os
import tempfile
import unittest
from unittest import mock

from liv import banker, keep

PROV = "http://www.w3.org/ns/prov#"


class TestKeep(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.entities = os.path.join(self.temporary.name, "entities.mtsv")
        self.words = os.path.join(self.temporary.name, "words.mtsv")

    def tearDown(self):
        self.temporary.cleanup()

    def test_keep_turn_1(self):
        keep.keep_turn(self.entities, self.words, False, "urn:uuid:a", "a", None, "b", None)
        entities = banker.obtain(self.entities)
        self.assertEqual(
            [[row["activity"] for row in entities], [row["agent"] for row in entities], [row["text"] for row in banker.obtain(self.words)]],
            [["urn:uuid:a", "urn:uuid:a"], [PROV + "Person", PROV + "SoftwareAgent"], ["a", "b"]],
        )

    def test_keep_turn_2(self):
        keep.keep_turn(self.entities, self.words, True, "urn:uuid:a", "a", None, "b", None)
        self.assertEqual([os.path.exists(self.entities), os.path.exists(self.words)], [False, False])

    def test_keep_turn_3(self):
        keep.keep_turn(self.entities, self.words, False, "urn:uuid:a", "a", 1762765200.5, "b", None)
        self.assertEqual([row["time"] for row in banker.obtain(self.entities)], ["2025-11-10T09:00:00.5Z", ""])

    def test_keep_turn_4(self):
        def failing(book, sheet_bytes, records_bytes):
            raise OSError("short write")

        with mock.patch("liv.banker.append", side_effect=failing):
            with self.assertRaises(OSError) as failure:
                keep.keep_turn(self.entities, self.words, False, "urn:uuid:a", "a", None, "b", None)
        self.assertEqual([str(failure.exception), os.path.exists(self.entities)], ["short write", False])
