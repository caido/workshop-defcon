from base64 import b64decode
from dataclasses import dataclass


@dataclass
class Finding:
    id: str
    parameters: list[(str, str)]
    dedup_key: str


def analyse(request) -> Finding | None:
    return None
