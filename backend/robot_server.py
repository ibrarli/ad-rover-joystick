import asyncio
import websockets
import json

async def handler(websocket):
    print("Client connected.")
    try:
        async for message in websocket:
            data = json.loads(message)
            left = data["left"]
            right = data["right"]
            print(f"m {left} {right}")
            # Here, add your motor code (GPIO or serial)
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected.")

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("WebSocket server running on ws://localhost:8765")
        await asyncio.Future()

asyncio.run(main())
