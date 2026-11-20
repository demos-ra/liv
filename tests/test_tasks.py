import os
import tempfile
import unittest

from liv import banker, mtsv, relations, tasks

SKOS = "http://www.w3.org/2004/02/skos/core#"
RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
PERSON = "http://www.w3.org/ns/prov#Person"
E = "http://e/"


def row(subject, predicate, object, graph=E + "g1", datatype="", language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": datatype, "language tag": language, "graph name": graph}


def label(subject, predicate, text, graph=E + "g1"):
    return row(subject, SKOS + predicate, text, graph, "", "en")


def sheets(text):
    found, fields = mtsv.parse(text)
    out = {}
    for sheet in found:
        records = {}
        for field in fields:
            if field["Sheet"] == sheet["Sheet"]:
                records.setdefault(field["Record"], []).append(field["Text"])
        out[sheet["sheet name"]] = [records[place] for place in sorted(records)]
    return out


class TestTasks(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = self.temporary.name

    def tearDown(self):
        self.temporary.cleanup()

    def books(self, dataset=(), entities=(), words=()):
        if dataset:
            banker.insert(os.path.join(self.directory, "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], list(dataset))
        if entities:
            banker.insert(os.path.join(self.directory, "entities.mtsv"), "entities", [column for column, _ in relations.ENTITIES], list(entities))
        if words:
            banker.insert(os.path.join(self.directory, "words.mtsv"), "words", [column for column, _ in relations.WORDS], list(words))

    def turns(self):
        entities = [
            {"entity": E + "e1", "activity": E + "a1", "agent": PERSON, "time": "2026-11-09T09:00:00Z"},
            {"entity": E + "e2", "activity": E + "a2", "agent": PERSON, "time": "2026-11-11T09:00:00Z"},
        ]
        words = [{"entity": E + "e1", "text": "Kyoto in May"}, {"entity": E + "e2", "text": "Kyoto again"}]
        self.books(entities=entities, words=words)

    def test_mantra_1(self):
        self.assertEqual(
            tasks.mantra(),
            {"overview": (False, False), "zoom": (True, False), "filter": (True, True), "details-on-demand": (True, False), "relate": (True, False)},
        )

    def test_topmost_1(self):
        dataset = [
            label(E + "a", "prefLabel", "A"), row(E + "b", SKOS + "broader", E + "a"), label(E + "c", "prefLabel", "C"),
            row(E + "a", SKOS + "narrower", E + "d"), row(E + "e", RDF_TYPE, SKOS + "Concept"),
        ]
        self.assertEqual(sorted(tasks.topmost(dataset)), [E + "a", E + "c", E + "e"])

    def test_match_labels_1(self):
        self.assertEqual(tasks.match_labels([label(E + "m", "altLabel", "Mike")], "Mik"), [E + "m"])

    def test_match_words_1(self):
        entities = [{"entity": E + "e", "activity": E + "a", "agent": PERSON, "time": ""}]
        self.assertEqual(tasks.match_words(entities, [{"entity": E + "e", "text": "Kyoto\ntrip"}], "o\nt"), entities)

    def test_generated_by_1(self):
        entities = [{"entity": E + "e1", "activity": E + "a1", "agent": PERSON, "time": ""}, {"entity": E + "e2", "activity": E + "a2", "agent": PERSON, "time": ""}]
        words = [{"entity": E + "e1", "text": "one"}, {"entity": E + "e2", "text": "two"}]
        self.assertEqual(tasks.generated_by(entities, words, E + "a2"), ([entities[1]], [words[1]]))

    def test_linked_1(self):
        dataset = [row(E + "m", E + "p", E + "a"), row(E + "b", E + "q", E + "m"), label(E + "m", "prefLabel", "M")]
        self.assertEqual(tasks.linked(dataset, E + "m"), [E + "a", E + "b"])

    def test_similar_1(self):
        dataset = [row(E + "m", E + "likes", E + "tea"), row(E + "n", E + "likes", E + "tea"), row(E + "o", E + "likes", E + "rum")]
        self.assertEqual(tasks.similar(dataset, E + "m"), [{"concept": E + "n", "predicate": E + "likes", "object": E + "tea", "datatype IRI": "", "language tag": ""}])

    def test_overview_1(self):
        self.books(dataset=[label(E + "c", "prefLabel", "Friends")])
        self.assertEqual(
            tasks.overview(self.directory, 0),
            "\franked\nconcept\tlexical label\tlanguage tag\tcount\tlast\tnarrower\nhttp://e/c\tFriends\ten\t1\t\t0\n",
        )

    def test_zoom_1(self):
        self.books(dataset=[row(E + "m", SKOS + "broader", E + "f"), row(E + "m", SKOS + "broader", E + "g")])
        found = [sheets(tasks.zoom(self.directory, item, 0))["ranked"][1][0] for item in (E + "f", E + "g")]
        self.assertEqual(found, [E + "m", E + "m"])

    def test_filter_1(self):
        self.books(dataset=[label(E + "m", "altLabel", "Mike")])
        self.assertEqual(sheets(tasks.filter(self.directory, "Mik", 0, before="", after=""))["ranked"][1][0], E + "m")

    def test_filter_2(self):
        self.turns()
        found = sheets(tasks.filter(self.directory, "Kyo", 0, before="", after=""))["found"]
        self.assertEqual(sorted(record[0] for record in found[1:]), [E + "e1", E + "e2"])

    def test_filter_3(self):
        self.turns()
        found = sheets(tasks.filter(self.directory, "Kyo", 0, before="2026-11-10T00:00:00Z", after=""))["found"]
        self.assertEqual([record[0] for record in found[1:]], [E + "e1"])

    def test_filter_4(self):
        self.turns()
        found = sheets(tasks.filter(self.directory, "Kyo", 0, before="", after="2026-11-10T00:00:00Z"))["found"]
        self.assertEqual([record[0] for record in found[1:]], [E + "e2"])

    def test_details_on_demand_1(self):
        self.books(dataset=[row(E + "m", E + "p", E + "o")])
        self.assertEqual(sheets(tasks.details_on_demand(self.directory, E + "m", 0))["counts"][1][:3], [E + "m", E + "p", E + "o"])

    def test_details_on_demand_2(self):
        self.books(
            dataset=[row(E + "m", E + "p", E + "o", E + "g1"), row(E + "m", E + "q", E + "o", E + "g2")],
            entities=[{"entity": E + "e", "activity": E + "g2", "agent": PERSON, "time": "2026-11-11T09:00:00Z"}],
        )
        self.assertEqual(sheets(tasks.details_on_demand(self.directory, E + "m", 0))["turns"][1:], [[E + "g2", "2026-11-11T09:00:00Z"], [E + "g1", ""]])

    def test_details_on_demand_3(self):
        self.books(
            entities=[{"entity": E + "e1", "activity": "urn:uuid:a", "agent": PERSON, "time": ""}, {"entity": E + "e2", "activity": "urn:uuid:a", "agent": PERSON, "time": ""}],
            words=[{"entity": E + "e1", "text": "one"}, {"entity": E + "e2", "text": "two"}],
        )
        self.assertEqual(len(sheets(tasks.details_on_demand(self.directory, "urn:uuid:a", 0))["entities"]), 3)

    def test_details_on_demand_4(self):
        self.books(
            entities=[{"entity": E + "e1", "activity": "urn:uuid:a", "agent": PERSON, "time": ""}, {"entity": E + "e2", "activity": "urn:uuid:a", "agent": PERSON, "time": ""}],
            words=[{"entity": E + "e1", "text": "one"}, {"entity": E + "e2", "text": "two"}],
        )
        self.assertEqual(sheets(tasks.details_on_demand(self.directory, "urn:uuid:a", 0))["words"][1:], [[E + "e1", "one"], [E + "e2", "two"]])

    def test_relate_1(self):
        self.books(dataset=[row(E + "m", E + "p", E + "a")])
        self.assertEqual(sheets(tasks.relate(self.directory, E + "m", 0))["ranked"][1][0], E + "a")

    def test_relate_2(self):
        self.books(dataset=[row(E + "m", E + "likes", E + "tea"), row(E + "n", E + "likes", E + "tea")])
        self.assertEqual(sheets(tasks.relate(self.directory, E + "m", 0))["similar"][1][:3], [E + "n", E + "likes", E + "tea"])
