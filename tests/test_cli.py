import argparse
import contextlib
import io
import os
import tempfile
import unittest
from unittest import mock

from liv import banker, cli, memory, relations

SKOS = "http://www.w3.org/2004/02/skos/core#"


def parser():
    found = argparse.ArgumentParser(prog="hermes liv")
    cli.register_cli(found)
    return found


class TestCli(unittest.TestCase):
    def test_register_cli_1(self):
        args = parser().parse_args(["query", "ASK { ?s ?p ?o }"])
        filtered = parser().parse_args(["filter", "--after", "2026-11-10T00:00:00Z"])
        self.assertEqual(
            [args.liv_command, args.query, args.offset, filtered.liv_command, filtered.item, filtered.after, filtered.offset],
            ["query", "ASK { ?s ?p ?o }", 0, "filter", "", "2026-11-10T00:00:00Z", 0],
        )

    def test_register_cli_2(self):
        args = parser().parse_args(["zoom", "urn:uuid:f"])
        self.assertEqual(args.func, cli.liv_command)

    def test_liv_command_1(self):
        with tempfile.TemporaryDirectory() as root:
            home, work = os.path.join(root, "h"), os.path.join(root, "w")
            os.makedirs(work)
            row = {"subject": "c", "predicate": SKOS + "prefLabel", "object": "Friends", "datatype IRI": "", "language tag": "en", "graph name": "g1"}
            banker.insert(os.path.join(memory.memory_directory(home, work), "dataset.mtsv"), "dataset", [column for column, _ in relations.DATASET], [row])
            printed = io.StringIO()
            with mock.patch("liv.cli.get_hermes_home", return_value=home), mock.patch("liv.cli.resolve_agent_cwd", return_value=work):
                with contextlib.redirect_stdout(printed):
                    cli.liv_command(parser().parse_args(["overview"]))
        self.assertEqual(printed.getvalue().split("\n")[2].split("\t")[:2], ["c", "Friends"])

    def test_liv_command_2(self):
        printed = io.StringIO()
        with contextlib.redirect_stdout(printed):
            cli.liv_command(parser().parse_args([]))
        usage = printed.getvalue()
        self.assertEqual([name in usage for name in ("overview", "zoom", "filter", "details-on-demand", "relate", "query")], [True] * 6)

    def test_liv_command_3(self):
        with tempfile.TemporaryDirectory() as root:
            home, work = os.path.join(root, "h"), os.path.join(root, "w")
            os.makedirs(work)
            printed, errors = io.StringIO(), io.StringIO()
            with mock.patch("liv.cli.get_hermes_home", return_value=home), mock.patch("liv.cli.resolve_agent_cwd", return_value=work):
                with contextlib.redirect_stdout(printed), contextlib.redirect_stderr(errors):
                    code = cli.liv_command(parser().parse_args(["query", "ASK {"]))
        self.assertEqual([errors.getvalue(), code, printed.getvalue()], ["refused not SPARQL 1\n", 1, ""])
