from . import relations
from . import store
from . import turtle

SCHEME = "urn:uuid:bdf584d7-8ab9-407a-b948-d604e4c5f1ce"
SKOS = "http://www.w3.org/2004/02/skos/core#"
SKOS_CONCEPT = SKOS + "Concept"
SKOS_CONCEPT_SCHEME = SKOS + "ConceptScheme"
SKOS_IN_SCHEME = SKOS + "inScheme"
SKOS_HAS_TOP_CONCEPT = SKOS + "hasTopConcept"
SKOS_TOP_CONCEPT_OF = SKOS + "topConceptOf"
SKOS_PREF_LABEL = SKOS + "prefLabel"
SKOS_ALT_LABEL = SKOS + "altLabel"
SKOS_HIDDEN_LABEL = SKOS + "hiddenLabel"
SKOS_SEMANTIC_RELATION = SKOS + "semanticRelation"
SKOS_BROADER = SKOS + "broader"
SKOS_NARROWER = SKOS + "narrower"
SKOS_RELATED = SKOS + "related"
SKOS_BROADER_TRANSITIVE = SKOS + "broaderTransitive"
SKOS_NARROWER_TRANSITIVE = SKOS + "narrowerTransitive"
CONCEPTS = [("concept", "iri"), ("lexical label", "string"), ("language tag", "string")]
CONCEPTS_NAME = "concepts"
CONCEPTS_KEY = ["concept", "lexical label", "language tag"]
# /knowledge/skos integrity_check 1
# SKOS-REFERENCE /5. Lexical Labels/5.4. Integrity Conditions/2 to /5. Lexical Labels/5.4. Integrity Conditions/2
# SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
S14 = "S14"
# /knowledge/skos integrity_check 2
# SKOS-REFERENCE /5. Lexical Labels/5.4. Integrity Conditions/1 to /5. Lexical Labels/5.4. Integrity Conditions/1
# SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
S13 = "S13"
# /knowledge/skos integrity_check 3
# SKOS-REFERENCE /4. Concept Schemes/4.3. Class & Property Definitions/3 to /4. Concept Schemes/4.4. Integrity Conditions/1
# SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/2 to /8. Semantic Relations/8.3. Class & Property Definitions/5
# SKOS-REFERENCE /3. The skos:Concept Class/3.3. Class & Property Definitions/1 to /3. The skos:Concept Class/3.3. Class & Property Definitions/1
# RDF-SCHEMA /3. Properties/3.3 rdf:type/1 to /3. Properties/3.3 rdf:type/4
# SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
S9 = "S9"
# /knowledge/skos integrity_check 4
# SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/4 to /8. Semantic Relations/8.3. Class & Property Definitions/9
# SKOS-REFERENCE /8. Semantic Relations/8.4. Integrity Conditions/1 to /8. Semantic Relations/8.4. Integrity Conditions/2
# SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
S27 = "S27"


def labels(dataset, concept):
    # /knowledge/skos labels 1
    # SKOS-REFERENCE /5. Lexical Labels/5.1. Preamble/3 to /5. Lexical Labels/5.1. Preamble/5
    # SKOS-REFERENCE /5. Lexical Labels/5.4. Integrity Conditions/2 to /5. Lexical Labels/5.4. Integrity Conditions/2
    concepts = []
    for row in dataset:
        if row["subject"] == concept and row["predicate"] in (SKOS_PREF_LABEL, SKOS_ALT_LABEL):
            name = {"concept": concept, "lexical label": row["object"], "language tag": row["language tag"]}
            if name not in concepts:
                concepts.append(name)
    return concepts or [{"concept": concept, "lexical label": "", "language tag": ""}]


def top_concepts(dataset):
    # /knowledge/skos top_concepts 1
    # SKOS-REFERENCE /4. Concept Schemes/4.3. Class & Property Definitions/7 to /4. Concept Schemes/4.3. Class & Property Definitions/7
    # SKOS-REFERENCE /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1 to /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/1
    concepts = []
    for row in dataset:
        if row["predicate"] == SKOS_TOP_CONCEPT_OF and row["object"] == SCHEME:
            concept = row["subject"]
        elif row["subject"] == SCHEME and row["predicate"] == SKOS_HAS_TOP_CONCEPT:
            concept = row["object"]
        else:
            continue
        if concept not in concepts:
            concepts.append(concept)
    return concepts


def narrower(dataset, concept):
    # /knowledge/skos narrower 1
    # SKOS-REFERENCE /8. Semantic Relations/8.1. Preamble/3 to /8. Semantic Relations/8.1. Preamble/3
    # SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/8 to /8. Semantic Relations/8.3. Class & Property Definitions/8
    concepts = []
    for row in dataset:
        if row["predicate"] == SKOS_BROADER and row["object"] == concept:
            found = row["subject"]
        elif row["subject"] == concept and row["predicate"] == SKOS_NARROWER:
            found = row["object"]
        else:
            continue
        if found not in concepts:
            concepts.append(found)
    return concepts


def integrity_check(dataset, new):
    rows = dataset + new
    # /knowledge/skos integrity_check 1
    # SKOS-REFERENCE /5. Lexical Labels/5.4. Integrity Conditions/2 to /5. Lexical Labels/5.4. Integrity Conditions/2
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    preferred = {}
    for row in rows:
        if row["predicate"] == SKOS_PREF_LABEL:
            if preferred.setdefault((row["subject"], row["language tag"]), row["object"]) != row["object"]:
                raise ValueError(S14 + " " + row["subject"])
    # /knowledge/skos integrity_check 2
    # SKOS-REFERENCE /5. Lexical Labels/5.4. Integrity Conditions/1 to /5. Lexical Labels/5.4. Integrity Conditions/1
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    labelled = {}
    for row in rows:
        if row["predicate"] in (SKOS_PREF_LABEL, SKOS_ALT_LABEL, SKOS_HIDDEN_LABEL):
            label = (row["subject"], row["object"], row["language tag"])
            if labelled.setdefault(label, row["predicate"]) != row["predicate"]:
                raise ValueError(S13 + " " + row["subject"])
    # /knowledge/skos integrity_check 3
    # SKOS-REFERENCE /4. Concept Schemes/4.3. Class & Property Definitions/3 to /4. Concept Schemes/4.4. Integrity Conditions/1
    # SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/2 to /8. Semantic Relations/8.3. Class & Property Definitions/5
    # SKOS-REFERENCE /3. The skos:Concept Class/3.3. Class & Property Definitions/1 to /3. The skos:Concept Class/3.3. Class & Property Definitions/1
    # RDF-SCHEMA /3. Properties/3.3 rdf:type/1 to /3. Properties/3.3 rdf:type/4
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    schemes = set()
    concepts = set()
    for row in rows:
        subject, predicate, object = row["subject"], row["predicate"], row["object"]
        if predicate == turtle.RDF_TYPE and object == SKOS_CONCEPT_SCHEME:
            schemes.add(subject)
        if predicate == turtle.RDF_TYPE and object == SKOS_CONCEPT:
            concepts.add(subject)
        if predicate in (SKOS_IN_SCHEME, SKOS_TOP_CONCEPT_OF):
            schemes.add(object)
        if predicate == SKOS_HAS_TOP_CONCEPT:
            schemes.add(subject)
            concepts.add(object)
        if predicate == SKOS_TOP_CONCEPT_OF:
            concepts.add(subject)
        if predicate in (
            SKOS_SEMANTIC_RELATION,
            SKOS_BROADER,
            SKOS_NARROWER,
            SKOS_RELATED,
            SKOS_BROADER_TRANSITIVE,
            SKOS_NARROWER_TRANSITIVE,
        ):
            concepts.add(subject)
            concepts.add(object)
    for row in rows:
        for resource in (row["subject"], row["object"]):
            if resource in schemes and resource in concepts:
                raise ValueError(S9 + " " + resource)
    # /knowledge/skos integrity_check 4
    # SKOS-REFERENCE /8. Semantic Relations/8.3. Class & Property Definitions/4 to /8. Semantic Relations/8.3. Class & Property Definitions/9
    # SKOS-REFERENCE /8. Semantic Relations/8.4. Integrity Conditions/1 to /8. Semantic Relations/8.4. Integrity Conditions/2
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    broader = {}
    for row in rows:
        if row["predicate"] in (SKOS_BROADER, SKOS_BROADER_TRANSITIVE):
            broader.setdefault(row["subject"], set()).add(row["object"])
        if row["predicate"] in (SKOS_NARROWER, SKOS_NARROWER_TRANSITIVE):
            broader.setdefault(row["object"], set()).add(row["subject"])
    for row in rows:
        if row["predicate"] == SKOS_RELATED:
            for start, goal in ((row["subject"], row["object"]), (row["object"], row["subject"])):
                reached = set()
                frontier = [start]
                while frontier:
                    for step in broader.get(frontier.pop(), ()):
                        if step == goal:
                            raise ValueError(S27 + " " + row["subject"])
                        if step not in reached:
                            reached.add(step)
                            frontier.append(step)


def write_triples(dataset_book, activity, document):
    # /knowledge/skos write_triples 1
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    # RDF11-CONCEPTS /4. RDF Datasets/3 to /4. RDF Datasets/3
    dataset = relations.dataset_rows(turtle.parse(document), activity)
    integrity_check(store.read(dataset_book), dataset)
    store.append(dataset_book, relations.DATASET_NAME, [column for column, type in relations.DATASET], dataset)
    return dataset
