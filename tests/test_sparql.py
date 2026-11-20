import unittest

from liv import sparql

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
XSD = "http://www.w3.org/2001/XMLSchema#"


def operators(algebra, found=None):
    found = [] if found is None else found
    if isinstance(algebra, list) and algebra and isinstance(algebra[0], str) and not algebra[0].startswith("?"):
        found.append(algebra[0])
        for part in algebra[1:]:
            operators(part, found)
    elif isinstance(algebra, list):
        for part in algebra:
            operators(part, found)
    return found


def patterns(algebra, found=None):
    found = [] if found is None else found
    if isinstance(algebra, list) and algebra:
        if algebra[0] == "BGP":
            found.extend(algebra[1])
        else:
            for part in algebra[1:]:
                patterns(part, found)
    return found


class TestSparql(unittest.TestCase):
    def refusal(self, query):
        with self.assertRaises(ValueError) as refused:
            sparql.parse(query)
        return str(refused.exception)

    def test_parse_1(self):
        query = sparql.parse("SELECT * { ?s ?p ?o }")
        self.assertEqual([query[2], operators(query[0]).count("BGP"), len(patterns(query[0]))], [["SELECT"], 1, 1])

    def test_parse_2(self):
        self.assertEqual(self.refusal("SELECT * { ?s ?p }"), "not SPARQL 1")

    def test_parse_3(self):
        self.assertEqual(patterns(sparql.parse('SELECT * { ?s ?p "\\u0041" }')[0])[0][2], ("A", XSD + "string", ""))

    def test_parse_4(self):
        query = sparql.parse("BASE <http://e/> PREFIX ex: <a/> SELECT * { ex:b ?p ?o }")
        self.assertEqual(patterns(query[0])[0][0], ("http://e/a/b", "", ""))

    def test_parse_5(self):
        query = sparql.parse("BASE <http://e/a/b> SELECT * { <../c> ?p ?o }")
        self.assertEqual(patterns(query[0])[0][0], ("http://e/c", "", ""))

    def test_parse_6(self):
        self.assertEqual(self.refusal("SELECT * { <p> ?p ?o }"), "not an absolute IRI 1")

    def test_parse_7(self):
        query = sparql.parse("PREFIX : <http://e/> SELECT * { :a\\.b ?p ?o }")
        self.assertEqual(patterns(query[0])[0][0], ("http://e/a.b", "", ""))

    def test_parse_8(self):
        self.assertEqual(self.refusal("SELECT * { x:a ?p ?o }"), "no namespace x")

    def test_parse_9(self):
        query = sparql.parse('SELECT * { ?s ?p "x\\ny"@en }')
        self.assertEqual(patterns(query[0])[0][2], ("x\ny", RDF + "langString", "en"))

    def test_parse_10(self):
        self.assertEqual(patterns(sparql.parse("SELECT * { ?s ?p 4 }")[0])[0][2], ("4", XSD + "integer", ""))

    def test_parse_11(self):
        query = sparql.parse("SELECT * { _:b ?p ?o }")
        self.assertEqual([patterns(query[0])[0][0], query[0][2]], ["?_:b", ["p", "o"]])
        self.assertEqual(self.refusal("SELECT * { { _:b ?p ?o } { _:b ?q ?r } }"), "one label two patterns b")

    def test_parse_12(self):
        query = sparql.parse("SELECT ?x { $x ?p ?o }")
        self.assertEqual([query[0][2], patterns(query[0])[0][0]], [["x"], "?x"])

    def test_parse_13(self):
        found = patterns(sparql.parse("SELECT * { ?s a ?c ; ?p 1, 2 }")[0])
        self.assertEqual([len(found), {pattern[0] for pattern in found}, found[0][1]], [3, {"?s"}, (RDF + "type", "", "")])

    def test_parse_14(self):
        query = sparql.parse("SELECT * { ?s <http://e/p>/<http://e/q>* ?o }")
        path = query[0][1]
        self.assertEqual(path, ["Path", "?s", ["seq", ["link", ("http://e/p", "", "")], ["ZeroOrMorePath", ["link", ("http://e/q", "", "")]]], "?o"])

    def test_parse_15(self):
        algebra = sparql.parse("SELECT * { ?s ?p ?o OPTIONAL { ?o ?q ?r } }")[0][1]
        self.assertEqual([algebra[0], algebra[1][0], algebra[2][0]], ["LeftJoin", "BGP", "BGP"])

    def test_parse_16(self):
        algebra = sparql.parse("SELECT ?s (COUNT(?o) AS ?n) { ?s ?p ?o } GROUP BY ?s")[0][1]
        aggregation = algebra[1][1][1]
        self.assertEqual([algebra[0], algebra[2], aggregation[0], aggregation[2], aggregation[4][0]], ["Extend", "n", "Aggregation", "Count", "Group"])
        self.assertEqual(self.refusal("SELECT ?o { ?s ?p ?o } GROUP BY ?s"), "not in scope o")
        grouped = sparql.parse("SELECT ?z (COUNT(*) AS ?n) { ?s ?p ?o } GROUP BY (STR(?s) AS ?z)")[0][1][1][1][1][4]
        self.assertEqual([grouped[0], grouped[1], grouped[2][0], grouped[2][2]], ["Group", ["?z"], "Extend", "z"])

    def test_parse_17(self):
        algebra = sparql.parse("SELECT DISTINCT ?s { ?s ?p ?o } ORDER BY ?s LIMIT 2")[0]
        self.assertEqual([algebra[0], algebra[1][0], algebra[1][1][0], algebra[1][1][1][0]], ["Slice", "Distinct", "Project", "OrderBy"])

    def test_parse_18(self):
        self.assertEqual(self.refusal("SELECT * { SERVICE <http://e/> { ?s ?p ?o } }"), "no federated query")

    def test_results_1(self):
        self.assertEqual(sparql.results(["x", "y"], []), "\fsolutions\n?x\t?y\n")

    def test_results_2(self):
        self.assertEqual(sparql.results(["x"], [{"x": ("http://a", "", "")}]), "\fsolutions\n?x\n<http://a>\n")

    def test_results_3(self):
        solutions = [
            {"x": ("chat", RDF + "langString", "en")},
            {"x": ("4", XSD + "integer", "")},
            {"x": ("x", "http://e/t", "")},
            {"x": ('a"b', XSD + "string", "")},
            {"x": ("abc", XSD + "integer", "")},
        ]
        self.assertEqual(
            sparql.results(["x"], solutions),
            '\fsolutions\n?x\n"chat"@en\n4\n"x"^^<http://e/t>\n"a\\\\"b"\n"abc"^^<http://www.w3.org/2001/XMLSchema#integer>\n',
        )

    def test_results_4(self):
        self.assertEqual(sparql.results(["x", "y"], [{"x": ("1", XSD + "integer", "")}]), "\fsolutions\n?x\t?y\n1\t\n")

    def test_results_5(self):
        self.assertEqual(sparql.results([], [], boolean="true"), "\fboolean\nboolean\ntrue\n")
