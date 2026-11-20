from .banker import insert
from .modes import can_keep
from .relations import ENTITIES, ENTITIES_NAME, PROV_PERSON, PROV_SOFTWARE_AGENT, WORDS, WORDS_NAME, entity_rows
from .types import canonical_date_time


def keep_turn(entities_book, words_book, delegate, activity, person_text, person_seconds, agent_text, agent_seconds):
    # /behavior/drivers/keep keep_turn 1
    # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/7 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/9
    if not can_keep(delegate, activity):
        # /behavior/drivers/keep keep_turn 2
        return
    # /behavior/drivers/keep keep_turn 1
    # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/7 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/9
    for agent, text, seconds in ((PROV_PERSON, person_text, person_seconds), (PROV_SOFTWARE_AGENT, agent_text, agent_seconds)):
        # /behavior/drivers/keep keep_turn 3
        # PROV-DM /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/1 to /5. PROV-DM Types and Relations/5.1 Component 1: Entities and Activities/5.1.3 Generation/9
        time = "" if seconds is None else canonical_date_time(seconds)
        # /behavior/drivers/keep keep_turn 1
        # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/7 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.1 Agent/9
        entities, words = entity_rows(activity, agent, time, text)
        # /behavior/drivers/keep keep_turn 4
        insert(words_book, WORDS_NAME, [column for column, _ in WORDS], words)
        insert(entities_book, ENTITIES_NAME, [column for column, _ in ENTITIES], entities)
