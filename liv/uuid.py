import uuid

# /format/uuid uuid4 1
# RFC9562 /4. UUID Format/14 to /4. UUID Format/24
URN = "urn:uuid:"


def uuid4():
    # /format/uuid uuid4 1
    # RFC9562 /5. UUID Layouts/5.4. UUID Version 4/1 to /5. UUID Layouts/5.4. UUID Version 4/4
    # RFC9562 /4. UUID Format/14 to /4. UUID Format/24
    # PY-UUID /uuid --- UUID objects according to RFC 4122/uuid4()/1 to /uuid --- UUID objects according to RFC 4122/uuid4()/1
    return uuid.uuid4().urn
