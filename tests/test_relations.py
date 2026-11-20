import unittest

from liv import relations

PROV = "http://www.w3.org/ns/prov#"
RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
XSD = "http://www.w3.org/2001/XMLSchema#"


def triple(subject, predicate, object, datatype="", language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": datatype, "language tag": language}


def statements(dataset):
    return sorted((row["subject"], row["predicate"], row["object"], row["datatype IRI"], row["graph name"]) for row in dataset)


class TestRelations(unittest.TestCase):
    def test_pathnames_1(self):
        self.assertEqual(
            relations.pathnames("/h/liv/w"),
            ("/h/liv/w/entities.mtsv", "/h/liv/w/words.mtsv", "/h/liv/w/dataset.mtsv"),
        )

    def test_activity_1(self):
        first, second = relations.activity(), relations.activity()
        self.assertEqual([first.startswith("urn:uuid:"), second.startswith("urn:uuid:"), first == second], [True, True, False])

    def test_entity_rows_1(self):
        entities, words = relations.entity_rows("urn:uuid:a", PROV + "Person", "2026-11-10T09:00:00Z", "hi")
        row = entities[0]
        self.assertEqual(
            [len(entities), row["entity"].startswith("urn:uuid:"), row["activity"], row["agent"], row["time"]],
            [1, True, "urn:uuid:a", PROV + "Person", "2026-11-10T09:00:00Z"],
        )

    def test_entity_rows_2(self):
        entities, words = relations.entity_rows("urn:uuid:a", PROV + "Person", "", "a\nb")
        self.assertEqual(words, [{"entity": entities[0]["entity"], "text": "a\nb"}])

    def test_dataset_rows_1(self):
        dataset, minted = relations.dataset_rows([triple("http://a", "http://p", "http://o")], "urn:uuid:a")
        self.assertEqual([row["graph name"] for row in dataset], ["urn:uuid:a"])

    def test_dataset_rows_2(self):
        dataset, minted = relations.dataset_rows(
            [triple("_:b", "http://p", "_:b"), triple("_:c", "http://p", "_:c")], "urn:uuid:a"
        )
        self.assertEqual(
            [dataset[0]["subject"] == dataset[0]["object"], dataset[1]["subject"] == dataset[1]["object"], dataset[0]["subject"] == dataset[1]["subject"], dataset[0]["subject"].startswith("urn:uuid:")],
            [True, True, False, True],
        )

    def test_dataset_rows_3(self):
        dataset, minted = relations.dataset_rows([triple("_:b", "http://p", "_:c")], "urn:uuid:a")
        self.assertEqual(
            [[row["blank node"] for row in minted], [row["Skolem IRI"] for row in minted]],
            [["_:b", "_:c"], [dataset[0]["subject"], dataset[0]["object"]]],
        )

    def test_dataset_rows_4(self):
        dataset, minted = relations.dataset_rows(
            [triple("http://a", "http://p", "x", "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString", "en"), triple("http://a", "http://p", "y", XSD + "string")],
            "urn:uuid:a",
        )
        self.assertEqual([row["datatype IRI"] for row in dataset], ["", XSD + "string"])

    def entity(self, time=""):
        return [{"entity": "urn:uuid:e", "activity": "urn:uuid:a", "agent": PROV + "Person", "time": time}], [{"entity": "urn:uuid:e", "text": "hi"}]

    def test_provenance_rows_1(self):
        found = statements(relations.provenance_rows(*self.entity()))
        self.assertIn(("urn:uuid:e", RDF_TYPE, PROV + "Entity", "", "urn:uuid:a"), found)
        self.assertIn(("urn:uuid:a", RDF_TYPE, PROV + "Activity", "", "urn:uuid:a"), found)

    def test_provenance_rows_2(self):
        self.assertIn(("urn:uuid:e", PROV + "wasGeneratedBy", "urn:uuid:a", "", "urn:uuid:a"), statements(relations.provenance_rows(*self.entity())))

    def test_provenance_rows_3(self):
        timed = statements(relations.provenance_rows(*self.entity("2026-11-10T09:00:00Z")))
        untimed = statements(relations.provenance_rows(*self.entity()))
        self.assertIn(("urn:uuid:e", PROV + "generatedAtTime", "2026-11-10T09:00:00Z", XSD + "dateTime", "urn:uuid:a"), timed)
        self.assertEqual([row for row in untimed if row[1] == PROV + "generatedAtTime"], [])

    def test_provenance_rows_4(self):
        dataset = relations.provenance_rows(*self.entity())
        agent = [row["object"] for row in dataset if row["predicate"] == PROV + "wasAttributedTo"][0]
        self.assertEqual([agent.startswith("_:"), (agent, RDF_TYPE, PROV + "Person", "", "urn:uuid:a") in statements(dataset)], [True, True])

    def test_provenance_rows_5(self):
        self.assertIn(("urn:uuid:e", PROV + "value", "hi", XSD + "string", "urn:uuid:a"), statements(relations.provenance_rows(*self.entity())))

    def test_sheet_text_1(self):
        self.assertEqual(relations.sheet_text("dataset", ["a", "b"], [{"a": "1", "b": "2"}])[0], "\fdataset\na\tb\n1\t2\n")

    def test_sheet_text_2(self):
        self.assertEqual(relations.sheet_text("s", ["a"], [{"a": "1"}, {"a": "2"}])[1], "1\n2\n")

    def test_sheet_rows_1(self):
        self.assertEqual(relations.sheet_rows(""), [])

    def test_sheet_rows_2(self):
        self.assertEqual(relations.sheet_rows("\fs\na\n1\n1\n"), [{"a": "1"}])
