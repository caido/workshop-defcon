from .gql import gql


response_meta = gql(
    """
    """
)

response_full = gql(
    """
    """,
    response_meta,
)

request_meta = gql(
    """
    """,
    response_meta,
)

request_full = gql(
    """
    """,
    request_meta,
    response_full,
)
