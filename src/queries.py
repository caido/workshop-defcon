from .gql import gql


response_meta = gql(
    """
    fragment ResponseMeta on Response {
      __typename
      id
      statusCode
      roundtripTime
      length
      createdAt
      alteration
      edited
    }
    """
)

response_full = gql(
    """
    fragment ResponseFull on Response {
      ...ResponseMeta
      raw
      edits {
        ...ResponseMeta
      }
    }
    """,
    response_meta,
)


request_meta = gql(
    """
    fragment RequestMeta on Request {
      __typename
      id
      host
      port
      path
      query
      method
      edited
      isTls
      length
      alteration
      fileExtension
      source
      createdAt
      response {
        ...ResponseMeta
      }
    }
    """,
    response_meta,
)

request_full = gql(
    """
    fragment RequestFull on Request {
      ...RequestMeta
      raw
      edits {
        ...RequestMeta
      }
      response {
        ...ResponseFull
      }
    }
    """,
    request_meta,
    response_full,
)
