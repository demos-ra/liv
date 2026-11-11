import unittest
import uuid

from liv import uuid as liv_uuid


class TestUuid(unittest.TestCase):
    def test_uuid4_1(self):
        first = liv_uuid.uuid4()
        second = liv_uuid.uuid4()
        self.assertEqual(
            (first[:9], second[:9], uuid.UUID(first).version, uuid.UUID(second).version, first == first.lower(), first != second),
            ("urn:uuid:", "urn:uuid:", 4, 4, True, True),
        )
