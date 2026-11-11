import os
import unittest

from liv import provider

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def text(*path):
    with open(os.path.join(ROOT, *path), encoding="utf-8") as file:
        return file.read()


class TestFiles(unittest.TestCase):
    def test_plugin_yaml_1(self):
        lines = text("liv", "plugin.yaml").splitlines()
        self.assertEqual(
            (
                "name: liv" in lines,
                "version: 0.1.1" in lines,
                'description: "' + provider.PLUGIN_YAML_DESCRIPTION + '"' in lines,
                lines[lines.index("hooks:") + 1:],
            ),
            (True, True, True, ["  - system_prompt_block", "  - prefetch", "  - sync_turn", "  - on_turn_start"]),
        )

    def test_readme_md_1(self):
        readme = text("liv", "README.md")
        self.assertEqual(
            [part in readme for part in ("$HERMES_HOME/plugins/liv/", "memory.provider to liv", "liv_write", "liv_find")],
            [True, True, True, True],
        )

    def test_readme_md_2(self):
        self.assertEqual("memory toolset" in text("liv", "README.md"), True)

    def test_readme_md_3(self):
        readme = text("liv", "README.md")
        self.assertEqual(
            [
                part in readme
                for part in ("hermes_home/liv/", "no network call", "no shell command", "background process", "no credential")
            ],
            [True, True, True, True, True],
        )

    def test_gitignore_1(self):
        self.assertEqual("__pycache__/" in text(".gitignore").splitlines(), True)
