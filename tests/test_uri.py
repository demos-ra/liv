import unittest

from liv import uri


class TestUri(unittest.TestCase):
    def test_percent_encode_1(self):
        self.assertEqual(uri.percent_encode("a b%é"), "a%20b%25%C3%A9")
