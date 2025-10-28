import asyncio
import json
import websockets
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from .alerts import send_voice_alert
from .models import Alert, CreateAlertRequest, AlertResponse, AlertType, AlertDirection, AlertStatus
from .alert_logic import alert_manager
from twilio.rest import Client

from dotenv import load_dotenv
load_dotenv()
import os
import requests

app = FastAPI(title="CryptoAlarm API", description="Real-time cryptocurrency price monitoring with voice alerts")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary fix - allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared dictionary for latest prices
latest_prices = {}


# Binance WebSocket stream - All 20 cryptocurrencies
BINANCE_STREAM_URL = (
    "wss://stream.binance.com:9443/stream?"
    "streams="
    "btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker/solusdt@ticker/xrpusdt@ticker/"
    "dogeusdt@ticker/adausdt@ticker/shibusdt@ticker/usdcusdt@ticker/suiusdt@ticker/"
    "pepeusdt@ticker/trxusdt@ticker/linkusdt@ticker/ltcusdt@ticker/polyusdt@ticker/"
    "bchusdt@ticker/dotusdt@ticker/avaxusdt@ticker/uniusdt@ticker/xlmusdt@ticker"
)

async def listen_to_binance():
    """Background task to listen to Binance WebSocket and update prices."""
    async with websockets.connect(BINANCE_STREAM_URL) as ws:
        print("✅ Connected to Binance WebSocket...")
        while True:
            msg = await ws.recv()
            data = json.loads(msg)
            payload = data["data"]
            symbol = payload["s"]      # e.g. "BTCUSDT"
            
            # Handle both ticker (@ticker) and trade (@trade) stream formats
            if "c" in payload:  # Ticker stream - use close price
                price = float(payload["c"])
            elif "p" in payload:  # Trade stream - use trade price  
                price = float(payload["p"])
            else:
                continue  # Skip if no price data
                
            latest_prices[symbol] = price
            
            # Check for triggered alerts
            triggered_events = alert_manager.check_alert_conditions(symbol, price)
            
            # Send voice alerts for triggered events
            for event in triggered_events:
                asyncio.create_task(alert_manager.trigger_voice_alert(event))
            


@app.on_event("startup")
async def startup_event():
    """Start Binance WebSocket listener when FastAPI launches."""
    asyncio.create_task(listen_to_binance())


@app.get("/prices")
def get_prices():
    """Return the latest tracked prices."""
    return {"prices": latest_prices}

# Global Market Metrics Endpoint
@app.get("/global-metrics")
def get_global_metrics():
    """Fetch global crypto market metrics from CoinMarketCap API."""
    api_key = os.getenv("COIN_MARKET_CAP_API_KEY")
    url = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest"
    headers = {"X-CMC_PRO_API_KEY": api_key}
    params = {"convert": "USD"}
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()["data"]
        result = {
            "btc_dominance": data.get("btc_dominance"),
            "eth_dominance": data.get("eth_dominance"),
            "active_cryptocurrencies": data.get("active_cryptocurrencies"),
            "active_exchanges": data.get("active_exchanges"),
            "totalmarketcap": data.get("quote", {}).get("USD", {}).get("total_market_cap", data.get("totalmarketcap")),
            "totalvolume24h": data.get("quote", {}).get("USD", {}).get("total_volume_24h", data.get("totalvolume24h")),
            "last_updated": data.get("last_updated"),
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching global metrics: {str(e)}")

# Alert Management Endpoints

@app.post("/alerts", response_model=AlertResponse)
def create_alert(alert_request: CreateAlertRequest):
    """Create a new price or percentage-based alert"""
    try:
        # Get current price for the symbol to set baseline
        current_price = latest_prices.get(alert_request.symbol)
        if not current_price:
            raise HTTPException(status_code=400, detail=f"No price data available for {alert_request.symbol}")
        
        alert = Alert(
            symbol=alert_request.symbol,
            alert_type=alert_request.alert_type,
            direction=alert_request.direction,
            target_value=alert_request.target_value,
            baseline_price=current_price if alert_request.alert_type == AlertType.PERCENTAGE_CHANGE else None,
            current_price=current_price,
            message=alert_request.message
        )
        
        created_alert = alert_manager.create_alert(alert)
        
        return AlertResponse(
            id=created_alert.id,
            symbol=created_alert.symbol,
            alert_type=created_alert.alert_type,
            direction=created_alert.direction,
            target_value=created_alert.target_value,
            baseline_price=created_alert.baseline_price,
            current_price=created_alert.current_price,
            status=created_alert.status,
            message=created_alert.message,
            created_at=created_alert.created_at,
            triggered_at=created_alert.triggered_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts", response_model=List[AlertResponse])
def get_alerts(status: Optional[AlertStatus] = None):
    """Get all alerts, optionally filtered by status"""
    alerts = alert_manager.get_all_alerts(status=status)
    return [
        AlertResponse(
            id=alert.id,
            symbol=alert.symbol,
            alert_type=alert.alert_type,
            direction=alert.direction,
            target_value=alert.target_value,
            baseline_price=alert.baseline_price,
            current_price=alert.current_price,
            status=alert.status,
            message=alert.message,
            created_at=alert.created_at,
            triggered_at=alert.triggered_at
        ) for alert in alerts
    ]

@app.get("/alerts/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: str):
    """Get a specific alert by ID"""
    alert = alert_manager.get_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return AlertResponse(
        id=alert.id,
        symbol=alert.symbol,
        alert_type=alert.alert_type,
        direction=alert.direction,
        target_value=alert.target_value,
        baseline_price=alert.baseline_price,
        current_price=alert.current_price,
        status=alert.status,
        message=alert.message,
        created_at=alert.created_at,
        triggered_at=alert.triggered_at
    )

@app.put("/alerts/{alert_id}/status")
def update_alert_status(alert_id: str, status: AlertStatus):
    """Update alert status (active, paused, deleted)"""
    alert = alert_manager.update_alert_status(alert_id, status)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": f"Alert {alert_id} status updated to {status.value}"}

@app.delete("/alerts/{alert_id}")
def delete_alert(alert_id: str):
    """Delete an alert"""
    success = alert_manager.delete_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": f"Alert {alert_id} deleted successfully"}

@app.get("/alerts/stats")
def get_alert_stats():
    """Get alert statistics"""
    return alert_manager.get_alert_stats()

@app.get("/test-alert")
def test_alert():
    """Trigger a test voice alert."""
    send_voice_alert("Hello! This is CryptoAlarm. Your price alert has been triggered.")
    return {"status": "Voice alert sent", "message": "Test alert triggered successfully"}
