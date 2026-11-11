import unittest

from liv import mtsv


class TestMtsv(unittest.TestCase):
    def test_parse_1(self):
        self.assertEqual(
            mtsv.parse("\fdataset\na\tb\n1\t2\n"),
            (
                [{"Sheet": 1, "sheet name": "dataset"}],
                [
                    {"Sheet": 1, "Record": 0, "Field": 1, "Text": "a"},
                    {"Sheet": 1, "Record": 0, "Field": 2, "Text": "b"},
                    {"Sheet": 1, "Record": 1, "Field": 1, "Text": "1"},
                    {"Sheet": 1, "Record": 1, "Field": 2, "Text": "2"},
                ],
            ),
        )

    def test_parse_2(self):
        self.assertEqual(
            mtsv.parse("\fs\na\r\n1\r\n"),
            (
                [{"Sheet": 1, "sheet name": "s"}],
                [
                    {"Sheet": 1, "Record": 0, "Field": 1, "Text": "a"},
                    {"Sheet": 1, "Record": 1, "Field": 1, "Text": "1"},
                ],
            ),
        )

    def test_parse_3(self):
        with self.assertRaises(ValueError) as refusal:
            mtsv.parse("\fs\na\tb\n1\n")
        self.assertEqual(str(refusal.exception), "not MTSV 3")

    def test_generate_1(self):
        self.assertEqual(mtsv.generate(["\fs\na\n", "\ft\nb\n"]), "\fs\na\n\ft\nb\n")

    def test_record_1(self):
        self.assertEqual(mtsv.record(["a", 10]), "a\t10\n")

    def test_record_2(self):
        with self.assertRaises(ValueError) as refusal:
            mtsv.record(["a\tb"])
        self.assertEqual(str(refusal.exception), "cannot be represented")

    def test_sheet_1(self):
        self.assertEqual(mtsv.sheet("s", ["a"], [{"a": 1}]), "\fs\na\n1\n")
