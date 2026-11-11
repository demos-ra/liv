import unittest

from liv import address


class TestAddress(unittest.TestCase):
    def test_memory_directory_1(self):
        self.assertEqual(address.memory_directory("/h", "/w/a b"), "/h/liv/w/a%20b")

    def test_memory_directory_2(self):
        self.assertEqual(address.memory_directory("/h", "/w/x/../y"), "/h/liv/w/y")

    def test_memory_directory_3(self):
        self.assertEqual(address.memory_directory("/h", "/w/dataset.mtsv"), "/h/liv/w/dataset%2Emtsv")

    def test_book_paths_1(self):
        self.assertEqual(
            address.book_paths("/h/liv/w"),
            ("/h/liv/w/entities.mtsv", "/h/liv/w/runs.mtsv", "/h/liv/w/dataset.mtsv"),
        )
