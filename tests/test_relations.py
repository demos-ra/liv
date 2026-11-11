import unittest

from liv import relations


def triple(subject, object):
    return {"subject": subject, "predicate": "http://p", "object": object, "datatype IRI": "", "language tag": ""}


class TestRelations(unittest.TestCase):
    def test_activity_1(self):
        first = relations.activity()
        second = relations.activity()
        self.assertEqual((first[:9], second[:9], first != second), ("urn:uuid:", "urn:uuid:", True))

    def test_entity_rows_1(self):
        entities, runs = relations.entity_rows("urn:uuid:a", "prov:Person", "2026-11-10T09:00:00Z", "hi")
        self.assertEqual(
            [(entity["entity"][:9], entity["activity"], entity["agent"], entity["time"]) for entity in entities],
            [("urn:uuid:", "urn:uuid:a", "prov:Person", "2026-11-10T09:00:00Z")],
        )

    def test_entity_rows_2(self):
        entities, runs = relations.entity_rows("urn:uuid:a", "prov:Person", "", "a\nb")
        self.assertEqual(
            [(run["run"], run["text"], run["end"]) for run in runs],
            [(1, "a", "LF"), (2, "b", "")],
        )

    def test_entity_text_1(self):
        entities, runs = relations.entity_rows("urn:uuid:a", "prov:Person", "", "a\nb")
        self.assertEqual(relations.entity_text(runs), "a\nb")

    def test_dataset_rows_1(self):
        dataset = relations.dataset_rows([triple("http://a", "http://o")], "urn:uuid:a")
        self.assertEqual([row["graph name"] for row in dataset], ["urn:uuid:a"])

    def test_dataset_rows_2(self):
        dataset = relations.dataset_rows([triple("_:b", "_:b"), triple("_:c", "_:c")], "urn:uuid:a")
        self.assertEqual(
            (
                dataset[0]["subject"] == dataset[0]["object"],
                dataset[1]["subject"] == dataset[1]["object"],
                dataset[0]["subject"][:9],
                dataset[1]["subject"][:9],
                dataset[0]["subject"] != dataset[1]["subject"],
            ),
            (True, True, "urn:uuid:", "urn:uuid:", True),
        )
