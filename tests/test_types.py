import decimal
import math
import unittest

from liv import types


class TestTypes(unittest.TestCase):
    def test_percent_encode_1(self):
        self.assertEqual(types.percent_encode("a b%é".encode("utf-8")), "a%20b%25%C3%A9")

    def test_transform_references_1(self):
        self.assertEqual([types.transform_references("../c", "http://e/a/b"), types.transform_references("d", "http://e/a/b")], ["http://e/c", "http://e/a/d"])

    def test_uuid4_1(self):
        first, second = types.uuid4(), types.uuid4()
        self.assertEqual([len(first), len(second), first[14], second[14], first == second], [36, 36, "4", "4", False])

    def test_urn_1(self):
        self.assertEqual(types.urn("9f1c5a3e-2b7d-4c1e-8a6f-0d4e3b2a1c90"), "urn:uuid:9f1c5a3e-2b7d-4c1e-8a6f-0d4e3b2a1c90")

    def test_canonical_date_time_1(self):
        self.assertEqual(types.canonical_date_time(1762765200.5), "2025-11-10T09:00:00.5Z")

    def test_date_time_seconds_1(self):
        self.assertEqual(
            [types.date_time_seconds("2025-11-10T09:00:00.5Z"), types.date_time_seconds("2025-11-10T10:00:00.5+01:00")],
            [1762765200.5, 1762765200.5],
        )

    def test_date_time_seconds_2(self):
        self.assertEqual(types.date_time_seconds("10 November"), None)

    def test_canonical_integer_1(self):
        self.assertEqual([types.canonical_integer(10), types.canonical_integer(-7)], ["10", "-7"])

    def test_decimal_lexical_map_1(self):
        self.assertEqual([types.decimal_lexical_map("-1.230"), types.decimal_lexical_map("+100")], [decimal.Decimal("-1.23"), decimal.Decimal(100)])

    def test_decimal_lexical_map_2(self):
        self.assertEqual(types.decimal_lexical_map("1e3"), None)

    def test_decimal_canonical_map_1(self):
        self.assertEqual(
            [types.decimal_canonical_map(decimal.Decimal(value)) for value in ("2.50", "3", "-0.10")],
            ["2.5", "3", "-0.1"],
        )

    def test_day_time_duration_canonical_map_1(self):
        self.assertEqual(
            [types.day_time_duration_canonical_map(decimal.Decimal(-18000)), types.day_time_duration_canonical_map(decimal.Decimal(0))],
            ["-PT5H", "PT0S"],
        )

    def test_float_lexical_map_1(self):
        values = [types.float_lexical_map(text) for text in ("1.1", "-0", "INF")]
        self.assertEqual([values[0], values[1], math.copysign(1, values[1]), values[2]], [1.100000023841858, -0.0, -1.0, math.inf])

    def test_float_lexical_map_2(self):
        self.assertEqual(types.float_lexical_map("1.1f"), None)

    def test_float_canonical_map_1(self):
        self.assertEqual([types.float_canonical_map(1.100000023841858), types.float_canonical_map(100.0)], ["1.1E0", "1.0E2"])

    def test_double_lexical_map_1(self):
        values = [types.double_lexical_map(text) for text in ("0.1", "-0", "-INF")]
        self.assertEqual([values[0], values[1], math.copysign(1, values[1]), values[2]], [0.1, -0.0, -1.0, -math.inf])

    def test_double_lexical_map_2(self):
        self.assertEqual(types.double_lexical_map("0x10"), None)

    def test_double_canonical_map_1(self):
        self.assertEqual([types.double_canonical_map(0.1), types.double_canonical_map(1234.5)], ["1.0E-1", "1.2345E3"])

    def test_boolean_lexical_map_1(self):
        self.assertEqual([types.boolean_lexical_map("1"), types.boolean_lexical_map("false")], [True, False])

    def test_boolean_lexical_map_2(self):
        self.assertEqual(types.boolean_lexical_map("yes"), None)

    def test_boolean_canonical_map_1(self):
        self.assertEqual([types.boolean_canonical_map(True), types.boolean_canonical_map(False)], ["true", "false"])

    def test_escape_1(self):
        self.assertEqual(types.escape("a\tb\nc\\"), "a\\tb\\nc\\\\")

    def test_string_literal_quote_1(self):
        self.assertEqual(types.string_literal_quote("a\"b\nc"), "\"a\\\"b\\nc\"")

    def test_unescape_1(self):
        self.assertEqual(types.unescape("a\\tb\\nc\\\\d\\be\\\"f\\'g"), "a\tb\nc\\d\be\"f'g")
