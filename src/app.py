import asyncio
import os
from gql import Client
from gql.client import AsyncClientSession
from gql.transport.aiohttp import AIOHTTPTransport
from gql.transport.websockets import WebsocketsTransport

from .queries import request_full
from .gql import gql
from .analyze import analyse
from .finding import create_finding


async def subscribe_requests(client: AsyncClientSession):
    print("[*] Subscribing to new requests")
    query = gql(
        """
        subscription {
            updatedRequest {
              requestEdge {
                node {
                  ...RequestFull
                }
              }
            }
        }
        """,
        request_full,
    )

    async for request in client.subscribe(query):
        node = request["updatedRequest"]["requestEdge"]["node"]
        print(f"[*] New request {node['id']}")
        finding = analyse(node)
        if finding:
            print(f"[-] Found reflected parameter(s) {finding.parameters} in request {finding.id}")
            await create_finding(client, finding)


async def process_requests(client: AsyncClientSession, after: str = None):
    if os.getenv("PROCESS_EXISTING") != "true":
        print("[*] Not processing existing requests")
        return

    print("[*] Processing existing requests")
    query = gql(
        """
        query Requests($first: Int, $after: String) {
            requests(first: $first, after: $after) {
              nodes {
                ...RequestFull
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
        }
        """,
        request_full,
    )

    after = None
    i = 0
    while True:
        result = await client.execute(
            query, variable_values={"first": 100, "after": after}
        )

        for request in result["requests"]["nodes"]:
            finding = analyse(request)
            if finding:
                print(f"[-] Found reflected parameter(s) {finding.parameters} in request {finding.id}")
                await create_finding(client, finding)

        i += len(result["requests"]["nodes"])
        print(f"[*] Processed {i} requests")

        if result["requests"]["pageInfo"]["hasNextPage"]:
            after = result["requests"]["pageInfo"]["endCursor"]
        else:
            break


async def app():
    auth = {"Authorization": f"Bearer {os.getenv('ACCESS_TOKEN')}"}

    transport_queries = AIOHTTPTransport(
        url= f"http://{os.getenv("CAIDO_ENDPOINT")}/graphql",
        headers=auth,
    )
    transport_subscriptions = WebsocketsTransport(
        url=f"ws://{os.getenv("CAIDO_ENDPOINT")}/ws/graphql",
        init_payload=auth,
    )

    async with Client(
        transport=transport_queries, fetch_schema_from_transport=True, parse_results=True
    ) as client_queries, Client(
        transport=transport_subscriptions, fetch_schema_from_transport=True, parse_results=True
    ) as client_subscriptions:
        await asyncio.gather(process_requests(client_queries), subscribe_requests(client_subscriptions))
