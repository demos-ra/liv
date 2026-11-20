from .banker import obtain
from .mtsv import generate, sheet
from .relations import ENTITIES, ENTITIES_KEY, ENTITIES_NAME, WORDS, WORDS_KEY, WORDS_NAME, pathnames
from .turtle import RDF_TYPE, XSD_STRING
from .types import date_time_seconds
from .utility import aggregate, functions, join, match, minus, order, slice, union
from .values import (
    COUNTS,
    COUNTS_KEY,
    COUNTS_NAME,
    PAGE_SIZE,
    RANKED,
    RANKED_KEY,
    RANKED_NAME,
    SKOS_ALT_LABEL,
    SKOS_BROADER,
    SKOS_CHANGE_NOTE,
    SKOS_CONCEPT,
    SKOS_DEFINITION,
    SKOS_EDITORIAL_NOTE,
    SKOS_EXAMPLE,
    SKOS_HIDDEN_LABEL,
    SKOS_HISTORY_NOTE,
    SKOS_NARROWER,
    SKOS_NOTE,
    SKOS_PREF_LABEL,
    SKOS_RELATED,
    SKOS_SCOPE_NOTE,
    comparators,
    counted,
    narrower,
    ranked,
    statements_about,
)

# /behavior/shared/tasks mantra 1
# SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
# SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/1 to /3. Task by Data Type Taxonomy/1
# SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/11
# SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
# FUNCOP /7 Functions on Strings/7.5 Functions Based on Substring Matching/7.5.1 fn:contains/9 to /7 Functions on Strings/7.5 Functions Based on Substring Matching/7.5.1 fn:contains/9
OVERVIEW = "overview"
ZOOM = "zoom"
FILTER = "filter"
DETAILS_ON_DEMAND = "details-on-demand"
RELATE = "relate"
ITEM = "item"
TURNS_NAME = "turns"
TURNS = [("graph name", "iri"), ("last", "time")]
TURNS_KEY = ["graph name"]
FOUND_NAME = "found"
FOUND = [("entity", "iri"), ("activity", "iri"), ("agent", "agent type"), ("time", "time")]
FOUND_KEY = ["entity"]
SIMILAR_NAME = "similar"
SIMILAR = [("concept", "iri"), ("predicate", "iri"), ("object", "term"), ("datatype IRI", "iri"), ("language tag", "string")]
SIMILAR_KEY = ["concept", "predicate", "object", "datatype IRI", "language tag"]
# /behavior/shared/tasks topmost 1
# SKOS-REFERENCE /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1 to /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1
# SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/8 to /8. Semantic Relations/8.3. Class & Property Definitions/8
# SPARQL11-QUERY /8 Negation/8.2 Removing Possible Solutions/1 to /8 Negation/8.2 Removing Possible Solutions/1
# SKOS-REFERENCE /3. The skos:Concept Class/3.2. Vocabulary/1 to /3. The skos:Concept Class/3.2. Vocabulary/1
# SKOS-REFERENCE /7. Documentation Properties (Note Properties)/7.1. Preamble/2 to /7. Documentation Properties (Note Properties)/7.2. Vocabulary/7
# SKOS-REFERENCE /8. Semantic Relations/8.2. Vocabulary/4 to /8. Semantic Relations/8.2. Vocabulary/4
LABELS = (SKOS_PREF_LABEL, SKOS_ALT_LABEL, SKOS_HIDDEN_LABEL)
NOTES = (SKOS_NOTE, SKOS_CHANGE_NOTE, SKOS_DEFINITION, SKOS_EDITORIAL_NOTE, SKOS_EXAMPLE, SKOS_HISTORY_NOTE, SKOS_SCOPE_NOTE)
SEMANTIC = (SKOS_BROADER, SKOS_NARROWER, SKOS_RELATED)


def _distinct(values):
    return list(dict.fromkeys(values))


def mantra():
    # /behavior/shared/tasks mantra 1
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/1 to /3. Task by Data Type Taxonomy/1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/11
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
    # FUNCOP /7 Functions on Strings/7.5 Functions Based on Substring Matching/7.5.1 fn:contains/9 to /7 Functions on Strings/7.5 Functions Based on Substring Matching/7.5.1 fn:contains/9
    return {
        OVERVIEW: (False, False),
        ZOOM: (True, False),
        FILTER: (True, True),
        DETAILS_ON_DEMAND: (True, False),
        RELATE: (True, False),
    }


def topmost(dataset):
    # /behavior/shared/tasks topmost 1
    # SKOS-REFERENCE /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1 to /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1
    # SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/8 to /8. Semantic Relations/8.3. Class & Property Definitions/8
    # SPARQL11-QUERY /8 Negation/8.2 Removing Possible Solutions/1 to /8 Negation/8.2 Removing Possible Solutions/1
    # SKOS-REFERENCE /3. The skos:Concept Class/3.2. Vocabulary/1 to /3. The skos:Concept Class/3.2. Vocabulary/1
    # SKOS-REFERENCE /7. Documentation Properties (Note Properties)/7.1. Preamble/2 to /7. Documentation Properties (Note Properties)/7.2. Vocabulary/7
    # SKOS-REFERENCE /8. Semantic Relations/8.2. Vocabulary/4 to /8. Semantic Relations/8.2. Vocabulary/4
    things = [{"concept": row["subject"]} for row in match(dataset, {"predicate": RDF_TYPE, "object": SKOS_CONCEPT})]
    for predicate in LABELS + NOTES:
        things = union(things, [{"concept": row["subject"]} for row in match(dataset, {"predicate": predicate})])
    for predicate in SEMANTIC:
        rows = match(dataset, {"predicate": predicate})
        things = union(things, [{"concept": row["subject"]} for row in rows])
        things = union(things, [{"concept": row["object"]} for row in rows if row["datatype IRI"] == "" and row["language tag"] == ""])
    under = union(
        [{"concept": row["subject"]} for row in match(dataset, {"predicate": SKOS_BROADER})],
        [{"concept": row["object"]} for row in match(dataset, {"predicate": SKOS_NARROWER})],
    )
    return _distinct(row["concept"] for row in minus(things, under))


def match_labels(dataset, label):
    # /behavior/shared/tasks match_labels 1
    # SKOS-REFERENCE /5. Lexical Labels/5.1. Preamble/4 to /5. Lexical Labels/5.1. Preamble/4
    # SKOS-REFERENCE /5. Lexical Labels/5.2. Vocabulary/1 to /5. Lexical Labels/5.2. Vocabulary/3
    rows = []
    for predicate in LABELS:
        rows = union(rows, match(dataset, {"predicate": predicate}))
    found = []
    for row in rows:
        if _contains(row["object"], label):
            found.append(row["subject"])
    return _distinct(found)


def _contains(text, part):
    value = functions("CONTAINS", [(text, XSD_STRING, ""), (part, XSD_STRING, "")], now="", labels={})
    return value is not None and value[0] == "true"


def match_words(entities, words, text):
    # /behavior/shared/tasks match_words 1
    # SPARQL11-QUERY /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/1 to /17 Expressions and Testing Values/17.4 Function Definitions/17.4.3 Functions on Strings/17.4.3.8 CONTAINS/2
    holding = [row for row in words if _contains(row["text"], text)]
    joined = join(entities, holding)
    return [{column: row[column] for column, _ in FOUND} for row in joined]


def generated_by(entities, words, activity):
    # /behavior/shared/tasks generated_by 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/5 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/6
    generated = match(entities, {"activity": activity})
    joined = join([{"entity": row["entity"]} for row in generated], words)
    return generated, [{"entity": row["entity"], "text": row["text"]} for row in joined]


def linked(dataset, concept):
    # /behavior/shared/tasks linked 1
    # RDF11-CONCEPTS /1. Introduction/1.2 Resources and Statements/2 to /1. Introduction/1.2 Resources and Statements/2
    rows = union(
        [{"concept": row["object"]} for row in match(dataset, {"subject": concept, "datatype IRI": "", "language tag": ""})],
        [{"concept": row["subject"]} for row in match(dataset, {"object": concept, "datatype IRI": "", "language tag": ""})],
    )
    return _distinct(row["concept"] for row in rows if row["concept"] != concept)


def similar(dataset, concept):
    # /behavior/shared/tasks similar 1
    # CODD1970 /2. Redundancy and Consistency/2.1. Operations on Relations/2.1.3. Join/1 to /2. Redundancy and Consistency/2.1. Operations on Relations/2.1.3. Join/4
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/9
    columns = ["predicate", "object", "datatype IRI", "language tag"]
    own = [{column: row[column] for column in columns} for row in match(dataset, {"subject": concept})]
    others = [dict({column: row[column] for column in columns}, concept=row["subject"]) for row in dataset if row["subject"] != concept]
    found = []
    for row in join(own, others):
        found.append({"concept": row["concept"], "predicate": row["predicate"], "object": row["object"], "datatype IRI": row["datatype IRI"], "language tag": row["language tag"]})
    return list({tuple(row.values()): row for row in found}.values())


def _page(name, columns, key, rows, offset):
    # /behavior/shared/tasks overview 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    page = slice(order(rows, columns, key, comparators(columns)), offset, PAGE_SIZE)
    header = [column for column, _ in columns]
    return sheet(name, header, [{column: row.get(column, "") for column in header} for row in page])


def _books(directory):
    entities_book, words_book, dataset_book = pathnames(directory)
    return obtain(entities_book), obtain(words_book), obtain(dataset_book)


def overview(directory, offset):
    # /behavior/shared/tasks overview 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    entities, _, dataset = _books(directory)
    return generate([_page(RANKED_NAME, RANKED, RANKED_KEY, ranked(dataset, entities, topmost(dataset)), offset)])


def zoom(directory, item, offset):
    # /behavior/shared/tasks zoom 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/33 to /3. Task by Data Type Taxonomy/33
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/28 to /3. Task by Data Type Taxonomy/28
    # SKOS-REFERENCE /8. Semantic Relations/8.6. Notes/8.6.9. Alternate Paths in the Hierarchical Relation/7 to /8. Semantic Relations/8.6. Notes/8.6.9. Alternate Paths in the Hierarchical Relation/8
    entities, _, dataset = _books(directory)
    return generate([_page(RANKED_NAME, RANKED, RANKED_KEY, ranked(dataset, entities, narrower(dataset, item)), offset)])


def _within(time, before, after):
    seconds = date_time_seconds(time) if time else None
    if before or after:
        if seconds is None:
            return False
        if before and not seconds < date_time_seconds(before):
            return False
        if after and not seconds > date_time_seconds(after):
            return False
    return True


def filter(directory, item, offset, *, before, after):
    # /behavior/shared/tasks filter 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    entities, words, dataset = _books(directory)
    concepts = match_labels(dataset, item)
    # /behavior/shared/tasks filter 2
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    found = match_words(entities, words, item)
    if before or after:
        # /behavior/shared/tasks filter 3
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/20 to /3. Task by Data Type Taxonomy/21
        # /behavior/shared/tasks filter 4
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/20 to /3. Task by Data Type Taxonomy/21
        allowed = {row["activity"] for row in entities if _within(row["time"], before, after)}
        concepts = [concept for concept in concepts if any(match(statements_about(dataset, concept), {"graph name": name}) for name in allowed)]
        found = [row for row in found if row["activity"] in allowed and _within(row["time"], before, after)]
    # /behavior/shared/tasks filter 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    first = _page(RANKED_NAME, RANKED, RANKED_KEY, ranked(dataset, entities, concepts), offset)
    # /behavior/shared/tasks filter 2
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    second = _page(FOUND_NAME, FOUND, FOUND_KEY, found, offset)
    # /behavior/shared/tasks filter 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    return generate([first, second])


def details_on_demand(directory, item, offset):
    # /behavior/shared/tasks details_on_demand 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    entities, words, dataset = _books(directory)
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    if not match(entities, {"activity": item}):
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
        rows = statements_about(dataset, item)
        first = _page(COUNTS_NAME, COUNTS, COUNTS_KEY, counted(rows, entities), offset)
        # /behavior/shared/tasks details_on_demand 2
        # SPARQL11-QUERY /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/1 to /18 Definition of SPARQL/18.5 SPARQL Algebra/18.5.1 Aggregate Algebra/18.5.1.6 Max/8
        # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/9
        # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/7 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/7
        names = list(dict.fromkeys(row["graph name"] for row in rows))
        joined = join([{"activity": name} for name in names], entities)
        last = {
            row["activity"]: row["last"]
            for row in aggregate(joined, ENTITIES, ["activity"], [{"name": "Max", "column": "time", "distinct": False, "separator": " ", "result": "last"}])
        }
        turns = [{"graph name": name, "last": last.get(name, "")} for name in names]
        second = _page(TURNS_NAME, TURNS, TURNS_KEY, turns, offset)
        # /behavior/shared/tasks details_on_demand 1
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
        # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
        return generate([first, second])
    # /behavior/shared/tasks details_on_demand 3
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
    generated, said = generated_by(entities, words, item)
    first = _page(ENTITIES_NAME, ENTITIES, ENTITIES_KEY, generated, offset)
    # /behavior/shared/tasks details_on_demand 4
    second = _page(WORDS_NAME, WORDS, WORDS_KEY, said, offset)
    # /behavior/shared/tasks details_on_demand 3
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
    return generate([first, second])


def relate(directory, item, offset):
    # /behavior/shared/tasks relate 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/9
    entities, _, dataset = _books(directory)
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/9
    first = _page(RANKED_NAME, RANKED, RANKED_KEY, ranked(dataset, entities, linked(dataset, item)), offset)
    # /behavior/shared/tasks relate 2
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/9
    second = _page(SIMILAR_NAME, SIMILAR, SIMILAR_KEY, similar(dataset, item), offset)
    # /behavior/shared/tasks relate 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/9 to /3. Task by Data Type Taxonomy/9
    return generate([first, second])
