import asyncio

from .client import client
from .server import server


async def app():
    await asyncio.gather(server(), client())
