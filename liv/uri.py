import os

UNRESERVED = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"


def percent_encode(segment):
    # /format/uri percent_encode 1
    # RFC3986 /2. Characters/2.1. Percent-Encoding/1 to /2. Characters/2.1. Percent-Encoding/3
    # RFC3986 /2. Characters/2.3. Unreserved Characters/1 to /2. Characters/2.3. Unreserved Characters/3
    # RFC3986 /2. Characters/2.4. When to Encode or Decode/3 to /2. Characters/2.4. When to Encode or Decode/3
    text = ""
    for octet in os.fsencode(segment):
        if chr(octet) in UNRESERVED:
            text += chr(octet)
        else:
            text += "%" + format(octet, "02X")
    return text
