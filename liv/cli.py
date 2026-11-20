import sys

from agent.runtime_cwd import resolve_agent_cwd
from hermes_constants import get_hermes_home

from .provider import REFUSED
from .tasks import FILTER, ITEM, mantra
from .view import view
from .wording import QUERY

# /interface/hermes register_cli 1
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/5
# HERMES /plugins/memory/__init__.py/592 to /plugins/memory/__init__.py/595
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/21
# PY-ARGPARSE /argparse --- Parser for command-line options, arguments and subcommands/The add_argument() method/name or flags/1 to /argparse --- Parser for command-line options, arguments and subcommands/The add_argument() method/name or flags/1
LIV_COMMAND = "liv_command"
OPTIONAL_ARGUMENT = "--"
ACTION = "action"
BEFORE = "before"
AFTER = "after"
OFFSET = "offset"
# /interface/hermes register_cli 2
# PY-ARGPARSE /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1 to /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1
FUNC = "func"
PARSER = "parser"


def register_cli(subparser):
    # /interface/hermes register_cli 1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/5
    # HERMES /plugins/memory/__init__.py/592 to /plugins/memory/__init__.py/595
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/21
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and subcommands/The add_argument() method/name or flags/1 to /argparse --- Parser for command-line options, arguments and subcommands/The add_argument() method/name or flags/1
    subcommands = subparser.add_subparsers(dest=LIV_COMMAND)
    tasks = mantra()
    for action in list(tasks) + [QUERY]:
        parser = subcommands.add_parser(action)
        takes_item, may_be_empty = tasks.get(action, (False, False))
        if takes_item and may_be_empty:
            parser.add_argument(ITEM, nargs="?", default="")
        elif takes_item:
            parser.add_argument(ITEM)
        if action == QUERY:
            parser.add_argument(QUERY)
        if action == FILTER:
            parser.add_argument(OPTIONAL_ARGUMENT + BEFORE, default="")
            parser.add_argument(OPTIONAL_ARGUMENT + AFTER, default="")
        parser.add_argument(OPTIONAL_ARGUMENT + OFFSET, type=int, default=0)
    # /interface/hermes register_cli 2
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1 to /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1
    subparser.set_defaults(**{FUNC: liv_command, PARSER: subparser})


def liv_command(args):
    action = getattr(args, LIV_COMMAND, None)
    # /interface/hermes liv_command 2
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Printing help/ArgumentParser.print_usage(file=None)/1 to /argparse --- Parser for command-line options, arguments and subcommands/Other utilities/Printing help/ArgumentParser.print_usage(file=None)/1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/3 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/11
    if action is None:
        getattr(args, PARSER).print_usage()
        return
    # /interface/hermes liv_command 1
    # HERMES /plugins/memory/__init__.py/632 to /plugins/memory/__init__.py/632
    # HERMES /hermes_constants.py/194 to /hermes_constants.py/195
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17
    # HERMES /agent/runtime_cwd.py/107 to /agent/runtime_cwd.py/109
    found = {ACTION: action}
    for name in (ITEM, QUERY, BEFORE, AFTER, OFFSET):
        if hasattr(args, name):
            found[name] = getattr(args, name)
    try:
        text = view(str(get_hermes_home()), str(resolve_agent_cwd()), found)
    # /interface/hermes liv_command 3
    # HERMES /hermes_cli/main.py/3441 to /hermes_cli/main.py/3445
    # POSIX-XSH-STDIN /DESCRIPTION/3 to /DESCRIPTION/3
    except (ValueError, OSError) as refusal:
        print(REFUSED + " " + str(refusal), file=sys.stderr)
        return 1
    # /interface/hermes liv_command 1
    # HERMES /plugins/memory/__init__.py/632 to /plugins/memory/__init__.py/632
    # HERMES /hermes_constants.py/194 to /hermes_constants.py/195
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17
    # HERMES /agent/runtime_cwd.py/107 to /agent/runtime_cwd.py/109
    print(text, end="")
