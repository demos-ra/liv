def can_keep(delegate, activity):
    # /behavior/shared/modes can_keep 1
    # PROV-DM /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1 to /5. PROV-DM Types and Relations/5.3 Component 3: Agents, Responsibility, and Influence/5.3.3 Delegation/1
    return not delegate and activity != ""


def can_write(activity):
    # /behavior/shared/modes can_write 1
    return activity != ""
