import json

from agent.memory_provider import MemoryProvider
from agent.runtime_cwd import resolve_agent_cwd

from .find import find
from .keep import keep_turn
from .memory import memory_directory
from .overview import overview
from .relations import activity, pathnames
from .wording import FIND_TOOL, WRITE_TOOL, system, tools
from .write import write_triples

PROVIDER_NAME = "liv"
TITLE = "LIV"
VERSION = "0.2.0"
REPOSITORY = "https://github.com/demos-ra/liv"
MAINTAINER = "demos-ra"
HERMES_HOME = "hermes_home"
CWD = "cwd"
AGENT_CONTEXT = "agent_context"
# /interface/hermes initialize 3
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13
# PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1
PRIMARY = "primary"
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
MINIMUM = "minimum"
FORMAT = "format"
DATE_TIME = "date-time"
# /interface/hermes sync_turn 1
# HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
# HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
# HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
# HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
# HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
ROLE = "role"
USER = "user"
ASSISTANT = "assistant"
TIMESTAMP = "timestamp"
# /interface/hermes handle_tool_call 2
# JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
# JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
ARGS_DO_NOT_MATCH_THE_TOOL = "args do not match the tool"
# /interface/hermes handle_tool_call 5
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
REFUSED = "refused"
# /interface/hermes handle_tool_call 6
# HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/171
NO_SUCH_TOOL = "no such tool"
# /interface/hermes get_tool_schemas 1
# HERMES /agent/memory_provider.py/165 to /agent/memory_provider.py/167
# OPENAI-OPENAPI /54144 to /54174
# JSON-SCHEMA /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/1 to /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/2
# JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
# JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
# JSON-SCHEMA-VALIDATION /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/1 to /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/2
LIV_TYPES = {"string": STRING, "integer": INTEGER, "time": STRING}


def _schema(tool):
    # /interface/hermes get_tool_schemas 1
    # HERMES /agent/memory_provider.py/165 to /agent/memory_provider.py/167
    # OPENAI-OPENAPI /54144 to /54174
    # JSON-SCHEMA /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/1 to /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/2
    # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
    # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
    # JSON-SCHEMA-VALIDATION /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/1 to /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/2
    properties = {}
    for name, parameter in tool["parameters"].items():
        schema = {TYPE: LIV_TYPES[parameter["type"]], DESCRIPTION: parameter["description"]}
        if "one of" in parameter:
            schema[ENUM] = list(parameter["one of"])
        if "from" in parameter:
            schema[MINIMUM] = parameter["from"]
        if parameter["type"] == "time":
            schema[FORMAT] = DATE_TIME
        properties[name] = schema
    return {
        NAME: tool["name"],
        DESCRIPTION: tool["description"],
        PARAMETERS: {TYPE: OBJECT, PROPERTIES: properties, REQUIRED: list(tool["required"])},
    }


def _valid(args, parameters):
    # /interface/hermes handle_tool_call 2
    # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
    # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
    # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
    if not isinstance(args, dict):
        return False
    for name in parameters[REQUIRED]:
        if name not in args:
            return False
    for name, value in args.items():
        schema = parameters[PROPERTIES].get(name)
        if schema is None:
            continue
        if schema[TYPE] == STRING and not isinstance(value, str):
            return False
        if schema[TYPE] == INTEGER and (not isinstance(value, int) or isinstance(value, bool)):
            return False
        if ENUM in schema and value not in schema[ENUM]:
            return False
        if MINIMUM in schema and value < schema[MINIMUM]:
            return False
    return True


def _seconds(messages, role):
    # /interface/hermes sync_turn 1
    # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
    # HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
    # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
    # HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
    # HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
    # /interface/hermes sync_turn 2
    # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
    # HERMES /agent/memory_manager.py/462 to /agent/memory_manager.py/465
    # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
    for message in reversed(messages or []):
        if message.get(ROLE) == role:
            return message.get(TIMESTAMP)
    return None


class LivProvider(MemoryProvider):
    @property
    def name(self):
        # /interface/hermes name 1
        # HERMES /agent/memory_provider.py/109 to /agent/memory_provider.py/112
        return PROVIDER_NAME

    def is_available(self):
        # /interface/hermes is_available 1
        # HERMES /agent/memory_provider.py/116 to /agent/memory_provider.py/118
        return True

    def initialize(self, session_id, **kwargs):
        # /interface/hermes initialize 1
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/3
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7
        # HERMES /agent/agent_init_memory_provider.py/139 to /agent/agent_init_memory_provider.py/140
        # /interface/hermes initialize 2
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17
        # HERMES /agent/runtime_cwd.py/107 to /agent/runtime_cwd.py/109
        directory = kwargs.get(CWD) or str(resolve_agent_cwd())
        # /interface/hermes initialize 4
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Profile Isolation/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Profile Isolation/1
        # HERMES /agent/memory_provider.py/84 to /agent/memory_provider.py/103
        # /interface/hermes initialize 1
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/3
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/7
        # HERMES /agent/agent_init_memory_provider.py/139 to /agent/agent_init_memory_provider.py/140
        self.directory = memory_directory(str(kwargs[HERMES_HOME]), str(directory))
        self.entities_book, self.words_book, self.dataset_book = pathnames(self.directory)
        # /interface/hermes initialize 3
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/13
        # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1
        self.delegate = kwargs.get(AGENT_CONTEXT, "") not in (PRIMARY, "")
        self.activity = ""

    def system_prompt_block(self):
        # /interface/hermes system_prompt_block 1
        # HERMES /agent/memory_provider.py/140 to /agent/memory_provider.py/141
        return system()

    def prefetch(self, query, *, session_id=""):
        # /interface/hermes prefetch 1
        # HERMES /agent/memory_provider.py/144 to /agent/memory_provider.py/147
        # HERMES /agent/turn_context.py/1063 to /agent/turn_context.py/1064
        # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Required Methods/Oversized prefetch results/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Required Methods/Oversized prefetch results/1
        return overview(self.directory)

    def sync_turn(self, user_content, assistant_content, *, session_id="", messages=None):
        # /interface/hermes sync_turn 1
        # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
        # HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
        # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
        # HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
        # HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
        person_seconds = _seconds(messages, USER)
        # /interface/hermes sync_turn 2
        # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
        # HERMES /agent/memory_manager.py/462 to /agent/memory_manager.py/465
        # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
        agent_seconds = _seconds(messages, ASSISTANT)
        # /interface/hermes sync_turn 1
        # HERMES /agent/memory_provider.py/157 to /agent/memory_provider.py/162
        # HERMES /agent/message_metadata.py/6 to /agent/message_metadata.py/6
        # HERMES /agent/message_metadata.py/456 to /agent/message_metadata.py/468
        # HERMES /agent/turn_context.py/758 to /agent/turn_context.py/758
        # HERMES /agent/chat_completion_helpers.py/1629 to /agent/chat_completion_helpers.py/1629
        keep_turn(
            self.entities_book,
            self.words_book,
            self.delegate,
            getattr(self, "activity", ""),
            user_content,
            person_seconds,
            assistant_content,
            agent_seconds,
        )

    def get_tool_schemas(self):
        # /interface/hermes get_tool_schemas 1
        # HERMES /agent/memory_provider.py/165 to /agent/memory_provider.py/167
        # OPENAI-OPENAPI /54144 to /54174
        # JSON-SCHEMA /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/1 to /10. A Vocabulary for Applying Subschemas/10.3. Keywords for Applying Subschemas to Child Instances/10.3.2. Keywords for Applying Subschemas to Objects/10.3.2.1. properties/2
        # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
        # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
        # JSON-SCHEMA-VALIDATION /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/1 to /9. A Vocabulary for Basic Meta-Data Annotations/9.1. "title" and "description"/2
        # /interface/hermes get_tool_schemas 2
        # HERMES /toolsets.py/11 to /toolsets.py/36
        # HERMES /agent/memory_manager_tools.py/101 to /agent/memory_manager_tools.py/105
        return [_schema(tool) for tool in tools().values()]

    def handle_tool_call(self, tool_name, args):
        try:
            # /interface/hermes handle_tool_call 6
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/171
            if tool_name not in (FIND_TOOL, WRITE_TOOL):
                raise ValueError(NO_SUCH_TOOL)
            # /interface/hermes handle_tool_call 2
            # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.1. type/1 to /6. A Vocabulary for Structural Validation/6.1. Validation Keywords for Any Instance Type/6.1.2. enum/2
            # JSON-SCHEMA-VALIDATION /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/1 to /6. A Vocabulary for Structural Validation/6.5. Validation Keywords for Objects/6.5.3. required/2
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            schemas = {schema[NAME]: schema for schema in self.get_tool_schemas()}
            if not _valid(args, schemas[tool_name][PARAMETERS]):
                raise ValueError(ARGS_DO_NOT_MATCH_THE_TOOL)
            # /interface/hermes handle_tool_call 3
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            if tool_name == FIND_TOOL:
                text = find(self.directory, args)
            # /interface/hermes handle_tool_call 4
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            else:
                text = write_triples(self.dataset_book, getattr(self, "activity", ""), args["statements"])
            # /interface/hermes handle_tool_call 1
            # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
            # HERMES /tools/tool_result_storage.py/1 to /tools/tool_result_storage.py/6
            # CPY-JSON /json-init-314.py/185 to /json-init-314.py/197
            return json.dumps(text)
        # /interface/hermes handle_tool_call 5
        # HERMES /agent/memory_provider.py/169 to /agent/memory_provider.py/170
        except (ValueError, OSError) as refusal:
            return json.dumps(REFUSED + " " + str(refusal))

    def on_turn_start(self, turn_number, message, **kwargs):
        # /interface/hermes on_turn_start 1
        # HERMES /agent/memory_provider.py/178 to /agent/memory_provider.py/179
        # HERMES /agent/turn_context.py/1063 to /agent/turn_context.py/1064
        self.activity = activity()

    def get_config_schema(self):
        # /interface/hermes get_config_schema 1
        # HERMES /agent/memory_provider.py/215 to /agent/memory_provider.py/220
        return []


def register(ctx):
    # /interface/hermes register 1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Plugin Entry Point/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Plugin Entry Point/3
    ctx.register_memory_provider(LivProvider())
