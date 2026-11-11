from . import address
from . import find
from . import mtsv
from . import relations
from . import skos
from . import store

OVERVIEW = "overview"
ZOOM = "zoom"
FILTER = "filter"
DETAILS_ON_DEMAND = "details-on-demand"
VISUAL_INFORMATION_SEEKING_MANTRA = [OVERVIEW, ZOOM, FILTER, DETAILS_ON_DEMAND]
ITEM = "item"


def overview(directory, offset):
    # /view/mantra overview 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    entities_book, runs_book, dataset_book = address.book_paths(directory)
    dataset = store.read(dataset_book)
    ranked = find.page(
        find.aggregate(find.mentions(dataset, skos.top_concepts(dataset)), find.RANKED_KEY, store.read(entities_book)),
        find.RANKED_NAME,
        [[find.COUNT, find.DESC]],
        offset,
    )
    return mtsv.generate([mtsv.sheet(find.RANKED_NAME, [column for column, type in find.RANKED], ranked)])


def zoom(directory, item, offset):
    # /view/mantra zoom 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/33 to /3. Task by Data Type Taxonomy/33
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/28 to /3. Task by Data Type Taxonomy/28
    # SKOS-REFERENCE /8. Semantic Relations/8.6. Notes/8.6.9. Alternate Paths in the Hierarchical Relation/7 to /8. Semantic Relations/8.6. Notes/8.6.9. Alternate Paths in the Hierarchical Relation/8
    entities_book, runs_book, dataset_book = address.book_paths(directory)
    dataset = store.read(dataset_book)
    concepts = find.page(find.name_concepts(dataset, skos.narrower(dataset, item)), skos.CONCEPTS_NAME, [], offset)
    return mtsv.generate([mtsv.sheet(skos.CONCEPTS_NAME, [column for column, type in skos.CONCEPTS], concepts)])


def filter(directory, item, offset):
    # /view/mantra filter 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/34 to /3. Task by Data Type Taxonomy/35
    entities_book, runs_book, dataset_book = address.book_paths(directory)
    concepts = find.page(find.match_labels(store.read(dataset_book), item), skos.CONCEPTS_NAME, [], offset)
    found = find.page(find.match_text(store.read(entities_book), store.read(runs_book), item), find.FOUND_NAME, [], offset)
    return mtsv.generate([
        mtsv.sheet(skos.CONCEPTS_NAME, [column for column, type in skos.CONCEPTS], concepts),
        mtsv.sheet(find.FOUND_NAME, [column for column, type in find.FOUND], found),
    ])


def details_on_demand(directory, item, offset):
    # /view/mantra details_on_demand 1
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/36 to /3. Task by Data Type Taxonomy/36
    # SHNEIDERMAN1996 /3. Task by Data Type Taxonomy/32 to /3. Task by Data Type Taxonomy/32
    entities_book, runs_book, dataset_book = address.book_paths(directory)
    entities = store.read(entities_book)
    if any(entity["activity"] == item for entity in entities):
        generated, runs = find.generated_by(entities, store.read(runs_book), item)
        runs = find.page(runs, relations.RUNS_NAME, [], offset)
        names = {run["entity"] for run in runs}
        return mtsv.generate([
            mtsv.sheet(
                relations.ENTITIES_NAME,
                [column for column, type in relations.ENTITIES],
                [entity for entity in generated if entity["entity"] in names],
            ),
            mtsv.sheet(relations.RUNS_NAME, [column for column, type in relations.RUNS], runs),
        ])
    dataset = store.read(dataset_book)
    counts = find.page(
        find.aggregate(find.statements_about(dataset, item), find.COUNTS_KEY, entities),
        find.COUNTS_NAME,
        [[find.COUNT, find.DESC]],
        offset,
    )
    return mtsv.generate([
        mtsv.sheet(find.COUNTS_NAME, [column for column, type in find.COUNTS], counts),
        mtsv.sheet(relations.DATASET_NAME, [column for column, type in relations.DATASET], find.graphs_of(dataset, counts)),
    ])
