import unittest

from liv import mtsv


def shape(text):
    sheets, fields = mtsv.parse(text)
    out = []
    for sheet in sheets:
        records = {}
        for field in fields:
            if field["Sheet"] == sheet["Sheet"]:
                records.setdefault(field["Record"], []).append(field["Text"])
        out.append((sheet["sheet name"], [records[place] for place in sorted(records)]))
    return out


class TestMtsv(unittest.TestCase):
    def test_encode_1(self):
        self.assertEqual(mtsv.encode("é"), b"\xc3\xa9")

    def test_decode_1(self):
        self.assertEqual(mtsv.decode(b"\x61\xff\x0a"), "a\udcff\n")

    def test_parse_1(self):
        self.assertEqual(shape("\fdataset\na\tb\n1\t2\n"), [("dataset", [["a", "b"], ["1", "2"]])])

    def test_parse_2(self):
        self.assertEqual(shape("\fs\na\r\n1\r\n"), [("s", [["a"], ["1"]])])

    def test_parse_3(self):
        self.assertEqual([shape("\fs\na\tb\n1\n1\t2\n3"), shape("\fs\na")], [[("s", [["a", "b"], ["1", "2"]])], [("s", [])]])

    def test_parse_4(self):
        self.assertEqual(shape("\fs\na\nx\\ny\n"), [("s", [["a"], ["x\ny"]])])

    def test_record_1(self):
        self.assertEqual(mtsv.record(["a\nb", 10]), "a\\nb\t10\n")

    def test_sheet_1(self):
        self.assertEqual(mtsv.sheet("s", ["a"], [{"a": 1}]), "\fs\na\n1\n")

    def test_generate_1(self):
        self.assertEqual(mtsv.generate(["\fs\na\n", "\ft\nb\n"]), "\fs\na\n\ft\nb\n")
