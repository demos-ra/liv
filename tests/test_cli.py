import argparse
import contextlib
import io
import os
import tempfile
import unittest

from liv import address
from liv import cli
from liv import mantra
from liv import relations
from liv import skos
from liv import store

SKOS = "http://www.w3.org/2004/02/skos/core#"


class TestCli(unittest.TestCase):
    def test_register_cli_1(self):
        parser = argparse.ArgumentParser(prog="hermes liv")
        cli.register_cli(parser)
        args = parser.parse_args(["zoom", "urn:uuid:f"])
        self.assertEqual(
            (args.liv_command, args.item, args.offset, args.func, args.parser),
            ("zoom", "urn:uuid:f", 0, cli.liv_command, parser),
        )

    def test_liv_command_1(self):
        with tempfile.TemporaryDirectory() as home, tempfile.TemporaryDirectory() as w:
            before = (os.environ.get("HERMES_HOME"), os.getcwd())
            os.environ["HERMES_HOME"] = home
            os.chdir(w)
            try:
                directory = address.memory_directory(home, w)
                store.append(
                    address.book_paths(directory)[2],
                    "dataset",
                    [column for column, type in relations.DATASET],
                    [{"subject": "c", "predicate": SKOS + "topConceptOf", "object": skos.SCHEME,
                      "datatype IRI": "", "language tag": "", "graph name": "g1"}],
                )
                output = io.StringIO()
                with contextlib.redirect_stdout(output):
                    cli.liv_command(argparse.Namespace(liv_command="overview", offset=0))
                self.assertEqual(output.getvalue(), mantra.overview(directory, 0))
            finally:
                os.chdir(before[1])
                if before[0] is None:
                    del os.environ["HERMES_HOME"]
                else:
                    os.environ["HERMES_HOME"] = before[0]

    def test_liv_command_2(self):
        parser = argparse.ArgumentParser(prog="hermes liv")
        cli.register_cli(parser)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            cli.liv_command(parser.parse_args([]))
        usage = io.StringIO()
        parser.print_usage(usage)
        self.assertEqual(
            (output.getvalue(), [task in output.getvalue() for task in ("overview", "zoom", "filter", "details-on-demand")]),
            (usage.getvalue(), [True, True, True, True]),
        )
