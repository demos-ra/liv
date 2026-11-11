import unittest

from liv import xsd


class TestXsd(unittest.TestCase):
    def test_canonical_date_time_1(self):
        self.assertEqual(xsd.canonical_date_time(1762765200.5), "2025-11-10T09:00:00.5Z")

    def test_date_time_seconds_1(self):
        self.assertEqual(
            [xsd.date_time_seconds("2025-11-10T09:00:00.5Z"), xsd.date_time_seconds("2025-11-10T10:00:00.5+01:00")],
            [1762765200.5, 1762765200.5],
        )

    def test_date_time_seconds_2(self):
        with self.assertRaises(ValueError) as refusal:
            xsd.date_time_seconds("10 November")
        self.assertEqual(str(refusal.exception), "not an xsd:dateTime")

    def test_canonical_integer_1(self):
        self.assertEqual([xsd.canonical_integer(10), xsd.canonical_integer(-7)], ["10", "-7"])

    def test_integer_value_1(self):
        self.assertEqual(xsd.integer_value("+010"), 10)

    def test_integer_value_2(self):
        with self.assertRaises(ValueError) as refusal:
            xsd.integer_value("1.5")
        self.assertEqual(str(refusal.exception), "not an xsd:integer")
