import time

from . import tasks
from .banker import obtain
from .mtsv import generate, sheet
from .relations import pathnames, provenance_rows
from .sparql import parse, results
from .turtle import TRIPLES, TRIPLES_NAME
from .types import canonical_date_time
from .utility import ask, construct, describe, distinct, eval, project, slice
from .values import PAGE_SIZE
from .wording import QUERY

# /behavior/drivers/find find 3
NO_ITEM = "no item"
# /behavior/drivers/find find 7
NO_QUERY = "no query"


def _projected(algebra):
    while algebra[0] != "Project":
        algebra = algebra[1]
    return algebra[2]


def find(directory, args):
    action = args["action"]
    # /behavior/drivers/find find 2
    offset = args.get("offset", 0)
    if action == QUERY:
        # /behavior/drivers/find find 7
        if not args.get("query"):
            raise ValueError(NO_QUERY)
        # /behavior/drivers/find find 4
        query = parse(args["query"])
        entities_book, words_book, dataset_book = pathnames(directory)
        dataset = obtain(dataset_book) + provenance_rows(obtain(entities_book), obtain(words_book))
        solutions = eval(query, dataset, canonical_date_time(time.time()))
        form = query[2][0]
        if form == "SELECT":
            return results(_projected(query[0]), slice(solutions, offset, PAGE_SIZE))
        # /behavior/drivers/find find 5
        if form == "ASK":
            return results([], [], boolean="true" if ask(solutions)[0]["boolean"] else "false")
        # /behavior/drivers/find find 6
        # RDF11-CONCEPTS /3. RDF Graphs/1 to /3. RDF Graphs/1
        if form == "CONSTRUCT":
            triples = construct(query[2][1], solutions)
        else:
            resources = []
            for part in query[2][1]:
                if isinstance(part, str):
                    resources += [solution[part[1:]][0] for solution in solutions if part[1:] in solution]
                else:
                    resources.append(part[0])
            triples = describe(dataset, list(dict.fromkeys(resources)))
        header = [column for column, _ in TRIPLES]
        page = slice(distinct(project(triples, header)), offset, PAGE_SIZE)
        return generate([sheet(TRIPLES_NAME, header, page)])
    # /behavior/drivers/find find 3
    takes_item, may_be_empty = tasks.mantra()[action]
    if takes_item and not may_be_empty and not args.get("item"):
        raise ValueError(NO_ITEM)
    # /behavior/drivers/find find 1
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    program = {
        tasks.OVERVIEW: tasks.overview,
        tasks.ZOOM: tasks.zoom,
        tasks.FILTER: tasks.filter,
        tasks.DETAILS_ON_DEMAND: tasks.details_on_demand,
        tasks.RELATE: tasks.relate,
    }[action]
    if action == tasks.FILTER:
        return program(directory, args.get("item", ""), offset, before=args.get("before", ""), after=args.get("after", ""))
    if takes_item:
        return program(directory, args["item"], offset)
    return program(directory, offset)
