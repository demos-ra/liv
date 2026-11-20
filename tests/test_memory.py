import os
import tempfile
import unittest

from liv import memory


class TestMemory(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = os.path.realpath(self.temporary.name)

    def tearDown(self):
        self.temporary.cleanup()

    def encoded(self, *parts):
        return "/".join(part.replace("/", "") for part in parts)

    def test_memory_directory_1(self):
        directory = os.path.join(self.root, "a b")
        os.makedirs(directory)
        expected = os.path.join("/h", "liv", *[segment for segment in self.root.split(os.sep) if segment], "a%20b")
        self.assertEqual(memory.memory_directory("/h", directory), expected)

    def test_memory_directory_2(self):
        directory = os.path.join(self.root, "dataset.mtsv")
        os.makedirs(directory)
        self.assertEqual(memory.memory_directory("/h", directory).endswith("/dataset%2Emtsv"), True)
