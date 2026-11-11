from agent.runtime_cwd import resolve_agent_cwd
from hermes_constants import get_hermes_home

from . import address
from . import find
from . import mantra

# /hermes/cli register_cli 1
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/5
# HERMES /plugins/memory/__init__.py/592 to /plugins/memory/__init__.py/595
# SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
# HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/21
# PY-ARGPARSE /argparse --- Parser for command-line options, arguments and sub-commands/The add_argument() method/name or flags/1 to /argparse --- Parser for command-line options, arguments and sub-commands/The add_argument() method/name or flags/1
# PY-ARGPARSE /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1 to /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1
LIV_COMMAND = "liv_command"
OPTIONAL_ARGUMENT = "--"
FUNC = "func"
PARSER = "parser"


def register_cli(subparser):
    # /hermes/cli register_cli 1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/1 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/How it works/5
    # HERMES /plugins/memory/__init__.py/592 to /plugins/memory/__init__.py/595
    # SHNEIDERMAN1996 /2. Visual Information Seeking Mantra/4 to /2. Visual Information Seeking Mantra/5
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/13 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/21
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and sub-commands/The add_argument() method/name or flags/1 to /argparse --- Parser for command-line options, arguments and sub-commands/The add_argument() method/name or flags/1
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1 to /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Parser defaults/ArgumentParser.set_defaults(**kwargs)/1
    subs = subparser.add_subparsers(dest=LIV_COMMAND)
    for task in mantra.VISUAL_INFORMATION_SEEKING_MANTRA:
        parser = subs.add_parser(task)
        if task != mantra.OVERVIEW:
            parser.add_argument(mantra.ITEM)
        parser.add_argument(OPTIONAL_ARGUMENT + find.OFFSET, type=int, default=0)
    subparser.set_defaults(**{FUNC: liv_command, PARSER: subparser})


def liv_command(args):
    task = getattr(args, LIV_COMMAND, None)
    # /hermes/cli liv_command 2
    # PY-ARGPARSE /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Printing help/ArgumentParser.print_usage(file=None)/1 to /argparse --- Parser for command-line options, arguments and sub-commands/Other utilities/Printing help/ArgumentParser.print_usage(file=None)/1
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/3 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/Adding CLI Commands/Example/11
    if task not in mantra.VISUAL_INFORMATION_SEEKING_MANTRA:
        getattr(args, PARSER).print_usage()
        return
    # /hermes/cli liv_command 1
    # HERMES /plugins/memory/__init__.py/632 to /plugins/memory/__init__.py/632
    # HERMES /hermes_constants.py/194 to /hermes_constants.py/195
    # HERMES /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17 to /website/docs/developer-guide/memory-provider-plugin.md/Building a Memory Provider Plugin/The MemoryProvider ABC/Initialization context/17
    # HERMES /agent/runtime_cwd.py/107 to /agent/runtime_cwd.py/109
    directory = address.memory_directory(str(get_hermes_home()), str(resolve_agent_cwd()))
    offset = getattr(args, find.OFFSET)
    if task == mantra.OVERVIEW:
        text = mantra.overview(directory, offset)
    elif task == mantra.ZOOM:
        text = mantra.zoom(directory, getattr(args, mantra.ITEM), offset)
    elif task == mantra.FILTER:
        text = mantra.filter(directory, getattr(args, mantra.ITEM), offset)
    else:
        text = mantra.details_on_demand(directory, getattr(args, mantra.ITEM), offset)
    print(text, end="")
