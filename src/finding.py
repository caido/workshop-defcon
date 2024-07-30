from gql.client import AsyncClientSession

from .gql import gql
from .analyze import Finding


async def create_finding(client: AsyncClientSession, finding: Finding):
    print(f"[*] Creating finding {finding.id}")
