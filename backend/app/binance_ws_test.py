import asyncio
import websockets
import json

async def listen():
    url = "wss://stream.binance.com:9443/ws/btcusdt@trade"
    async with websockets.connect(url) as ws:
        print("✅ Connected to Binance WebSocket for BTC/USDT trades...")
        while True:
            msg = await ws.recv()
            data = json.loads(msg)
            price = data["p"]  # trade price
            qty = data["q"]    # trade quantity
            print(f"Price: {price}, Quantity: {qty}")

if __name__ == "__main__":
    asyncio.run(listen())
