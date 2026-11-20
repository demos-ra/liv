import unittest

from liv import wording


class TestWording(unittest.TestCase):
    def test_system_1(self):
        self.assertEqual(wording.system(), "LIV is the memory for the directory you work in. It holds the turns' words, and the statements you write in RDF, each in the graph of the turn that wrote it. Things and turns are named by IRIs. Nothing is removed or replaced; a correction is a new statement, dated by its turn. Statements are read through SKOS: a thing's names are its skos:prefLabel and skos:altLabel; skos:hiddenLabel only matches a search. A thing sits under another by its skos:broader or the other's skos:narrower. A thing typed skos:Concept, labelled, noted, or linked by skos:broader, skos:narrower or skos:related is topmost when under no other. What LIV gives you is MTSV: `\\f` before each sheet's name line, then its column names, then its rows; `\\t` between fields, `\\n` between rows; an empty field holds none. In a field, `\\t`, `\\n`, `\\f`, `\\r` and `\\\\` stand for those characters. Times are xsd:dateTime in UTC. A call LIV cannot answer gives refused and the reason. Before a turn, you get the first page of the overview: a sheet ranked of the topmost things, or nothing where there are none. Each row gives concept, the thing's IRI; lexical label and language tag, the name most turns write, a skos:prefLabel on a tie; count, how many turns speak of it; last, when one last did; narrower, how many sit directly under it. Every sheet a task gives comes by count, most first, then by last or time, newest first, then by lexical label, then by its key, where it has those columns. After each completed turn, LIV keeps its words, the person's and yours, word for word, each with its time. A delegate's turns, and a turn that never started, are not kept.")

    def test_tools_1(self):
        find = list(wording.tools().values())[0]
        self.assertEqual(
            [find["name"], list(find["parameters"]), find["required"], find["parameters"]["action"]["one of"]],
            ["liv_find", ["action", "item", "before", "after", "query", "offset"], ["action"], ["overview", "zoom", "filter", "details-on-demand", "relate", "query"]],
        )

    def test_tools_2(self):
        write = list(wording.tools().values())[1]
        self.assertEqual([write["name"], list(write["parameters"]), write["required"]], ["liv_write", ["statements"], ["statements"]])

    def test_tools_3(self):
        find, write = wording.tools().values()
        self.assertEqual(
            [find["description"], find["parameters"]["action"]["description"], find["parameters"]["item"]["description"], find["parameters"]["before"]["description"], find["parameters"]["after"]["description"], find["parameters"]["query"]["description"], find["parameters"]["offset"]["description"], write["description"], write["parameters"]["statements"]["description"]],
            [
                "Reads the memory by one of five tasks or a SPARQL query, one page of each sheet at a time. The tasks are fixed steps through the memory; query asks any other question of it; the overview before a turn is the overview task's first page. zoom gives a ranked sheet of the things directly under one. filter gives a ranked sheet of the things whose labels hold a text, then a found sheet of the sides of turns whose words hold it. filter matches letter for letter, case-sensitive. details-on-demand gives, for a thing, a counts sheet of the statements with it as subject or object, each once, with count, how many turns wrote it, and last, then a turns sheet of those turns; for a turn, an entities sheet of its sides, then a words sheet of their words. relate gives a ranked sheet of the things a statement links to one, then a similar sheet of the other things sharing a predicate and an object with it. In found and entities, activity is the turn's IRI and agent prov:Person or prov:SoftwareAgent; in turns, graph name is the turn's IRI. query gives a solutions sheet for SELECT, each term as SPARQL writes it, a boolean sheet for ASK, or a triples sheet for CONSTRUCT and DESCRIBE. A task that takes an item asked with none, or query with no query, is refused.",
                'overview, zoom, filter, details-on-demand, relate or query.',
                "For zoom, a thing's IRI; for filter, a text, or none for every name and word; for details-on-demand, a thing's or a turn's IRI; for relate, a thing's IRI; none for overview and query.",
                'For filter, an xsd:dateTime in UTC: only turns before it.',
                'For filter, an xsd:dateTime in UTC: only turns after it; with before, between them.',
                "For query, one SPARQL 1.1 query over every statement as written, with no inference, each in its turn's named graph, all merged as the default graph. Each turn is a prov:Activity, and each of its sides a prov:Entity, prov:wasGeneratedBy it, with prov:generatedAtTime, prov:value its words, and prov:wasAttributedTo an agent typed prov:Person or prov:SoftwareAgent, in the turn's graph. DESCRIBE gives the statements details-on-demand gives; a time with no timezone is UTC. A query that is not SPARQL 1.1, uses an undeclared prefix, holds a relative IRI with no base, or holds SERVICE is refused.",
                'The rows to skip in each sheet, from 0, in pages of 50; 0 where not given.',
                "Adds the statements of one Turtle document. Each blank node gets a new IRI, one per label. The answer is a minted sheet of each blank node with its IRI. Use it for statements; a turn's words are kept without it. The whole document is refused if it is not Turtle, uses an undeclared prefix, or holds a relative IRI with no base. With no turn started, it is refused.",
                'One Turtle document, such as: @prefix skos: <http://www.w3.org/2004/02/skos/core#> . _:kyoto skos:prefLabel "Kyoto trip"@en .',
            ],
        )
