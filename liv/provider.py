import json

from agent.memory_provider import MemoryProvider
from agent.runtime_cwd import resolve_agent_cwd

from . import address
from . import find
from . import mantra
from . import mtsv
from . import relations
from . import skos
from . import store
from . import xsd

PROVIDER_NAME = "liv"
VERSION = "0.1.0"
REPOSITORY = "https://github.com/demos-ra/liv"
MAINTAINER = "demos-ra"
WRITE_TOOL = "liv_write"
FIND_TOOL = "liv_find"
HERMES_HOME = "hermes_home"
CWD = "cwd"
AGENT_CONTEXT = "agent_context"
NAME = "name"
PARAMETERS = "parameters"
DESCRIPTION = "description"
TYPE = "type"
OBJECT = "object"
STRING = "string"
INTEGER = "integer"
ENUM = "enum"
PROPERTIES = "properties"
REQUIRED = "required"
TIMESTAMP = "timestamp"
SYSTEM_PROMPT = " ".join([
    "LIV keeps every turn of this conversation word for word, and the statements you write about it, in a memory for the directory you work in.",
    "Each turn, call ‹write tool› once with a Turtle document of what the turn said; LIV puts its triples in the turn's graph.",
    "Begin the document with a @prefix line for each prefix it uses, such as @prefix skos: <http://www.w3.org/2004/02/skos/core#> .",
    "Name a thing LIV already knows by its IRI, which ‹find tool› finds; name a new thing by a blank node such as _:kyoto, and LIV gives it an IRI.",
    "Name a thing with one skos:prefLabel for each language tag, give it a second name with skos:altLabel, and a misspelling to find it by with skos:hiddenLabel; a label is only a name, never a description or a list.",
    "Nest a thing under another with skos:broader, and mark a topmost thing with skos:topConceptOf <‹scheme›>.",
    "A document that breaks a rule is refused whole, with the reason; write it again, corrected.",
    "Before each turn you are given the overview: the top concepts, each with the number of turns that speak of it and the last time one did, the most first.",
    "Call ‹find tool› with a task: overview; zoom, with a concept's IRI, for what is under it; filter, with a text, for the concepts named by it and the turns that say it; or details-on-demand, with a thing's IRI for its statements, or with a turn's graph name for that turn's words.",
    "Each answer is MTSV text, one page at a time; give offset to read the next page.",
])
WRITE_TOOL_DESCRIPTION = " ".join([
    "Adds statements about the current turn to LIV's memory, written as one Turtle document; LIV puts their triples in the turn's graph and gives each blank node a new IRI.",
    "Use it once each turn, for what the turn says about the person and their world, not about this conversation; do not use it to look anything up.",
    "Each statement is counted in every turn that makes it, so a known thing written again by its IRI weighs more.",
    "The whole document is refused, with the reason, and nothing is kept, if it is not Turtle, uses a prefix it does not declare, holds an IRI that is not absolute, or breaks a SKOS rule, such as a second skos:prefLabel in one language tag.",
    "It returns the rows it kept, as MTSV, with the IRIs LIV gave.",
])
STATEMENTS_DESCRIPTION = " ".join([
    "One Turtle document, beginning with its @prefix lines, of the statements this turn makes, for example: @prefix skos: <http://www.w3.org/2004/02/skos/core#> . _:kyoto skos:prefLabel \"Kyoto trip\"@en .",
])
FIND_TOOL_DESCRIPTION = " ".join([
    "Reads LIV's memory by one of four tasks, one page of MTSV at a time.",
    "overview gives the top concepts, each with the number of turns that speak of it and the last time one did, the most first; zoom gives the concepts under one; filter gives the concepts whose names contain a text and the turns whose words do; details-on-demand gives a thing's statements, each with its count, last time and turns, or a turn's exact words.",
    "Use it to find a known thing's IRI before writing about it, and to go from the overview down to the exact words.",
    "filter matches letter for letter, telling upper and lower case apart.",
    "Each answer is one page; give offset to read the next.",
])
TASK_DESCRIPTION = " ".join([
    "One of overview, zoom, filter or details-on-demand.",
])
ITEM_DESCRIPTION = " ".join([
    "For zoom, a concept's IRI; for filter, a text; for details-on-demand, a thing's IRI or a turn's graph name; not given for overview.",
])
OFFSET_DESCRIPTION = " ".join([
    "The rows to skip, from 0; 0 where not given.",
])
PLUGIN_YAML_DESCRIPTION = " ".join([
    "Keeps every turn word for word, with an index of what the agent writes about each turn, nested and counted, as plain files in a memory for each directory worked in.",
])
README = " ".join([
    "LIV is a memory provider for Hermes: it keeps every turn word for word, and the statements the agent writes about each turn, nested and counted.",
    "Put this directory in $HERMES_HOME/plugins/liv/, and select LIV by setting memory.provider to liv.",
    "LIV gives the agent two tools: liv_write, to write a turn's statements as Turtle, and liv_find, to read the memory by overview, zoom, filter and details-on-demand.",
    "The memory toolset must be on for the two tools and LIV's system prompt to reach the agent; without it, the overview still arrives before each turn.",
    "LIV keeps its books under hermes_home/liv/, one directory for each directory worked in, and reads no file outside them.",
    "It makes no network call, runs no shell command or background process, and stores no credential.",
    "Run hermes liv overview, zoom, filter or details-on-demand in a directory to see its memory.",
])
# /hermes/provider initialize 2
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13
PRIMARY = "primary"
# /hermes/provider get_tool_schemas 1
# HERMES /agent/memory_provider.py/165 to /agent/memory_provider.py/167
STATEMENTS = "statements"
TASK = "task"
# /hermes/provider handle_tool_call 4
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
ARGS_DO_NOT_MATCH_THE_TOOL = "args do not match the tool"
# /hermes/provider handle_tool_call 5
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5
NO_TURN = "no turn"
# /hermes/provider handle_tool_call 6
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
REFUSED = "refused"
# /hermes/provider handle_tool_call 7
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/171
NO_SUCH_TOOL = "no such tool"
# /hermes/provider sync_turn 3
# HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
# HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
# HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
# HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
ROLE = "role"
USER = "user"
ASSISTANT = "assistant"


def register(ctx):
    # /hermes/provider register 1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Plugin Entry Point/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Plugin Entry Point/3
    ctx.register_memory_provider(LivProvider())


class LivProvider(MemoryProvider):
    @property
    def name(self):
        # /hermes/provider name 1
        # HERMES /agent/memory_provider.py/109 to /agent/memory_provider.py/112
        return PROVIDER_NAME

    def is_available(self):
        # /hermes/provider is_available 1
        # HERMES /agent/memory_provider.py/116 to /agent/memory_provider.py/118
        return True

    def initialize(self, session_id, **kwargs):
        # /hermes/provider initialize 1
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/3
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7
        # HERMES /agent/agent_init_memory_provider.py/139 to /agent/agent_init_memory_provider.py/140
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17
        # HERMES /agent/runtime_cwd.py/107 to /agent/runtime_cwd.py/109
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Profile Isolation/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Profile Isolation/1
        self.directory = address.memory_directory(kwargs[HERMES_HOME], kwargs.get(CWD) or str(resolve_agent_cwd()))
        self.entities_book, self.runs_book, self.dataset_book = address.book_paths(self.directory)
        # /hermes/provider initialize 2
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13
        self.primary = kwargs.get(AGENT_CONTEXT, PRIMARY) == PRIMARY
        # /hermes/provider initialize 3
        # HERMES /agent/memory_provider.py/84 to /agent/memory_provider.py/103
        self.activity = ""

    def system_prompt_block(self):
        # /hermes/provider system_prompt_block 1
        # HERMES /agent/memory_provider.py/140 to /agent/memory_provider.py/141
        return SYSTEM_PROMPT.replace("‹write tool›", WRITE_TOOL).replace("‹find tool›", FIND_TOOL).replace("‹scheme›", skos.SCHEME)

    def on_turn_start(self, turn_number, message, **kwargs):
        # /hermes/provider on_turn_start 1
        # HERMES /agent/memory_provider.py/178 to /agent/memory_provider.py/179
        # HERMES /agent/turn_context.py/1063 to /agent/turn_context.py/1064
        self.activity = relations.activity()

    def prefetch(self, query, *, session_id=""):
        # /hermes/provider prefetch 1
        # HERMES /agent/memory_provider.py/144 to /agent/memory_provider.py/147
        # HERMES /agent/turn_context.py/1063 to /agent/turn_context.py/1064
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Required Methods/Oversized prefetch results/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Required Methods/Oversized prefetch results/1
        if skos.top_concepts(store.read(self.dataset_book)):
            return mantra.overview(self.directory, 0)
        return ""

    def get_tool_schemas(self):
        # /hermes/provider get_tool_schemas 1
        # HERMES /agent/memory_provider.py/165 to /agent/memory_provider.py/167
        # OPENAI-OPENAPI /54144 to /54174
        # JSON-SCHEMA /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/1 to /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/2
        # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
        # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
        # JSON-SCHEMA-VALIDATION /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/1 to /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/2
        # /hermes/provider get_tool_schemas 2
        # HERMES /toolsets.py/11 to /toolsets.py/36
        # HERMES /agent/memory_manager_tools.py/101 to /agent/memory_manager_tools.py/105
        return [
            {
                NAME: WRITE_TOOL,
                DESCRIPTION: WRITE_TOOL_DESCRIPTION,
                PARAMETERS: {
                    TYPE: OBJECT,
                    PROPERTIES: {STATEMENTS: {TYPE: STRING, DESCRIPTION: STATEMENTS_DESCRIPTION}},
                    REQUIRED: [STATEMENTS],
                },
            },
            {
                NAME: FIND_TOOL,
                DESCRIPTION: FIND_TOOL_DESCRIPTION,
                PARAMETERS: {
                    TYPE: OBJECT,
                    PROPERTIES: {
                        TASK: {
                            TYPE: STRING,
                            ENUM: list(mantra.VISUAL_INFORMATION_SEEKING_MANTRA),
                            DESCRIPTION: TASK_DESCRIPTION,
                        },
                        mantra.ITEM: {TYPE: STRING, DESCRIPTION: ITEM_DESCRIPTION},
                        find.OFFSET: {TYPE: INTEGER, DESCRIPTION: OFFSET_DESCRIPTION},
                    },
                    REQUIRED: [TASK],
                },
            },
        ]

    def get_config_schema(self):
        # /hermes/provider get_config_schema 1
        # HERMES /agent/memory_provider.py/215 to /agent/memory_provider.py/220
        return []

    def handle_tool_call(self, tool_name, args):
        try:
            # /hermes/provider handle_tool_call 7
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/171
            if tool_name not in (WRITE_TOOL, FIND_TOOL):
                raise ValueError(NO_SUCH_TOOL)
            # /hermes/provider handle_tool_call 4
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            if tool_name == WRITE_TOOL:
                matches = isinstance(args.get(STATEMENTS), str)
            else:
                task = args.get(TASK)
                item = args.get(mantra.ITEM)
                offset = args.get(find.OFFSET, 0)
                matches = (
                    task in mantra.VISUAL_INFORMATION_SEEKING_MANTRA
                    and (task == mantra.OVERVIEW or isinstance(item, str))
                    and isinstance(offset, int)
                    and not isinstance(offset, bool)
                    and offset >= 0
                )
            if not matches:
                raise ValueError(ARGS_DO_NOT_MATCH_THE_TOOL)
            if tool_name == WRITE_TOOL:
                # /hermes/provider handle_tool_call 5
                # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5
                if not self.activity:
                    raise ValueError(NO_TURN)
                # /hermes/provider handle_tool_call 1
                # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
                dataset = skos.write_triples(self.dataset_book, self.activity, args[STATEMENTS])
                # /hermes/provider handle_tool_call 3
                # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
                text = mtsv.generate([mtsv.sheet(relations.DATASET_NAME, [column for column, type in relations.DATASET], dataset)])
            else:
                # /hermes/provider handle_tool_call 2
                # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
                # HERMES /tools/tool_result_storage.py/1 to /tools/tool_result_storage.py/6
                if task == mantra.OVERVIEW:
                    text = mantra.overview(self.directory, offset)
                elif task == mantra.ZOOM:
                    text = mantra.zoom(self.directory, item, offset)
                elif task == mantra.FILTER:
                    text = mantra.filter(self.directory, item, offset)
                else:
                    text = mantra.details_on_demand(self.directory, item, offset)
            # /hermes/provider handle_tool_call 3
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            return json.dumps(text)
        # /hermes/provider handle_tool_call 6
        # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
        except ValueError as refusal:
            return json.dumps(REFUSED + " " + str(refusal))

    def sync_turn(self, user_content, assistant_content, *, session_id="", messages=None):
        # /hermes/provider sync_turn 4
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13
        if not self.primary:
            return
        # /hermes/provider sync_turn 2
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Pre-Compress Checkpoints (fail-closed)/Forks under an armed gate/5
        if not self.activity:
            return
        # /hermes/provider sync_turn 3
        # HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
        # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
        # HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
        # HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
        times = {USER: "", ASSISTANT: ""}
        for message in messages or []:
            if message.get(ROLE) in times:
                timestamp = message.get(TIMESTAMP)
                times[message[ROLE]] = "" if timestamp is None else xsd.canonical_date_time(timestamp)
        # /hermes/provider sync_turn 1
        # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
        # HERMES /agent/memory_manager.py/462 to /agent/memory_manager.py/465
        # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/7 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/9
        store.keep_entity(self.entities_book, self.runs_book, self.activity, relations.PROV_PERSON, times[USER], user_content)
        store.keep_entity(self.entities_book, self.runs_book, self.activity, relations.PROV_SOFTWARE_AGENT, times[ASSISTANT], assistant_content)
