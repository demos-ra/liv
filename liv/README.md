LIV is the first real stateful memory for AI agents: it keeps everything the human and their agent say, a knowledge graph above the raw transcript below, as plain text tables on your machine.
Put this directory in $HERMES_HOME/plugins/liv/, and select LIV by setting memory.provider to liv.
LIV gives the agent two tools: liv_write, to write a turn's statements as Turtle, and liv_find, to read the memory by overview, zoom, filter and details-on-demand.
The memory toolset must be on for the two tools and LIV's system prompt to reach the agent; without it, the overview still arrives before each turn.
LIV keeps its books under hermes_home/liv/, one directory for each directory worked in, and reads no file outside them.
It makes no network call, runs no shell command or background process, and stores no credential.
Run hermes liv overview, zoom, filter or details-on-demand in a directory to see its memory.
