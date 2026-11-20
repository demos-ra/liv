import os

from .mtsv import generate, parse, record, sheet
from .turtle import RDF_LANG_STRING, RDF_TYPE, XSD_STRING
from .types import XSD_DATE_TIME, urn, uuid4

ENTITIES_BOOK = "entities.mtsv"
WORDS_BOOK = "words.mtsv"
DATASET_BOOK = "dataset.mtsv"
PROV = "http://www.w3.org/ns/prov#"
PROV_PERSON = PROV + "Person"
PROV_SOFTWARE_AGENT = PROV + "SoftwareAgent"
PROV_ENTITY = PROV + "Entity"
PROV_ACTIVITY = PROV + "Activity"
PROV_WAS_GENERATED_BY = PROV + "wasGeneratedBy"
PROV_WAS_ATTRIBUTED_TO = PROV + "wasAttributedTo"
PROV_GENERATED_AT_TIME = PROV + "generatedAtTime"
PROV_VALUE = PROV + "value"
ENTITIES_NAME = "entities"
ENTITIES = [("entity", "iri"), ("activity", "iri"), ("agent", "agent type"), ("time", "time")]
ENTITIES_KEY = ["entity"]
WORDS_NAME = "words"
WORDS = [("entity", "iri"), ("text", "string")]
WORDS_KEY = ["entity"]
DATASET_NAME = "dataset"
DATASET = [
    ("subject", "term"),
    ("predicate", "iri"),
    ("object", "term"),
    ("datatype IRI", "iri"),
    ("language tag", "string"),
    ("graph name", "iri"),
]
DATASET_KEY = ["subject", "predicate", "object", "datatype IRI", "language tag", "graph name"]
MINTED_NAME = "minted"
MINTED = [("blank node", "string"), ("Skolem IRI", "iri")]
MINTED_KEY = ["blank node"]


def pathnames(directory):
    # /interface/relations pathnames 1
    # PARNAS1985 /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.4 SYSTEM GENERATION MODULE/1 to /III. A-7E MODULE STRUCTURE/B: SECOND-LEVEL DECOMPOSITION/B:3 SOFTWARE DECISION MODULE DECOMPOSITION/B:3.4 SYSTEM GENERATION MODULE/1
    return os.path.join(directory, ENTITIES_BOOK), os.path.join(directory, WORDS_BOOK), os.path.join(directory, DATASET_BOOK)


def activity():
    # /interface/relations activity 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/1
    return urn(uuid4())


def entity_rows(activity, agent, time, text):
    # /interface/relations entity_rows 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/3
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/9
    # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.2 Attribution/1 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.2 Attribution/6
    # PROV-DM /5. PROV-DM Types and Relations/5.7 Further Elements of PROV-DM/5.7.3 Value/21 to /5. PROV-DM Types and Relations/5.7 Further Elements of PROV-DM/5.7.3 Value/21
    entity = urn(uuid4())
    entities = [{"entity": entity, "activity": activity, "agent": agent, "time": time}]
    # /interface/relations entity_rows 2
    words = [{"entity": entity, "text": text}]
    return entities, words


def dataset_rows(triples, graph_name):
    minted = []
    labels = {}

    # /interface/relations dataset_rows 2
    # RDF11-CONCEPTS /3. RDF Graphs/3.4 Blank Nodes/2 to /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/3
    def skolem(term):
        if not term.startswith("_:"):
            return term
        if term not in labels:
            labels[term] = urn(uuid4())
            # /interface/relations dataset_rows 3
            # RDF11-CONCEPTS /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/2 to /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/3
            minted.append({"blank node": term, "Skolem IRI": labels[term]})
        return labels[term]

    # /interface/relations dataset_rows 1
    # RDF11-CONCEPTS /4. RDF Datasets/3 to /4. RDF Datasets/5
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3
    dataset = []
    for triple in triples:
        literal = triple["datatype IRI"] != ""
        dataset.append({
            "subject": skolem(triple["subject"]),
            "predicate": triple["predicate"],
            "object": triple["object"] if literal else skolem(triple["object"]),
            # /interface/relations dataset_rows 4
            # RDF11-CONCEPTS /3. RDF Graphs/3.3 Literals/5 to /3. RDF Graphs/3.3 Literals/7
            "datatype IRI": "" if triple["datatype IRI"] == RDF_LANG_STRING else triple["datatype IRI"],
            "language tag": triple["language tag"],
            "graph name": graph_name,
        })
    return dataset, minted


def provenance_rows(entities, words):
    texts = {row["entity"]: row["text"] for row in words}
    dataset = []

    def statement(subject, predicate, object, graph_name, datatype=""):
        dataset.append({
            "subject": subject,
            "predicate": predicate,
            "object": object,
            "datatype IRI": datatype,
            "language tag": "",
            "graph name": graph_name,
        })

    for place, row in enumerate(entities, 1):
        entity, graph_name = row["entity"], row["activity"]
        # /interface/relations provenance_rows 1
        # PROV-O /4. Cross reference for PROV-O classes and properties/(1) Class: prov:Entity back to starting-point classes/1 to /4. Cross reference for PROV-O classes and properties/(1) Class: prov:Entity back to starting-point classes/2
        # PROV-O /4. Cross reference for PROV-O classes and properties/(2) Class: prov:Activity back to starting-point classes/1 to /4. Cross reference for PROV-O classes and properties/(2) Class: prov:Activity back to starting-point classes/2
        statement(entity, RDF_TYPE, PROV_ENTITY, graph_name)
        statement(graph_name, RDF_TYPE, PROV_ACTIVITY, graph_name)
        # /interface/relations provenance_rows 2
        # PROV-O /4. Cross reference for PROV-O classes and properties/(4) Property: prov:wasGeneratedBy op back to starting-point properties/1 to /4. Cross reference for PROV-O classes and properties/(4) Property: prov:wasGeneratedBy op back to starting-point properties/2
        statement(entity, PROV_WAS_GENERATED_BY, graph_name, graph_name)
        # /interface/relations provenance_rows 3
        # PROV-O /4. Cross reference for PROV-O classes and properties/(22) Property: prov:generatedAtTime dp back to expanded properties/1 to /4. Cross reference for PROV-O classes and properties/(22) Property: prov:generatedAtTime dp back to expanded properties/23
        if row["time"]:
            statement(entity, PROV_GENERATED_AT_TIME, row["time"], graph_name, XSD_DATE_TIME)
        # /interface/relations provenance_rows 4
        # PROV-O /4. Cross reference for PROV-O classes and properties/(6) Property: prov:wasAttributedTo op back to starting-point properties/1 to /4. Cross reference for PROV-O classes and properties/(6) Property: prov:wasAttributedTo op back to starting-point properties/31
        # PROV-O /4. Cross reference for PROV-O classes and properties/(16) Class: prov:Person back to expanded classes/1 to /4. Cross reference for PROV-O classes and properties/(16) Class: prov:Person back to expanded classes/2
        # PROV-O /4. Cross reference for PROV-O classes and properties/(17) Class: prov:SoftwareAgent back to expanded classes/1 to /4. Cross reference for PROV-O classes and properties/(17) Class: prov:SoftwareAgent back to expanded classes/2
        agent = "_:" + "agent" + str(place)
        statement(entity, PROV_WAS_ATTRIBUTED_TO, agent, graph_name)
        statement(agent, RDF_TYPE, row["agent"], graph_name)
        # /interface/relations provenance_rows 5
        # PROV-O /4. Cross reference for PROV-O classes and properties/(24) Property: prov:value dp back to expanded properties/1 to /4. Cross reference for PROV-O classes and properties/(24) Property: prov:value dp back to expanded properties/19
        if entity in texts:
            statement(entity, PROV_VALUE, texts[entity], graph_name, XSD_STRING)
    return dataset


def sheet_text(sheet_name, header, rows):
    # /interface/relations sheet_text 1
    # MTSV-DRAFT /Generators/3 to /Generators/3
    sheet_text = generate([sheet(sheet_name, header, rows)])
    # /interface/relations sheet_text 2
    # MTSV-DRAFT /Generators/1 to /Generators/2
    records_text = "".join(record([row[column] for column in header]) for row in rows)
    return sheet_text, records_text


def sheet_rows(text):
    # /interface/relations sheet_rows 1
    if text == "":
        return []
    # /interface/relations sheet_rows 2
    # MTSV-DRAFT /Data Model/1 to /Data Model/1
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/7 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/7
    sheets, fields = parse(text)
    records = {}
    for field in fields:
        if field["Sheet"] == 1:
            records.setdefault(field["Record"], []).append(field["Text"])
    header = records.pop(0, [])
    rows = []
    seen = set()
    for place in sorted(records):
        values = tuple(records[place])
        if values not in seen:
            seen.add(values)
            rows.append(dict(zip(header, values)))
    return rows
