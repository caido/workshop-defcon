import asyncio
from aiohttp import web

from .config import HOST, PORT


async def handle_search(request: web.Request):
    print("[*] Handling search request")
    query = request.query.get("q")
    return web.Response(
        text=f"<h1>Result for the query {query}:</h1>\n<p>No content found</p>",
        content_type="text/html",
    )


async def handle_user(request: web.Request):
    print("[*] Handling user request")
    query = request.query.get("path")
    name = request.match_info.get("name", "Anonymous")
    text = f"<h1>Hello, {name}</h1>\n<p>There is nothing to be found on: {query}</p>"
    return web.Response(
        text=text,
        content_type="text/html",
    )


async def handle_data(request: web.Request):
    print("[*] Handling data request")
    return web.Response()


async def server():
    print("[-] Starting the server")
    app = web.Application()
    app.add_routes(
        [
            web.post("/page/search", handle_search),
            web.get("/page/search", handle_search),
            web.get("/user/{name}", handle_user),
            web.post("/data", handle_data),
        ]
    )
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host=HOST, port=PORT)
    await site.start()

    await asyncio.Event().wait()
