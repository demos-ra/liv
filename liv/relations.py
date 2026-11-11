from . import mtsv
from . import turtle
from . import uuid

PROV = "http://www.w3.org/ns/prov#"
PROV_PERSON = PROV + "Person"
PROV_SOFTWARE_AGENT = PROV + "SoftwareAgent"
ENTITIES = [("entity", "iri"), ("activity", "iri"), ("agent", "agent type"), ("time", "time")]
ENTITIES_NAME = "entities"
ENTITIES_KEY = ["entity"]
RUNS = [("entity", "iri"), ("run", "integer"), ("text", "string"), ("end", "string")]
RUNS_NAME = "runs"
RUNS_KEY = ["entity", "run"]
DATASET = [
    ("subject", "iri"),
    ("predicate", "iri"),
    ("object", "term"),
    ("datatype IRI", "iri"),
    ("language tag", "string"),
    ("graph name", "iri"),
]
DATASET_NAME = "dataset"
DATASET_KEY = ["subject", "predicate", "object", "datatype IRI", "language tag", "graph name"]
# /data/relations entity_rows 2
# MTSV-DRAFT /Syntax/Sheet Name/1 to /Syntax/Sheet Name/1
# MTSV-DRAFT /Generators/4 to /Generators/4
# CODD1970 /1. Relational Model and Normal Form/1.4. Normal Form/16 to /1. Relational Model and Normal Form/1.4. Normal Form/16
ENDS = {mtsv.HT: "HT", mtsv.LF: "LF", mtsv.FF: "FF", mtsv.CR: "CR"}


def activity():
    # /data/relations activity 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/1
    return uuid.uuid4()


def entity_rows(activity, agent, time, text):
    # /data/relations entity_rows 1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.1 Entity/3
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/1
    # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/9
    # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.2 Attribution/1 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.2 Attribution/6
    # PROV-DM /5. PROV-DM Types and Relations/5.7 Further Elements of PROV-DM/5.7.3 Value/21 to /5. PROV-DM Types and Relations/5.7 Further Elements of PROV-DM/5.7.3 Value/21
    entities = [{"entity": uuid.uuid4(), "activity": activity, "agent": agent, "time": time}]
    # /data/relations entity_rows 2
    # MTSV-DRAFT /Syntax/Sheet Name/1 to /Syntax/Sheet Name/1
    # MTSV-DRAFT /Generators/4 to /Generators/4
    # CODD1970 /1. Relational Model and Normal Form/1.4. Normal Form/16 to /1. Relational Model and Normal Form/1.4. Normal Form/16
    runs = []
    run = ""
    for character in text:
        if character in ENDS:
            runs.append({"entity": entities[0]["entity"], "run": len(runs) + 1, "text": run, "end": ENDS[character]})
            run = ""
        else:
            run += character
    runs.append({"entity": entities[0]["entity"], "run": len(runs) + 1, "text": run, "end": ""})
    return entities, runs


def entity_text(runs):
    # /data/relations entity_text 1
    # CODD1970 /1. Relational Model and Normal Form/1.3. A Relational View of Data/44 to /1. Relational Model and Normal Form/1.3. A Relational View of Data/44
    characters = {end: character for character, end in ENDS.items()}
    text = ""
    for run in sorted(runs, key=lambda run: run["run"]):
        text += run["text"] + characters.get(run["end"], "")
    return text


def dataset_rows(triples, graph_name):
    dataset = []
    names = {}
    for triple in triples:
        subject = triple["subject"]
        object = triple["object"]
        # /data/relations dataset_rows 2
        # RDF11-CONCEPTS /3. RDF Graphs/3.4 Blank Nodes/2 to /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/3
        for term in (subject, object if triple["datatype IRI"] == "" else ""):
            if term.startswith(turtle.BLANK_NODE_PREFIX) and term not in names:
                names[term] = uuid.uuid4()
        subject = names.get(subject, subject)
        if triple["datatype IRI"] == "":
            object = names.get(object, object)
        # /data/relations dataset_rows 1
        # RDF11-CONCEPTS /4. RDF Datasets/3 to /4. RDF Datasets/5
        # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.2 Activity/3
        dataset.append({
            "subject": subject,
            "predicate": triple["predicate"],
            "object": object,
            "datatype IRI": triple["datatype IRI"],
            "language tag": triple["language tag"],
            "graph name": graph_name,
        })
    return dataset
