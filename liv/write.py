from .banker import insert
from .modes import can_write
from .mtsv import generate, sheet
from .relations import DATASET, DATASET_NAME, MINTED, MINTED_NAME, dataset_rows
from .turtle import parse

# /behavior/drivers/write write_triples 1
NO_TURN = "no turn"


def write_triples(dataset_book, activity, statements):
    # /behavior/drivers/write write_triples 1
    if not can_write(activity):
        raise ValueError(NO_TURN)
    # /behavior/drivers/write write_triples 2
    # SKOS-REFERENCE /1. Introduction/1.8. Conformance/1 to /1. Introduction/1.8. Conformance/2
    # RDF11-CONCEPTS /4. RDF Datasets/3 to /4. RDF Datasets/3
    # SKOS-REFERENCE /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/4 to /4. Concept Schemes/4.6. Notes/4.6.3. Top Concepts and Semantic Relations/4
    dataset, minted = dataset_rows(parse(statements), activity)
    insert(dataset_book, DATASET_NAME, [column for column, _ in DATASET], dataset)
    # /behavior/drivers/write write_triples 3
    # RDF11-CONCEPTS /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/2 to /3. RDF Graphs/3.5 Replacing Blank Nodes with IRIs/3
    return generate([sheet(MINTED_NAME, [column for column, _ in MINTED], minted)])
