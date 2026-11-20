import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPOSITORY = "https://github.com/demos-ra/liv"


def read(*path):
    with open(os.path.join(ROOT, *path), encoding="utf-8") as handle:
        return handle.read()


class TestPackage(unittest.TestCase):
    def test_liv_plugin_yaml_1(self):
        lines = read("liv", "plugin.yaml").split("\n")
        self.assertEqual(
            lines[:8],
            [
                "name: liv",
                "version: 0.2.0",
                'description: "The first real stateful memory for AI agents: a knowledge graph of concepts above a word-for-word transcript, kept as plain text tables locally."',
                "hooks:",
                "  - system_prompt_block",
                "  - prefetch",
                "  - sync_turn",
                "  - on_turn_start",
            ],
        )

    def test_liv_readme_md_1(self):
        text = read("liv", "README.md")
        self.assertEqual([part in text for part in ("$HERMES_HOME/plugins/liv/", "memory.provider: liv", "liv_find", "liv_write")], [True] * 4)

    def test_liv_readme_md_2(self):
        self.assertEqual("the memory toolset" in read("liv", "README.md").lower(), True)

    def test_liv_readme_md_3(self):
        text = read("liv", "README.md")
        parts = ("memory under hermes_home/liv/", "no network call", "no shell command", "background process", "no credential")
        self.assertEqual([part in text for part in parts], [True] * 5)

    def test_liv_readme_md_4(self):
        links = [link for link in re.findall(r"\]\(([^)]*)\)", read("liv", "README.md")) if link.endswith(("LICENSE", "SECURITY.md"))]
        self.assertEqual([len(links) == 2] + [link.startswith(REPOSITORY + "/") for link in links], [True] * 3)

    def test_readme_md_1(self):
        self.assertEqual(read("README.md"), "![LIV](assets/banner.webp)\n\n" + read("liv", "README.md"))

    def test_assets_banner_webp_1(self):
        with open(os.path.join(ROOT, "assets", "banner.webp"), "rb") as handle:
            header = handle.read(30)
        self.assertEqual(
            [header[:4], header[8:16], int.from_bytes(header[24:27], "little") + 1, int.from_bytes(header[27:30], "little") + 1],
            [b"RIFF", b"WEBPVP8X", 1280, 640],
        )

    def test_gitignore_1(self):
        self.assertEqual("__pycache__/" in read(".gitignore").split("\n"), True)
