import unittest

from liv import relations, tasks, values

SKOS = "http://www.w3.org/2004/02/skos/core#"
XSD = "http://www.w3.org/2001/XMLSchema#"
E = "http://e/"


def row(subject, predicate, object, graph=E + "g1", datatype="", language=""):
    return {"subject": subject, "predicate": predicate, "object": object, "datatype IRI": datatype, "language tag": language, "graph name": graph}


def label(subject, predicate, text, graph=E + "g1", language="en"):
    return row(subject, SKOS + predicate, text, graph, "", language)


def entity(activity, time):
    return {"entity": activity + "/e", "activity": activity, "agent": "http://www.w3.org/ns/prov#Person", "time": time}


class TestValues(unittest.TestCase):
    def test_statements_about_1(self):
        dataset = [row(E + "m", E + "p", E + "o", E + "g1"), row(E + "a", E + "p", E + "m", E + "g2"), row(E + "a", E + "p", E + "m", E + "g1", XSD + "string")]
        self.assertEqual(values.statements_about(dataset, E + "m"), dataset[:2])

    def test_narrower_1(self):
        dataset = [row(E + "m", SKOS + "broader", E + "f"), row(E + "f", SKOS + "narrower", E + "n")]
        self.assertEqual(values.narrower(dataset, E + "f"), [E + "m", E + "n"])

    def test_labels_1(self):
        dataset = [label(E + "c", "prefLabel", "Friends"), label(E + "c", "altLabel", "Pals")]
        self.assertEqual(
            values.labels(dataset, E + "c"),
            [{"concept": E + "c", "lexical label": "Friends", "language tag": "en"}, {"concept": E + "c", "lexical label": "Pals", "language tag": "en"}],
        )

    def test_labels_2(self):
        self.assertEqual(values.labels([], E + "c"), [{"concept": E + "c", "lexical label": "", "language tag": ""}])

    def test_heading_1(self):
        dataset = [label(E + "c", "prefLabel", "Michael"), label(E + "c", "altLabel", "Mike", E + "g1"), label(E + "c", "altLabel", "Mike", E + "g2")]
        self.assertEqual(values.heading(dataset, [E + "c"]), [{"concept": E + "c", "lexical label": "Mike", "language tag": "en"}])

    def test_heading_2(self):
        dataset = [label(E + "d", "prefLabel", "Dee"), label(E + "d", "altLabel", "Ann")]
        self.assertEqual(values.heading(dataset, [E + "d"]), [{"concept": E + "d", "lexical label": "Dee", "language tag": "en"}])

    def test_heading_3(self):
        dataset = [label(E + "e", "altLabel", "B"), label(E + "e", "altLabel", "A")]
        self.assertEqual(values.heading(dataset, [E + "e"]), [{"concept": E + "e", "lexical label": "A", "language tag": "en"}])

    def test_ranked_1(self):
        dataset = [row(E + "c", E + "p", E + "o", E + "g1"), row(E + "c", E + "p", E + "o", E + "g2")]
        found = values.ranked(dataset, [entity(E + "g2", "2026-11-11T09:00:00Z")], [E + "c"])[0]
        self.assertEqual([found["concept"], found["count"], found["last"]], [E + "c", 2, "2026-11-11T09:00:00Z"])

    def test_ranked_2(self):
        dataset = [row(E + "m", SKOS + "broader", E + "f"), row(E + "f", SKOS + "narrower", E + "n")]
        found = values.ranked(dataset, [], [E + "f"])[0]
        self.assertEqual([found["concept"], found["narrower"]], [E + "f", 2])

    def test_ranked_3(self):
        dataset = [label(E + "c", "prefLabel", "Mike")]
        found = values.ranked(dataset, [], [E + "c"])[0]
        self.assertEqual([found["concept"], found["lexical label"], found["language tag"]], [E + "c", "Mike", "en"])

    def test_counted_1(self):
        dataset = [row(E + "m", E + "p", E + "o", E + "g1"), row(E + "m", E + "p", E + "o", E + "g2")]
        self.assertEqual(
            values.counted(dataset, [entity(E + "g2", "2026-11-11T09:00:00Z")]),
            [{"subject": E + "m", "predicate": E + "p", "object": E + "o", "datatype IRI": "", "language tag": "", "count": 2, "last": "2026-11-11T09:00:00Z"}],
        )

    def test_comparators_1(self):
        self.assertEqual(
            [values.comparators(values.RANKED), values.comparators(tasks.FOUND), values.comparators(relations.WORDS)],
            [[["count", "DESC"], ["last", "DESC"], ["lexical label", "ASC"]], [["time", "DESC"]], []],
        )
