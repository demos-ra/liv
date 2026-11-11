from . import mtsv
from . import relations
from . import skos
from . import turtle
from . import xsd

PAGE_SIZE = 50
ASC = "ASC"
DESC = "DESC"
OFFSET = "offset"
COUNTS = [
    ("subject", "iri"),
    ("predicate", "iri"),
    ("object", "term"),
    ("datatype IRI", "iri"),
    ("language tag", "string"),
    ("count", "integer"),
    ("last", "time"),
]
COUNTS_NAME = "counts"
COUNTS_KEY = ["subject", "predicate", "object", "datatype IRI", "language tag"]
MENTIONS = [("concept", "iri"), ("lexical label", "string"), ("language tag", "string"), ("graph name", "iri")]
MENTIONS_NAME = "mentions"
MENTIONS_KEY = ["concept", "lexical label", "language tag", "graph name"]
RANKED = [
    ("concept", "iri"),
    ("lexical label", "string"),
    ("language tag", "string"),
    ("count", "integer"),
    ("last", "time"),
]
RANKED_NAME = "ranked"
RANKED_KEY = ["concept", "lexical label", "language tag"]
FOUND = [("entity", "iri"), ("activity", "iri"), ("agent", "agent type"), ("time", "time")]
FOUND_NAME = "found"
FOUND_KEY = ["entity"]
# /lookup/find aggregate 1
# SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/1 to /11 Aggregates/11.2 GROUP BY/1
# SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
# SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/6
# SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/8
COUNT = "count"
LAST = "last"


def order(rows, relation, comparators):
    # /lookup/find order 1
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/1 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/2
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/20 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/22
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.1 ORDER BY/43 to /15 Solution Sequences and Modifiers/15.1 ORDER BY/44
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.4 OFFSET/2 to /15 Solution Sequences and Modifiers/15.4 OFFSET/2
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/8
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/44 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/44
    columns, key = {
        mtsv.SHEETS_NAME: (mtsv.SHEETS, mtsv.SHEETS_KEY),
        mtsv.FIELDS_NAME: (mtsv.FIELDS, mtsv.FIELDS_KEY),
        turtle.TRIPLES_NAME: (turtle.TRIPLES, turtle.TRIPLES_KEY),
        relations.ENTITIES_NAME: (relations.ENTITIES, relations.ENTITIES_KEY),
        relations.RUNS_NAME: (relations.RUNS, relations.RUNS_KEY),
        relations.DATASET_NAME: (relations.DATASET, relations.DATASET_KEY),
        skos.CONCEPTS_NAME: (skos.CONCEPTS, skos.CONCEPTS_KEY),
        COUNTS_NAME: (COUNTS, COUNTS_KEY),
        MENTIONS_NAME: (MENTIONS, MENTIONS_KEY),
        RANKED_NAME: (RANKED, RANKED_KEY),
        FOUND_NAME: (FOUND, FOUND_KEY),
    }[relation]
    types = dict(columns)
    for column, direction in reversed(comparators + [[column, ASC] for column in key]):
        rows = sorted(
            rows,
            key=lambda row: (
                row[column] != "",
                xsd.date_time_seconds(row[column]) if types[column] == "time" and row[column] != "" else row[column],
            ),
            reverse=direction == DESC,
        )
    return rows


def page(rows, relation, comparators, offset):
    # /lookup/find page 1
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.4 OFFSET/1 to /15 Solution Sequences and Modifiers/15.4 OFFSET/1
    # SPARQL11-QUERY /15 Solution Sequences and Modifiers/15.5 LIMIT/1 to /15 Solution Sequences and Modifiers/15.5 LIMIT/1
    return order(rows, relation, comparators)[offset:offset + PAGE_SIZE]


def aggregate(rows, columns, entities):
    # /lookup/find aggregate 1
    # SPARQL11-QUERY /11 Aggregates/11.2 GROUP BY/1 to /11 Aggregates/11.2 GROUP BY/1
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.2 Count/6
    # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/8
    groups = {}
    for row in rows:
        groups.setdefault(tuple(row[column] for column in columns), set()).add(row["graph name"])
    aggregated = []
    for values, graph_names in groups.items():
        times = [entity["time"] for entity in entities if entity["activity"] in graph_names and entity["time"] != ""]
        aggregated.append({
            **dict(zip(columns, values)),
            COUNT: len(graph_names),
            LAST: max(times, key=xsd.date_time_seconds) if times else "",
        })
    return aggregated


def name_concepts(dataset, concepts):
    # /lookup/find name_concepts 1
    # SKOS-REFERENCE /5. Lexical Labels/5.2. Vocabulary/1 to /5. Lexical Labels/5.2. Vocabulary/2
    headed = []
    for concept in concepts:
        if concept in [row["concept"] for row in headed]:
            continue
        names = order(skos.labels(dataset, concept), skos.CONCEPTS_NAME, [])
        groups = aggregate(
            [
                row
                for row in dataset
                if row["subject"] == concept and row["predicate"] in (skos.SKOS_PREF_LABEL, skos.SKOS_ALT_LABEL)
            ],
            COUNTS_KEY,
            [],
        )
        weights = [
            max(
                [
                    (group[COUNT], group["predicate"] == skos.SKOS_PREF_LABEL)
                    for group in groups
                    if group["object"] == name["lexical label"] and group["language tag"] == name["language tag"]
                ],
                default=(0, False),
            )
            for name in names
        ]
        headed.append(names[weights.index(max(weights))])
    return headed


def mentions(dataset, concepts):
    # /lookup/find mentions 1
    found = []
    for concept in concepts:
        name = name_concepts(dataset, [concept])[0]
        for row in statements_about(dataset, concept):
            mention = {**name, "graph name": row["graph name"]}
            if mention not in found:
                found.append(mention)
    return found


def statements_about(dataset, subject):
    # /lookup/find statements_about 1
    # SPARQL11-QUERY /5 Graph Patterns/5.1 Basic Graph Patterns/1 to /5 Graph Patterns/5.1 Basic Graph Patterns/2
    # SPARQL11-QUERY /18 Definition of SPARQL/18.4 Property Path Patterns/51 to /18 Definition of SPARQL/18.4 Property Path Patterns/53
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.1 Functional Forms/17.4.1.7 RDFterm-equal/5
    return [
        row
        for row in dataset
        if row["subject"] == subject or (row["object"] == subject and row["datatype IRI"] == "")
    ]


def graphs_of(dataset, counts):
    # /lookup/find graphs_of 1
    # SPARQL11-QUERY /5 Graph Patterns/5.1 Basic Graph Patterns/1 to /5 Graph Patterns/5.1 Basic Graph Patterns/2
    triples = {(row["subject"], row["predicate"], row["object"], row["datatype IRI"], row["language tag"]) for row in counts}
    return [
        row
        for row in dataset
        if (row["subject"], row["predicate"], row["object"], row["datatype IRI"], row["language tag"]) in triples
    ]


def match_labels(dataset, label):
    # /lookup/find match_labels 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
    # SKOS-REFERENCE /5. Lexical Labels/5.1. Preamble/4 to /5. Lexical Labels/5.1. Preamble/4
    # SKOS-REFERENCE /5. Lexical Labels/5.2. Vocabulary/1 to /5. Lexical Labels/5.2. Vocabulary/3
    subjects = []
    for row in dataset:
        if (
            row["predicate"] in (skos.SKOS_PREF_LABEL, skos.SKOS_ALT_LABEL, skos.SKOS_HIDDEN_LABEL)
            and label in row["object"]
            and row["subject"] not in subjects
        ):
            subjects.append(row["subject"])
    return name_concepts(dataset, subjects)


def generated_by(entities, runs, activity):
    # /lookup/find generated_by 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/5 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/6
    generated = [entity for entity in entities if entity["activity"] == activity]
    names = {entity["entity"] for entity in generated}
    return generated, [run for run in runs if run["entity"] in names]


def match_text(entities, runs, text):
    # /lookup/find match_text 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
    found = []
    for entity in entities:
        if text in relations.entity_text([run for run in runs if run["entity"] == entity["entity"]]):
            found.append({column: entity[column] for column, type in FOUND})
    return found
