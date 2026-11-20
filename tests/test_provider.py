import json
import os
import tempfile
import unittest
from unittest import mock

from liv import banker, provider, relations

SKOS = "http://www.w3.org/2004/02/skos/core#"


class TestProvider(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.home = os.path.join(self.temporary.name, "h")
        self.work = os.path.realpath(os.path.join(self.temporary.name, "w"))
        os.makedirs(self.work)
        self.provider = provider.LivProvider()
        self.provider.initialize("s", hermes_home=self.home, cwd=self.work)

    def tearDown(self):
        self.temporary.cleanup()

    def call(self, tool, args):
        return json.loads(self.provider.handle_tool_call(tool, args))

    def test_name_1(self):
        self.assertEqual(self.provider.name, "liv")

    def test_is_available_1(self):
        with mock.patch("socket.socket", side_effect=AssertionError("network")):
            self.assertEqual(self.provider.is_available(), True)

    def test_initialize_1(self):
        expected = os.path.join(self.home, "liv", *[segment for segment in self.work.split(os.sep) if segment])
        self.assertEqual([self.provider.directory, self.provider.dataset_book], [expected, os.path.join(expected, "dataset.mtsv")])

    def test_initialize_2(self):
        other = provider.LivProvider()
        with mock.patch("liv.provider.resolve_agent_cwd", return_value=self.work):
            other.initialize("s", hermes_home=self.home)
        self.assertEqual(other.directory, self.provider.directory)

    def test_initialize_3(self):
        other = provider.LivProvider()
        other.initialize("s", hermes_home=self.home, cwd=self.work, agent_context="cron")
        self.assertEqual([other.delegate, self.provider.delegate], [True, False])

    def test_initialize_4(self):
        first, second = provider.LivProvider(), provider.LivProvider()
        os.makedirs(os.path.join(self.temporary.name, "a"))
        os.makedirs(os.path.join(self.temporary.name, "b"))
        first.initialize("s", hermes_home="/a", cwd=self.work)
        second.initialize("s", hermes_home="/b", cwd=self.work)
        self.assertEqual([first.directory.startswith("/a/liv/"), second.directory.startswith("/b/liv/")], [True, True])

    def test_system_prompt_block_1(self):
        self.assertEqual(self.provider.system_prompt_block().startswith("LIV is the memory for the directory you work in."), True)

    def test_prefetch_1(self):
        self.assertEqual(self.provider.prefetch("hi"), "")

    def test_sync_turn_1(self):
        self.provider.on_turn_start(1, "a")
        self.provider.sync_turn("a", "b", messages=[{"role": "user", "content": "a", "timestamp": 1762765200.5}])
        entities = banker.obtain(self.provider.entities_book)
        self.assertEqual([entities[0]["time"], banker.obtain(self.provider.words_book)[0]["text"]], ["2025-11-10T09:00:00.5Z", "a"])

    def test_sync_turn_2(self):
        self.provider.on_turn_start(1, "a")
        self.provider.sync_turn("a", "b", messages=[])
        entities = banker.obtain(self.provider.entities_book)
        self.assertEqual([entities[1]["time"], entities[1]["activity"], banker.obtain(self.provider.words_book)[1]["text"]], ["", self.provider.activity, "b"])

    def test_get_tool_schemas_1(self):
        schemas = self.provider.get_tool_schemas()
        find = schemas[0]["parameters"]
        self.assertEqual(
            [[schema["name"] for schema in schemas], find["type"], find["required"], find["properties"]["offset"]["minimum"], find["properties"]["before"]["format"]],
            [["liv_find", "liv_write"], "object", ["action"], 0, "date-time"],
        )

    def test_get_tool_schemas_2(self):
        from toolsets import _HERMES_CORE_TOOLS

        self.assertEqual([schema["name"] in _HERMES_CORE_TOOLS for schema in self.provider.get_tool_schemas()], [False, False])

    def test_handle_tool_call_1(self):
        self.assertEqual(isinstance(self.call("liv_find", {"action": "overview"}), str), True)

    def test_handle_tool_call_2(self):
        self.assertEqual(self.call("liv_find", {"action": 7}), "refused args do not match the tool")

    def test_handle_tool_call_3(self):
        row = {"subject": "c", "predicate": SKOS + "prefLabel", "object": "Friends", "datatype IRI": "", "language tag": "en", "graph name": "g1"}
        banker.insert(self.provider.dataset_book, "dataset", [column for column, _ in relations.DATASET], [row])
        self.assertEqual(self.call("liv_find", {"action": "overview"}).startswith("\franked\n"), True)

    def test_handle_tool_call_4(self):
        self.provider.on_turn_start(1, "a")
        self.assertEqual(self.call("liv_write", {"statements": '_:k <http://p> "x" .'}).startswith("\fminted\n"), True)

    def test_handle_tool_call_5(self):
        self.provider.on_turn_start(1, "a")
        self.assertEqual(self.call("liv_write", {"statements": "<p> <http://p> <http://o> ."}), "refused not an absolute IRI 1")

    def test_handle_tool_call_6(self):
        self.assertEqual(self.call("liv_other", {}), "refused no such tool")

    def test_on_turn_start_1(self):
        self.provider.on_turn_start(1, "a")
        first = self.provider.activity
        self.provider.on_turn_start(2, "b")
        self.assertEqual([self.provider.activity.startswith("urn:uuid:"), self.provider.activity != first], [True, True])

    def test_get_config_schema_1(self):
        self.assertEqual(self.provider.get_config_schema(), [])

    def test_register_1(self):
        registered = []

        class Context:
            def register_memory_provider(self, found):
                registered.append(found)

        provider.register(Context())
        self.assertEqual([len(registered), isinstance(registered[0], provider.LivProvider)], [1, True])
