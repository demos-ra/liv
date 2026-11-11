import json
import os
import tempfile
import unittest

from agent.runtime_cwd import resolve_agent_cwd
from toolsets import _HERMES_CORE_TOOLS

from liv import address
from liv import mantra
from liv import provider
from liv import skos
from liv import store

PROV = "http://www.w3.org/ns/prov#"


class TestProvider(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.h = self.temporary.name
        self.w = os.path.join(self.h, "w")
        os.makedirs(self.w)

    def tearDown(self):
        self.temporary.cleanup()

    def provider(self, **kwargs):
        instance = provider.LivProvider()
        instance.initialize("s", hermes_home=self.h, cwd=self.w, **kwargs)
        return instance

    def test_register_1(self):
        registered = []

        class Context:
            def register_memory_provider(self, instance):
                registered.append(instance)

        provider.register(Context())
        self.assertEqual([type(instance) for instance in registered], [provider.LivProvider])

    def test_name_1(self):
        self.assertEqual(provider.LivProvider().name, "liv")

    def test_is_available_1(self):
        self.assertEqual(provider.LivProvider().is_available(), True)

    def test_initialize_1(self):
        instance = provider.LivProvider()
        instance.initialize("s", hermes_home="/h", cwd="/w")
        self.assertEqual(
            (instance.directory, instance.entities_book, instance.runs_book, instance.dataset_book),
            ("/h/liv/w", "/h/liv/w/entities.mtsv", "/h/liv/w/runs.mtsv", "/h/liv/w/dataset.mtsv"),
        )

    def test_initialize_2(self):
        self.assertEqual(self.provider(agent_context="cron").primary, False)

    def test_initialize_3(self):
        first = provider.LivProvider()
        second = provider.LivProvider()
        first.initialize("s", hermes_home="/a")
        second.initialize("s", hermes_home="/b")
        cwd = str(resolve_agent_cwd())
        self.assertEqual(
            (first.directory, second.directory, first.dataset_book, second.dataset_book),
            (
                address.memory_directory("/a", cwd),
                address.memory_directory("/b", cwd),
                os.path.join(address.memory_directory("/a", cwd), "dataset.mtsv"),
                os.path.join(address.memory_directory("/b", cwd), "dataset.mtsv"),
            ),
        )

    def test_system_prompt_block_1(self):
        self.assertEqual(
            provider.LivProvider().system_prompt_block(),
            provider.SYSTEM_PROMPT.replace("‹write tool›", "liv_write").replace("‹find tool›", "liv_find").replace("‹scheme›", skos.SCHEME),
        )

    def test_on_turn_start_1(self):
        instance = self.provider()
        instance.on_turn_start(1, "hi")
        first = instance.activity
        instance.on_turn_start(2, "hi")
        self.assertEqual((instance.activity[:9], instance.activity != first), ("urn:uuid:", True))

    def test_prefetch_1(self):
        self.assertEqual(self.provider().prefetch("hi"), "")

    def test_get_tool_schemas_1(self):
        schemas = provider.LivProvider().get_tool_schemas()
        self.assertEqual(
            [
                (
                    schema["name"],
                    schema["description"],
                    {name: parameter["description"] for name, parameter in schema["parameters"]["properties"].items()},
                    schema["parameters"]["required"],
                )
                for schema in schemas
            ],
            [
                ("liv_write", provider.WRITE_TOOL_DESCRIPTION, {"statements": provider.STATEMENTS_DESCRIPTION}, ["statements"]),
                (
                    "liv_find",
                    provider.FIND_TOOL_DESCRIPTION,
                    {
                        "task": provider.TASK_DESCRIPTION,
                        "item": provider.ITEM_DESCRIPTION,
                        "offset": provider.OFFSET_DESCRIPTION,
                    },
                    ["task"],
                ),
            ],
        )

    def test_get_tool_schemas_2(self):
        self.assertEqual(
            [schema["name"] in _HERMES_CORE_TOOLS for schema in provider.LivProvider().get_tool_schemas()],
            [False, False],
        )

    def test_get_config_schema_1(self):
        self.assertEqual(provider.LivProvider().get_config_schema(), [])

    def test_handle_tool_call_1(self):
        instance = self.provider()
        instance.activity = "urn:uuid:a"
        instance.handle_tool_call("liv_write", {"statements": '<http://a> <http://p> "x" .'})
        self.assertEqual(
            [(row["subject"], row["predicate"], row["object"], row["graph name"]) for row in store.read(instance.dataset_book)],
            [("http://a", "http://p", "x", "urn:uuid:a")],
        )

    def test_handle_tool_call_2(self):
        instance = self.provider()
        self.assertEqual(
            instance.handle_tool_call("liv_find", {"task": "filter", "item": "Mik"}),
            json.dumps(mantra.filter(instance.directory, "Mik", 0)),
        )

    def test_handle_tool_call_3(self):
        result = self.provider().handle_tool_call("liv_find", {"task": "overview"})
        self.assertEqual(json.loads(result)[:8], "\franked\n")

    def test_handle_tool_call_4(self):
        self.assertEqual(
            self.provider().handle_tool_call("liv_find", {"task": "zoom"}),
            json.dumps("refused args do not match the tool"),
        )

    def test_handle_tool_call_5(self):
        instance = self.provider(agent_context="subagent")
        self.assertEqual(
            instance.handle_tool_call("liv_write", {"statements": "<http://a> <http://p> <http://o> ."}),
            json.dumps("refused no turn"),
        )

    def test_handle_tool_call_6(self):
        instance = self.provider()
        instance.activity = "urn:uuid:a"
        self.assertEqual(
            instance.handle_tool_call("liv_write", {"statements": "<p> <http://p> <http://o> ."}),
            json.dumps("refused not an absolute IRI 1"),
        )

    def test_handle_tool_call_7(self):
        self.assertEqual(
            self.provider().handle_tool_call("liv_other", {}),
            json.dumps("refused no such tool"),
        )

    def test_sync_turn_1(self):
        instance = self.provider()
        instance.activity = "urn:uuid:a"
        instance.sync_turn("a", "b", session_id="s")
        entities = store.read(instance.entities_book)
        runs = store.read(instance.runs_book)
        self.assertEqual(
            [(entity["activity"], entity["agent"]) for entity in entities],
            [("urn:uuid:a", PROV + "Person"), ("urn:uuid:a", PROV + "SoftwareAgent")],
        )
        self.assertEqual([run["text"] for run in runs], ["a", "b"])

    def test_sync_turn_2(self):
        instance = self.provider()
        instance.sync_turn("a", "b", session_id="s")
        self.assertEqual(
            (os.path.exists(instance.entities_book), os.path.exists(instance.runs_book)),
            (False, False),
        )

    def test_sync_turn_3(self):
        instance = self.provider()
        instance.activity = "urn:uuid:a"
        instance.sync_turn("a", "b", session_id="s", messages=[{"role": "user", "content": "a", "timestamp": 1762765200.5}])
        self.assertEqual(
            [(entity["agent"], entity["time"]) for entity in store.read(instance.entities_book)],
            [(PROV + "Person", "2025-11-10T09:00:00.5Z"), (PROV + "SoftwareAgent", "")],
        )

    def test_sync_turn_4(self):
        instance = self.provider(agent_context="cron")
        instance.activity = "urn:uuid:a"
        instance.sync_turn("a", "b", session_id="s")
        self.assertEqual(
            (os.path.exists(instance.entities_book), os.path.exists(instance.runs_book)),
            (False, False),
        )
