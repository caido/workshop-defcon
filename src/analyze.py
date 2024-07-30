from base64 import b64decode
from dataclasses import dataclass


@dataclass
class Finding:
    id: str
    parameters: list[(str, str)]
    dedup_key: str


def analyse(request) -> Finding | None:
    query: str = request["query"]
    if not query:
        return None
    parameters = dict(
        part.split("=", maxsplit=1)
        for part in query.split("&")
        if "=" in part and part.split("=", maxsplit=1)[1]
    )

    if not request["response"]:
        return None
    response_raw = b64decode(request["response"]["raw"])

    reflected_parameters = []
    for key, value in parameters.items():
        if value.encode() in response_raw:
            reflected_parameters.append((key, value))

    if reflected_parameters:
        dedupe_key = f"{request['method']}-{request['host']}-{request['path']}"
        return Finding(request["id"], reflected_parameters, dedupe_key)
    return None
