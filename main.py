import asyncio
from src.app import app

if __name__ == "__main__":
    print("[*] Starting the application")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(app())
