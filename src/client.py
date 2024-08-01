import random
import aiohttp
import asyncio

from .config import ENDPOINT, PROXY

SEARCHES = ["toto", "titi", "tata", "tutu"]
USERS = ["alice", "bob", "charlie", "david"]


async def search(session: aiohttp.ClientSession):
    query = random.choice(SEARCHES)
    get = random.choice([True, False])
    url = f"{ENDPOINT}/page/search?q={query}"
    if get:
        async with session.get(url, proxy=PROXY) as response:
            return await response.text()
    else:
        async with session.post(url, proxy=PROXY) as response:
            return await response.text()


async def user(session: aiohttp.ClientSession):
    user_name = random.choice(USERS)
    async with session.get(
        f"{ENDPOINT}/user/{user_name}?path=hello.world", proxy=PROXY
    ) as response:
        return await response.text()


async def data(session: aiohttp.ClientSession):
    async with session.post(f"{ENDPOINT}/data", proxy=PROXY) as response:
        return await response.text()


async def client():
    print("[-] Starting the client")
    await asyncio.sleep(3)
    async with aiohttp.ClientSession() as session:
        while True:
            try:
                print("[*] Sending request")
                request = random.choice([search, user, data])
                await request(session)
                await asyncio.sleep(1)
            except Exception as e:
                print(f"[-] Client error: {e}")
