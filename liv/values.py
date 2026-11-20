from .relations import DATASET, ENTITIES
from .turtle import TRIPLES
from .utility import ASC, DESC, aggregate, describe, join, match, order, union

SKOS = "http://www.w3.org/2004/02/skos/core#"
SKOS_CONCEPT = SKOS + "Concept"
SKOS_PREF_LABEL = SKOS + "prefLabel"
SKOS_ALT_LABEL = SKOS + "altLabel"
SKOS_HIDDEN_LABEL = SKOS + "hiddenLabel"
SKOS_NOTE = SKOS + "note"
SKOS_CHANGE_NOTE = SKOS + "changeNote"
SKOS_DEFINITION = SKOS + "definition"
SKOS_EDITORIAL_NOTE = SKOS + "editorialNote"
SKOS_EXAMPLE = SKOS + "example"
SKOS_HISTORY_NOTE = SKOS + "historyNote"
SKOS_SCOPE_NOTE = SKOS + "scopeNote"
SKOS_BROADER = SKOS + "broader"
SKOS_NARROWER = SKOS + "narrower"
SKOS_RELATED = SKOS + "related"
SKOS_BROADER_TRANSITIVE = SKOS + "broaderTransitive"
SKOS_NARROWER_TRANSITIVE = SKOS + "narrowerTransitive"
LEXICAL_LABEL = "lexical label"
PAGE_SIZE = 50
CONCEPTS_NAME = "concepts"
CONCEPTS = [("concept", "iri"), ("lexical label", "string"), ("language tag", "string")]
CONCEPTS_KEY = ["concept", "lexical label", "language tag"]
COUNTS_NAME = "counts"
COUNTS = [
    ("subject", "iri"),
    ("predicate", "iri"),
    ("object", "term"),
    ("datatype IRI", "iri"),
    ("language tag", "string"),
    ("count", "integer"),
    ("last", "time"),
]
COUNTS_KEY = ["subject", "predicate", "object", "datatype IRI", "language tag"]
RANKED_NAME = "ranked"
RANKED = [
    ("concept", "iri"),
    ("lexical label", "string"),
    ("language tag", "string"),
    ("count", "integer"),
    ("last", "time"),
    ("narrower", "integer"),
]
RANKED_KEY = ["concept"]


def statements_about(dataset, subject):
    # /behavior/shared/values statements_about 1
    # SPARQL11-QUERY /16 Query Forms/16.4 DESCRIBE (Informative)/16.4.3 Descriptions of Resources/1 to /16 Query Forms/16.4 DESCRIBE (Informative)/16.4.3 Descriptions of Resources/1
    return describe(dataset, [subject])


def narrower(dataset, concept):
    # /behavior/shared/values narrower 1
    # SKOS-REFERENCE /8. Semantic Relations/8.1. Preamble/3 to /8. Semantic Relations/8.1. Preamble/3
    # SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/8 to /8. Semantic Relations/8.3. Class & Property Definitions/8
    rows = union(
        [{"concept": row["subject"]} for row in match(dataset, {"predicate": SKOS_BROADER, "object": concept})],
        [{"concept": row["object"]} for row in match(dataset, {"subject": concept, "predicate": SKOS_NARROWER})],
    )
    return list(dict.fromkeys(row["concept"] for row in rows))


def labels(dataset, concept):
    # /behavior/shared/values labels 1
    # SKOS-REFERENCE /5. Lexical Labels/5.1. Preamble/3 to /5. Lexical Labels/5.1. Preamble/5
    rows = union(
        match(dataset, {"subject": concept, "predicate": SKOS_PREF_LABEL}),
        match(dataset, {"subject": concept, "predicate": SKOS_ALT_LABEL}),
    )
    seen = set()
    concepts = []
    for row in rows:
        key = (row["predicate"], row["object"], row["language tag"])
        if key not in seen:
            seen.add(key)
            concepts.append({"concept": concept, "lexical label": row["object"], "language tag": row["language tag"]})
    # /behavior/shared/values labels 2
    if not concepts:
        concepts.append({"concept": concept, "lexical label": "", "language tag": ""})
    return concepts


def heading(dataset, concepts):
    headed = []
    for concept in concepts:
        # /behavior/shared/values heading 1
        named = labels(dataset, concept)
        if named[0]["lexical label"] == "":
            headed.append(named[0])
            continue
        rows = union(
            match(dataset, {"subject": concept, "predicate": SKOS_PREF_LABEL}),
            match(dataset, {"subject": concept, "predicate": SKOS_ALT_LABEL}),
        )
        counts = aggregate(rows, DATASET, [column for column, _ in TRIPLES], [{"name": "Count", "column": "graph name", "distinct": True, "separator": " ", "result": "count"}])
        most = max(row["count"] for row in counts)
        best = [row for row in counts if row["count"] == most]
        # /behavior/shared/values heading 2
        # SKOS-REFERENCE /5. Lexical Labels/5.2. Vocabulary/1 to /5. Lexical Labels/5.2. Vocabulary/2
        preferred = [row for row in best if row["predicate"] == SKOS_PREF_LABEL]
        best = preferred or best
        # /behavior/shared/values heading 3
        candidates = [{"concept": concept, "lexical label": row["object"], "language tag": row["language tag"]} for row in best]
        headed.append(order(candidates, CONCEPTS, CONCEPTS_KEY, [[LEXICAL_LABEL, ASC]])[0])
    return headed


def _last(rows, entities, domains, columns):
    joined = join([dict({column: row[column] for column in columns}, activity=row["graph name"]) for row in rows], entities)
    return {
        tuple(row[column] for column in columns): row["last"]
        for row in aggregate(joined, domains + ENTITIES, columns, [{"name": "Max", "column": "time", "distinct": False, "separator": " ", "result": "last"}])
    }


def ranked(dataset, entities, concepts):
    out = []
    # /behavior/shared/values ranked 3
    names = {row["concept"]: row for row in heading(dataset, concepts)}
    for concept in concepts:
        # /behavior/shared/values ranked 1
        rows = [dict(row, concept=concept) for row in statements_about(dataset, concept)]
        count = aggregate(rows, DATASET + [CONCEPTS[0]], ["concept"], [{"name": "Count", "column": "graph name", "distinct": True, "separator": " ", "result": "count"}])
        last = _last(rows, entities, [CONCEPTS[0]], ["concept"])
        # /behavior/shared/values ranked 2
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/26 to /3. Task by Data Type Taxonomy/26
        # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/6
        under = aggregate([{"concept": item} for item in narrower(dataset, concept)], [CONCEPTS[0]], [], [{"name": "Count", "column": "concept", "distinct": False, "separator": " ", "result": "narrower"}])
        # /behavior/shared/values ranked 3
        name = names[concept]
        out.append({
            "concept": concept,
            "lexical label": name["lexical label"],
            "language tag": name["language tag"],
            "count": count[0]["count"] if count else 0,
            "last": last.get((concept,), ""),
            "narrower": under[0]["narrower"],
        })
    return out


def counted(dataset, entities):
    # /behavior/shared/values counted 1
    columns = [column for column, _ in TRIPLES]
    counts = aggregate(dataset, DATASET, columns, [{"name": "Count", "column": "graph name", "distinct": True, "separator": " ", "result": "count"}])
    last = _last(dataset, entities, [domain for domain in DATASET if domain[0] in columns], columns)
    for row in counts:
        row["last"] = last.get(tuple(row[column] for column in columns), "")
    return counts


def comparators(domains):
    # /behavior/shared/values comparators 1
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/1 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/2
    columns = [column for column, _ in domains]
    found = []
    if "count" in columns:
        found.append(["count", DESC])
    if "last" in columns:
        found.append(["last", DESC])
    elif "time" in columns:
        found.append(["time", DESC])
    if LEXICAL_LABEL in columns:
        found.append([LEXICAL_LABEL, ASC])
    return found
