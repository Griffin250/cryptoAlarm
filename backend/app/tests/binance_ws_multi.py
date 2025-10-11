import asyncio
import websockets
import json
import time

# Track latest prices in a dictionary
latest_prices = {}

async def listen():
    url = "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade/xrpusdt@trade"

    async with websockets.connect(url) as ws:
        print("✅ Connected to Binance WebSocket for BTC, ETH, SOL, XRP...")

        last_print = time.time()
        while True:
            msg = await ws.recv()
            data = json.loads(msg)

            payload = data["data"]
            symbol = payload["s"]      # e.g. "BTCUSDT"
            price = float(payload["p"])  # trade price
            latest_prices[symbol] = price

            # Print every 5 seconds
            if time.time() - last_print >= 5:
                print("📊 Latest Prices:")
                for sym, val in latest_prices.items():
                    print(f"{sym}: {val}")
                print("----")
                last_print = time.time()

if __name__ == "__main__":
    asyncio.run(listen())
