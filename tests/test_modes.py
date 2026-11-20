import unittest

from liv import modes


class TestModes(unittest.TestCase):
    def test_can_keep_1(self):
        self.assertEqual([modes.can_keep(False, ""), modes.can_keep(True, "urn:uuid:a"), modes.can_keep(False, "urn:uuid:a")], [False, False, True])

    def test_can_write_1(self):
        self.assertEqual([modes.can_write(""), modes.can_write("urn:uuid:a")], [False, True])
