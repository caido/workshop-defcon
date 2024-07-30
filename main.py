import asyncio
from dotenv import load_dotenv
from src.app import app

if __name__ == "__main__":
    load_dotenv()
    print(r"__________        _____.__                 __")
    print(r"\______   \ _____/ ____\  |   ____   _____/  |_  ___________")
    print(r" |       _// __ \   __\|  | _/ __ \_/ ___\   __\/  _ \_  __ \ ")
    print(r" |    |   \  ___/|  |  |  |_\  ___/\  \___|  | (  <_> )  | \/")
    print(r" |____|_  /\___  >__|  |____/\___  >\___  >__|  \____/|__|")
    print(r"        \/     \/                \/     \/")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(app())
