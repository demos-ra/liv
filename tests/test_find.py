import unittest

from liv import find
from liv import relations

SKOS = "http://www.w3.org/2004/02/skos/core#"
LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
XSD_STRING = "http://www.w3.org/2001/XMLSchema#string"


def row(subject, predicate, object, graph_name="g1", language_tag=""):
    return {
        "subject": subject,
        "predicate": predicate,
        "object": object,
        "datatype IRI": LANG_STRING if language_tag else "",
        "language tag": language_tag,
        "graph name": graph_name,
    }


def entity(name, activity, time):
    return {"entity": name, "activity": activity, "agent": "prov:Person", "time": time}


def run(number):
    return {"entity": "e", "run": number, "text": "", "end": ""}


class TestFind(unittest.TestCase):
    def test_order_1(self):
        counts = [
            {"subject": subject, "predicate": "p", "object": "o", "datatype IRI": "", "language tag": "", "count": count, "last": ""}
            for subject, count in (("a", 1), ("b", 2))
        ]
        self.assertEqual(
            (
                [count["subject"] for count in find.order(counts, "counts", [["count", find.DESC]])],
                [run["run"] for run in find.order([run(10), run(2)], "runs", [])],
            ),
            (["b", "a"], [2, 10]),
        )

    def test_page_1(self):
        rows = [run(number) for number in range(1, 61)]
        self.assertEqual(find.page(rows, "runs", [], 50), rows[50:60])

    def test_aggregate_1(self):
        rows = [row("m", "p", "o", "g1"), row("m", "p", "o", "g2"), row("m", "p", "q", "g1")]
        entities = [entity("e2", "g2", "2026-11-11T09:00:00Z")]
        self.assertEqual(
            find.aggregate(rows, ["subject"], entities),
            [{"subject": "m", "count": 2, "last": "2026-11-11T09:00:00Z"}],
        )

    def test_name_concepts_1(self):
        dataset = [
            row("c", SKOS + "prefLabel", "Michael", "g1", "en"),
            row("c", SKOS + "altLabel", "Mike", "g1", "en"),
            row("c", SKOS + "altLabel", "Mike", "g2", "en"),
            row("d", SKOS + "prefLabel", "Dee", "g1", "en"),
            row("d", SKOS + "altLabel", "Ann", "g1", "en"),
        ]
        self.assertEqual(
            find.name_concepts(dataset, ["c", "d"]),
            [
                {"concept": "c", "lexical label": "Mike", "language tag": "en"},
                {"concept": "d", "lexical label": "Dee", "language tag": "en"},
            ],
        )

    def test_mentions_1(self):
        dataset = [
            row("c", SKOS + "prefLabel", "Kyoto", "g1", "en"),
            row("g", SKOS + "broader", "c", "g2"),
            row("x", "p", "y", "g3"),
        ]
        self.assertEqual(
            find.mentions(dataset, ["c"]),
            [
                {"concept": "c", "lexical label": "Kyoto", "language tag": "en", "graph name": "g1"},
                {"concept": "c", "lexical label": "Kyoto", "language tag": "en", "graph name": "g2"},
            ],
        )

    def test_statements_about_1(self):
        dataset = [
            row("m", "p", "o", "g1"),
            row("a", "p", "m", "g2"),
            {"subject": "a", "predicate": "p", "object": "m", "datatype IRI": XSD_STRING, "language tag": "", "graph name": "g1"},
        ]
        self.assertEqual(find.statements_about(dataset, "m"), dataset[:2])

    def test_graphs_of_1(self):
        dataset = [row("m", "p", "o", "g1"), row("m", "p", "o", "g2")]
        counts = [{"subject": "m", "predicate": "p", "object": "o", "datatype IRI": "", "language tag": "", "count": 2, "last": ""}]
        self.assertEqual(find.graphs_of(dataset, counts), dataset)

    def test_match_labels_1(self):
        dataset = [row("m", SKOS + "altLabel", "Mike")]
        self.assertEqual([concept["concept"] for concept in find.match_labels(dataset, "Mik")], ["m"])

    def test_generated_by_1(self):
        first, first_runs = relations.entity_rows("a1", "prov:Person", "", "x")
        second, second_runs = relations.entity_rows("a2", "prov:Person", "", "y")
        self.assertEqual(find.generated_by(first + second, first_runs + second_runs, "a2"), (second, second_runs))

    def test_match_text_1(self):
        entities, runs = relations.entity_rows("a1", "prov:Person", "", "Kyoto\ntrip")
        self.assertEqual([found["entity"] for found in find.match_text(entities, runs, "o\nt")], [entities[0]["entity"]])
