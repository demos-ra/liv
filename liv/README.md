# LIV

LIV is the first real stateful memory for AI agents. It keeps everything you and your agent say, as plain text tables, Multi-Sheet Tab-Separated Values (MTSV), that both of you can read and use. LIV debuts with Hermes Agent.

## Why It Is Useful

LIV's memory is a text-based relational database: a book for each kind of record, a sheet for its table, a column for each property, and a row for each fact, each stated once and all interconnected as one (Codd, 1970). Everyone and everything the agent comes to know is given an identity of its own, kept from session to session, so that what is said today joins with what was said before, never losing meaning across time.

The memory holds two layers of one record. Below lies the transcript: every turn, word for word, as it was spoken, only ever added to, never summarized or rewritten. Above it rests the knowledge graph: what each turn meant, written by the agent as RDF statements, each thing with a persistent identity, organized into concepts by SKOS.

Your agent always wakes up remembering, in any session and at any turn. It operates in your memory itself, seeing what matters most and what was said last, and can always return to the exact words.

The beauty is in its simplicity. LIV is open source, mechanical and free: plain files, open standards and proven foundations. It is a step for humanity to take ownership of its most private and sovereign data. Your memory lives on your machine, organized as your folders are, speaks to no network, and answers only to you. There is nothing to configure: install it, and stateful memory begins with the next turn.

## Get Started

* Install: `hermes plugins install liv`, or copy liv/ to $HERMES_HOME/plugins/liv/
* Turn on: set `memory.provider: liv` in Hermes's config.yaml, and keep the memory toolset on; without it the agent still sees its memory before each turn, but cannot search or write it
* Use: nothing more to do; before each turn the agent sees the top of its memory, during it the agent can search and write with its two tools, liv_find and liv_write, and after it every word is kept
* See: run `hermes liv overview` in a folder to see its memory, or `zoom`, `filter`, `details-on-demand`, `relate` or `query`

## How It Works

* Files: plain text tables that anyone can open and read, one file for each kind of record (MTSV)
* Database: three tables, who said what and when, the words, and the facts, linked as one; rows are only ever added, never changed; one memory for each folder you work in (relational model, Codd 1970)
* Transcript: every turn kept word for word, yours and the agent's, each with who said it and when (PROV)
* Knowledge graph: the facts the agent writes down from each turn, each tied to the turn it came from; every person, place and thing gets a lasting name of its own (RDF)
* Concepts: the facts read as named things, what falls under what and what relates to what, the top ones first (SKOS)
* Search: start from the top, go deeper, narrow by a word or a time, open any thing or turn down to its exact words, see what's connected, or ask any exact question; the most talked-about and most recent come first (Shneiderman's tasks, SPARQL)

## Details

* Requirements: Hermes Agent at commit 825322b (v0.23.1); Python's standard library only
* Privacy: LIV keeps its memory under hermes_home/liv/ and reads no file outside it; it makes no network call, runs no shell command or background process, and stores no credential
* Tests: `python3 -m unittest discover -s tests`, run from the repository's root with Hermes Agent's source on PYTHONPATH; one test per requirement, all passing
* Format: [MTSV, an IETF Internet-Draft](https://github.com/demos-ra/mtsv-spec), the standard its files follow
* License: [GPLv2](https://github.com/demos-ra/liv/blob/main/LICENSE)

## Get Help

* Issues: [liv issue tracker](https://github.com/demos-ra/liv/issues)
* Security: [SECURITY.md](https://github.com/demos-ra/liv/blob/main/SECURITY.md)
* Maintainer: Demos Ra
* More: [all MTSV tools by Demos Ra](https://github.com/demos-ra)
