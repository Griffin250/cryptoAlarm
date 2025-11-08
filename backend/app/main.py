"""
Enhanced CryptoAlarm API with database integration and comprehensive notification support.
"""
import asyncio
import json
import websockets
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from .alerts import notification_service
from .models import (
    Alert, CreateAlertRequest, AlertResponse, AlertType, AlertDirection, AlertStatus,
    NotificationRequest, AlertSyncResponse, TestAlertRequest, AlertStatusResponse
)
from .alert_logic import alert_manager
from .database import supabase_client
from dotenv import load_dotenv
import os
import requests

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CryptoAlarm API", 
    description="Real-time cryptocurrency price monitoring with database integration and multi-channel notifications",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
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
    """Enhanced WebSocket listener with database alert checking."""
    try:
        async with websockets.connect(BINANCE_STREAM_URL) as ws:
            logger.info("✅ Connected to Binance WebSocket...")
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
                
                # Check alerts (both in-memory and database)
                triggered_events = await alert_manager.check_alert_conditions(symbol, price)
                
                # Send notifications for triggered events
                for event in triggered_events:
                    asyncio.create_task(alert_manager.send_notifications_for_trigger(event))
                    
    except Exception as e:
        logger.error(f"❌ Binance WebSocket error: {e}")
        # Retry connection after delay
        await asyncio.sleep(5)
        asyncio.create_task(listen_to_binance())

async def periodic_database_sync():
    """Periodically sync database alerts for monitoring."""
    while True:
        try:
            synced_count = await alert_manager.sync_database_alerts()
            if synced_count > 0:
                logger.info(f"🔄 Periodic sync: {synced_count} alerts")
            await asyncio.sleep(30)  # Sync every 30 seconds
        except Exception as e:
            logger.error(f"❌ Periodic sync failed: {e}")
            await asyncio.sleep(60)  # Wait longer on error

@app.on_event("startup")
async def startup_event():
    """Initialize services when FastAPI launches."""
    logger.info("🚀 Starting CryptoAlarm API...")
    
    # Initialize database connection and sync alerts
    await alert_manager.sync_database_alerts()
    
    # Start Binance WebSocket listener
    asyncio.create_task(listen_to_binance())
    
    # Start periodic database sync
    asyncio.create_task(periodic_database_sync())
    
    logger.info("✅ CryptoAlarm API started successfully")

# Basic endpoints
@app.get("/")
def root():
    """API health check."""
    return {
        "message": "CryptoAlarm API v2.0",
        "status": "running",
        "database_connected": supabase_client.is_connected(),
        "twilio_configured": notification_service.is_twilio_configured(),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health_check():
    """Detailed health check."""
    stats = alert_manager.get_alert_stats()
    return {
        "api_status": "healthy",
        "database_connected": supabase_client.is_connected(),
        "notification_service": notification_service.is_twilio_configured(),
        "active_symbols": len(latest_prices),
        "alert_stats": stats,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/prices")
def get_prices():
    """Return the latest tracked prices."""
    return {"prices": latest_prices}

# Database Integration Endpoints
@app.get("/alerts/debug")
async def debug_alerts():
    """Debug endpoint to show current alert status."""
    try:
        # Get database alerts
        db_alerts = await supabase_client.fetch_active_alerts()
        
        # Get in-memory alerts
        memory_alerts = list(alert_manager.alerts.keys())
        memory_alert_details = {aid: {"symbol": alert.symbol, "status": alert.status.value} 
                               for aid, alert in alert_manager.alerts.items()}
        
        # Check if sync is working
        logger.info(f"🔍 Debug: Found {len(db_alerts)} DB alerts, {len(memory_alerts)} memory alerts")
        
        return {
            "database_alerts": [{"id": a.get("id"), "symbol": a.get("symbol"), "name": a.get("name"), "is_active": a.get("is_active")} for a in db_alerts],
            "memory_alerts": memory_alert_details,
            "database_count": len(db_alerts),
            "memory_count": len(memory_alerts),
            "database_connected": supabase_client.is_connected(),
            "sync_status": {
                "last_sync": getattr(alert_manager, "last_sync_time", "never"),
                "sync_needed": len(db_alerts) != len(memory_alerts)
            },
            "latest_prices_count": len(latest_prices),
            "websocket_active": bool(latest_prices),
            "price_symbols": list(latest_prices.keys())[:10],  # Show first 10 price symbols
            "symbol_mapping_sample": {
                "SOL": alert_manager.get_trading_pair("SOL"),
                "BTC": alert_manager.get_trading_pair("BTC"),
                "ETH": alert_manager.get_trading_pair("ETH")
            }
        }
    except Exception as e:
        logger.error(f"❌ Debug alerts failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alerts/sync", response_model=AlertSyncResponse)
async def sync_alerts():
    """Manually trigger alert synchronization with database."""
    try:
        synced_count = await alert_manager.sync_database_alerts()
        active_alerts = [alert.id for alert in alert_manager.get_active_alerts()]
        
        return AlertSyncResponse(
            synced_count=synced_count,
            active_alerts=active_alerts,
            message=f"Successfully synchronized {synced_count} alerts from database",
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"❌ Manual sync failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alerts/{alert_id}/test")
async def test_alert(alert_id: str, test_request: Optional[TestAlertRequest] = None):
    """Test an alert by triggering it manually."""
    try:
        logger.info(f"🧪 Testing alert {alert_id}")
        
        # First check if we have this alert in our in-memory storage
        if alert_id in alert_manager.alerts:
            logger.info(f"✅ Found alert {alert_id} in memory")
            alert = alert_manager.alerts[alert_id]
        else:
            logger.info(f"🔍 Alert {alert_id} not in memory, checking database...")
            # Force sync first to ensure we have latest data
            logger.info(f"🔄 Syncing database alerts before lookup...")
            synced_count = await alert_manager.sync_database_alerts()
            logger.info(f"📊 Sync completed: {synced_count} alerts synced")
            
            # Try again after sync
            if alert_id in alert_manager.alerts:
                logger.info(f"✅ Found alert {alert_id} in memory after sync")
                alert = alert_manager.alerts[alert_id]
            else:
                # Fetch alert from database directly
                alert = await alert_manager.get_database_alert(alert_id)
                if not alert:
                    logger.warning(f"❌ Alert {alert_id} not found in database either")
                    # Let's also check what alerts we do have
                    all_db_alerts = await supabase_client.fetch_active_alerts()
                    logger.info(f"📊 Database has {len(all_db_alerts)} total alerts")
                    if all_db_alerts:
                        alert_ids = [a.get('id', 'no-id') for a in all_db_alerts[:3]]
                        logger.info(f"🔍 Sample alert IDs: {alert_ids}")
                    memory_alert_ids = list(alert_manager.alerts.keys())[:3]
                    logger.info(f"🧠 Sample memory alert IDs: {memory_alert_ids}")
                    raise HTTPException(status_code=404, detail="Alert not found")
                else:
                    logger.info(f"✅ Found alert {alert_id} directly from database")
        
        logger.info(f"✅ Using alert: {alert.symbol} - {alert.alert_type}")
        
        # Convert symbol to trading pair for price lookup
        trading_pair = alert_manager.get_trading_pair(alert.symbol)
        logger.info(f"🔄 Converting symbol '{alert.symbol}' to trading pair '{trading_pair}' for price lookup")
        
        # Get current price using trading pair
        current_price = latest_prices.get(trading_pair)
        if not current_price:
            logger.warning(f"❌ No price data for trading pair '{trading_pair}' (symbol: {alert.symbol})")
            logger.info(f"📊 Available price data: {list(latest_prices.keys())[:10]}...")  # Show first 10
            raise HTTPException(status_code=400, detail=f"No price data for {alert.symbol} ({trading_pair})")
        
        logger.info(f"💰 Current price for {trading_pair}: ${current_price:,.4f}")
        
        # Create test trigger event
        test_message = (test_request.message if test_request and test_request.message 
                       else f"Test Alert: {alert.symbol} is currently at ${current_price:,.2f}")
        
        from .models import AlertTriggerEvent
        trigger_event = AlertTriggerEvent(
            alert_id=alert.id,
            symbol=alert.symbol,
            trigger_price=current_price,
            target_value=alert.target_value,
            alert_type=alert.alert_type,
            direction=alert.direction,
            message=test_message,
            triggered_at=datetime.now(),
            notification_data=getattr(alert, 'notification_data', [])
        )
        
        # Send test notification
        results = await notification_service.send_notifications(trigger_event)
        
        return {
            "message": "Test alert sent successfully",
            "alert_id": alert_id,
            "test_message": test_message,
            "notification_results": results,
            "current_price": current_price
        }
        
    except Exception as e:
        logger.error(f"❌ Test alert failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts/{alert_id}/status", response_model=AlertStatusResponse)
async def get_alert_monitoring_status(alert_id: str):
    """Get monitoring status for a specific alert."""
    try:
        # Force a sync to ensure we have latest data
        logger.info(f"🔍 Getting status for alert {alert_id}, forcing sync first...")
        await alert_manager.sync_database_alerts()
        
        status_info = await alert_manager.get_monitoring_status(alert_id)
        logger.info(f"📊 Alert {alert_id} status: {status_info}")
        
        return AlertStatusResponse(
            alert_id=alert_id,
            is_active=status_info["is_active"],
            is_monitored=status_info["is_monitored"],
            last_checked=datetime.fromisoformat(status_info["last_checked"]) if status_info["last_checked"] else None,
            trigger_count=status_info["trigger_count"],
            status=AlertStatus(status_info["status"]) if status_info["status"] != "not_found" else AlertStatus.DELETED
        )
        
    except Exception as e:
        logger.error(f"❌ Failed to get alert status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Legacy and Enhanced Alert Management Endpoints
@app.post("/alerts", response_model=AlertResponse)
def create_alert(alert_request: CreateAlertRequest):
    """Create a new price or percentage-based alert (in-memory storage)"""
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
            triggered_at=created_alert.triggered_at,
            trigger_count=created_alert.trigger_count,
            is_monitored=True
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
            triggered_at=alert.triggered_at,
            trigger_count=alert.trigger_count,
            is_monitored=alert.id in alert_manager.alerts
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
        triggered_at=alert.triggered_at,
        trigger_count=alert.trigger_count,
        is_monitored=True
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

# Global Market Metrics Endpoint
@app.get("/global-metrics")
def get_global_metrics():
    """Fetch global crypto market metrics from CoinMarketCap API."""
    api_key = os.getenv("COIN_MARKET_CAP_API_KEY")
    if not api_key:
        return {"error": "CoinMarketCap API key not configured"}
    
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
        logger.error(f"❌ Error fetching global metrics: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching global metrics: {str(e)}")

# Testing and Notification Endpoints
@app.get("/test-alert")
def test_alert_simple():
    """Trigger a simple test voice alert."""
    try:
        from .alerts import send_voice_alert
        send_voice_alert("Hello! This is CryptoAlarm. Your test alert has been triggered successfully.")
        return {"status": "success", "message": "Test voice alert sent successfully"}
    except Exception as e:
        logger.error(f"❌ Test alert failed: {e}")
        return {"status": "error", "message": f"Test alert failed: {str(e)}"}

@app.post("/test-notification")
async def test_notification(notification_request: NotificationRequest):
    """Test a specific notification method."""
    try:
        result = await notification_service.test_notification(notification_request)
        return result
    except Exception as e:
        logger.error(f"❌ Test notification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
