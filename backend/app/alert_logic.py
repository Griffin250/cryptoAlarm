"""
Enhanced Alert Manager with database synchronization.
Bridges the gap between Supabase database alerts and real-time monitoring.
"""
import asyncio
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from .models import (
    Alert, AlertType, AlertDirection, AlertStatus, AlertTriggerEvent, 
    DatabaseAlert, NotificationType
)
from .alerts import notification_service
from .database import supabase_client

logger = logging.getLogger(__name__)

class AlertManager:
    """Enhanced Alert Manager with database synchronization capabilities."""
    
    def __init__(self):
        self.alerts: Dict[str, Alert] = {}  # In-memory alert storage
        self.last_sync: Optional[datetime] = None
        self.last_sync_time: Optional[str] = None  # ISO format for easy serialization
        self.sync_interval = 30  # seconds
        # Symbol mapping for crypto symbols to trading pairs
        self.symbol_to_pair = {
            "BTC": "BTCUSDT",
            "ETH": "ETHUSDT", 
            "BNB": "BNBUSDT",
            "SOL": "SOLUSDT",
            "XRP": "XRPUSDT",
            "DOGE": "DOGEUSDT",
            "ADA": "ADAUSDT",
            "SHIB": "SHIBUSDT",
            "USDC": "USDCUSDT",
            "SUI": "SUIUSDT",
            "PEPE": "PEPEUSDT",
            "TRX": "TRXUSDT",
            "LINK": "LINKUSDT",
            "LTC": "LTCUSDT",
            "POL": "POLYUSDT",
            "BCH": "BCHUSDT",
            "DOT": "DOTUSDT",
            "AVAX": "AVAXUSDT",
            "UNI": "UNIUSDT",
            "XLM": "XLMUSDT"
        }
        self.crypto_names = {
            "BTCUSDT": "Bitcoin",
            "ETHUSDT": "Ethereum", 
            "BNBUSDT": "BNB",
            "SOLUSDT": "Solana",
            "XRPUSDT": "XRP",
            "DOGEUSDT": "Dogecoin",
            "ADAUSDT": "Cardano",
            "SHIBUSDT": "Shiba Inu",
            "USDCUSDT": "USD Coin",
            "SUIUSDT": "Sui",
            "PEPEUSDT": "Pepe"
        }
        logger.info("🔧 AlertManager initialized with symbol mapping")
    
    def get_trading_pair(self, symbol: str) -> str:
        """Convert crypto symbol to trading pair for price lookup."""
        symbol = symbol.upper()
        # If already a trading pair, return as-is
        if symbol.endswith("USDT"):
            return symbol
        # Convert crypto symbol to trading pair
        return self.symbol_to_pair.get(symbol, f"{symbol}USDT")
    
    def get_crypto_symbol(self, pair: str) -> str:
        """Convert trading pair back to crypto symbol."""
        if pair.endswith("USDT"):
            return pair[:-4]  # Remove "USDT" suffix
        return pair
    
    async def sync_database_alerts(self) -> int:
        """Sync alerts from Supabase database to memory for monitoring."""
        try:
            db_alerts = await supabase_client.fetch_active_alerts()
            
            # Clear existing database alerts and reload
            db_alert_ids = set()
            
            for db_alert in db_alerts:
                # Convert database alert to Alert model
                alert = self._convert_db_alert_to_model(db_alert)
                if alert:
                    self.alerts[alert.id] = alert
                    db_alert_ids.add(alert.id)
            
            # Remove alerts that are no longer in database
            self._cleanup_stale_alerts(db_alert_ids)
            
            self.last_sync = datetime.now()
            self.last_sync_time = self.last_sync.isoformat()
            logger.info(f"✅ Synced {len(db_alerts)} alerts from database at {self.last_sync_time}")
            return len(db_alerts)
            
        except Exception as e:
            logger.error(f"❌ Database sync failed: {e}")
            return 0
    
    def _convert_db_alert_to_model(self, db_alert: Dict) -> Optional[Alert]:
        """Convert database alert format to Alert model for monitoring."""
        try:
            # Extract condition data
            conditions = db_alert.get('alert_conditions', [])
            condition = conditions[0] if conditions else {}
            
            # Extract notification data
            notifications = db_alert.get('alert_notifications', [])
            
            # Map database fields to Alert model
            alert_type_map = {
                'price': AlertType.PRICE_TARGET,
                'percent_change': AlertType.PERCENTAGE_CHANGE,
                'percentage': AlertType.PERCENTAGE_CHANGE,
                'volume': AlertType.VOLUME,
                'technical_indicator': AlertType.TECHNICAL_INDICATOR
            }
            
            direction_map = {
                'price_above': AlertDirection.ABOVE,
                'price_below': AlertDirection.BELOW,
                'price_between': AlertDirection.BOTH,
                'percentage_increase': AlertDirection.ABOVE,
                'percentage_decrease': AlertDirection.BELOW,
                'percentage_change': AlertDirection.BOTH
            }
            
            alert_type = alert_type_map.get(
                db_alert.get('alert_type'), 
                AlertType.PRICE_TARGET
            )
            
            condition_type = condition.get('condition_type', 'price_above')
            direction = direction_map.get(condition_type, AlertDirection.ABOVE)
            
            return Alert(
                id=db_alert['id'],
                user_id=db_alert['user_id'],
                symbol=db_alert['symbol'].upper(),
                alert_type=alert_type,
                direction=direction,
                target_value=float(condition.get('target_value', 0)),
                status=AlertStatus.ACTIVE,
                message=db_alert.get('description', ''),
                created_at=datetime.fromisoformat(
                    db_alert['created_at'].replace('Z', '+00:00') 
                    if 'Z' in db_alert['created_at'] 
                    else db_alert['created_at']
                ),
                trigger_count=db_alert.get('trigger_count', 0),
                is_one_time=not db_alert.get('is_recurring', True),
                notification_data=notifications
            )
            
        except Exception as e:
            logger.error(f"❌ Failed to convert database alert: {e}")
            return None
    
    def _cleanup_stale_alerts(self, current_db_alert_ids: set):
        """Remove alerts that are no longer in the database."""
        stale_alerts = []
        for alert_id, alert in self.alerts.items():
            # Only remove database alerts that are no longer active
            if alert_id not in current_db_alert_ids and hasattr(alert, 'user_id'):
                stale_alerts.append(alert_id)
        
        for alert_id in stale_alerts:
            del self.alerts[alert_id]
            logger.info(f"🗑️ Removed stale alert: {alert_id}")

    def create_alert(self, alert: Alert) -> Alert:
        """Create a new alert (for in-memory alerts)"""
        self.alerts[alert.id] = alert
        logger.info(f"✅ Alert created: {alert.symbol} {alert.alert_type.value} {alert.direction.value} {alert.target_value}")
        return alert

    def get_alert(self, alert_id: str) -> Optional[Alert]:
        """Get a specific alert by ID"""
        return self.alerts.get(alert_id)
    
    async def get_database_alert(self, alert_id: str) -> Optional[Alert]:
        """Get a specific alert from database and convert to model."""
        db_alert = await supabase_client.get_alert_by_id(alert_id)
        if db_alert:
            return self._convert_db_alert_to_model(db_alert)
        return None

    def get_all_alerts(self, user_id: str = "default_user", status: Optional[AlertStatus] = None) -> List[Alert]:
        """Get all alerts for a user, optionally filtered by status"""
        alerts = [alert for alert in self.alerts.values() if alert.user_id == user_id]
        if status:
            alerts = [alert for alert in alerts if alert.status == status]
        return alerts

    def get_active_alerts(self) -> List[Alert]:
        """Get all active alerts"""
        return [alert for alert in self.alerts.values() if alert.status == AlertStatus.ACTIVE]

    def update_alert_status(self, alert_id: str, status: AlertStatus) -> Optional[Alert]:
        """Update alert status"""
        if alert_id in self.alerts:
            self.alerts[alert_id].status = status
            return self.alerts[alert_id]
        return None

    def delete_alert(self, alert_id: str) -> bool:
        """Delete an alert"""
        if alert_id in self.alerts:
            self.alerts[alert_id].status = AlertStatus.DELETED
            return True
        return False

    async def check_alert_conditions(self, symbol: str, current_price: float) -> List[AlertTriggerEvent]:
        """Enhanced alert checking with database sync and notification support."""
        # Sync database alerts periodically
        if (not self.last_sync or 
            (datetime.now() - self.last_sync).seconds > self.sync_interval):
            await self.sync_database_alerts()
        
        triggered_events = []
        
        # Convert trading pair to crypto symbol for comparison
        # WebSocket gives us "SOLUSDT", alerts are stored as "SOL"
        crypto_symbol = self.get_crypto_symbol(symbol)
        
        for alert in self.alerts.values():
            # Check if alert symbol matches (either direct or after conversion)
            alert_matches = (
                alert.symbol.upper() == symbol.upper() or  # Direct match (SOLUSDT == SOLUSDT)
                alert.symbol.upper() == crypto_symbol.upper()  # Crypto symbol match (SOL == SOL)
            )
            
            if (alert_matches and 
                alert.status == AlertStatus.ACTIVE and 
                self._should_trigger_alert(alert, current_price)):
                
                # Handle alert trigger in database
                await self._handle_alert_trigger(alert, current_price)
                
                # Create trigger event
                message = self._generate_alert_message(alert, current_price)
                trigger_event = AlertTriggerEvent(
                    alert_id=alert.id,
                    symbol=alert.symbol,
                    trigger_price=current_price,
                    target_value=alert.target_value,
                    alert_type=alert.alert_type,
                    direction=alert.direction,
                    message=message,
                    triggered_at=datetime.now(),
                    notification_data=getattr(alert, 'notification_data', [])
                )
                
                triggered_events.append(trigger_event)
                logger.info(f"🚨 Alert triggered: {message}")
        
        return triggered_events
    
    async def _handle_alert_trigger(self, alert: Alert, current_price: float) -> None:
        """Handle alert trigger in database and update status."""
        try:
            # Update alert status in memory
            alert.status = AlertStatus.TRIGGERED
            alert.triggered_at = datetime.now()
            alert.current_price = current_price
            alert.trigger_count += 1
            
            # Update alert status in database
            status_data = {
                'triggered_at': datetime.now().isoformat(),
                'trigger_count': alert.trigger_count,
                'last_trigger_price': current_price,
                'is_active': not alert.is_one_time  # Deactivate if one-time alert
            }
            
            await supabase_client.update_alert_status(alert.id, status_data)
            
            # Create detailed trigger log
            trigger_data = {
                'trigger_price': current_price,
                'conditions': {
                    'symbol': alert.symbol,
                    'target_value': alert.target_value,
                    'alert_type': alert.alert_type.value,
                    'direction': alert.direction.value
                },
                'market_data': {
                    'current_price': current_price,
                    'timestamp': datetime.now().isoformat()
                }
            }
            
            await supabase_client.create_alert_log_entry(alert.id, trigger_data)
            
        except Exception as e:
            logger.error(f"❌ Failed to handle alert trigger for {alert.id}: {e}")

    def _should_trigger_alert(self, alert: Alert, current_price: float) -> bool:
        """Determine if an alert should be triggered based on current price"""
        if alert.alert_type == AlertType.PRICE_TARGET:
            return self._check_price_target(alert, current_price)
        elif alert.alert_type == AlertType.PERCENTAGE_CHANGE:
            return self._check_percentage_change(alert, current_price)
        return False

    def _check_price_target(self, alert: Alert, current_price: float) -> bool:
        """Check if price target condition is met"""
        if alert.direction == AlertDirection.ABOVE:
            return current_price >= alert.target_value
        elif alert.direction == AlertDirection.BELOW:
            return current_price <= alert.target_value
        return False

    def _check_percentage_change(self, alert: Alert, current_price: float) -> bool:
        """Check if percentage change condition is met"""
        if not alert.baseline_price:
            # Set baseline price if not set (first time checking)
            alert.baseline_price = current_price
            return False
        
        percentage_change = ((current_price - alert.baseline_price) / alert.baseline_price) * 100
        abs_change = abs(percentage_change)
        
        if alert.direction == AlertDirection.ABOVE:
            return percentage_change >= alert.target_value
        elif alert.direction == AlertDirection.BELOW:
            return percentage_change <= -alert.target_value
        elif alert.direction == AlertDirection.BOTH:
            return abs_change >= alert.target_value
        
        return False

    def _generate_alert_message(self, alert: Alert, current_price: float) -> str:
        """Generate a custom voice message for the alert"""
        if alert.message:
            return alert.message
        
        crypto_name = self.crypto_names.get(alert.symbol, alert.symbol.replace("USDT", ""))
        
        if alert.alert_type == AlertType.PRICE_TARGET:
            direction_text = "risen above" if alert.direction == AlertDirection.ABOVE else "fallen below"
            return f"CryptoAlarm Alert! {crypto_name} has {direction_text} ${alert.target_value:,.2f}. Current price is ${current_price:,.2f}."
        
        elif alert.alert_type == AlertType.PERCENTAGE_CHANGE:
            if alert.baseline_price:
                change = ((current_price - alert.baseline_price) / alert.baseline_price) * 100
                direction_text = "increased" if change > 0 else "decreased"
                return f"CryptoAlarm Alert! {crypto_name} has {direction_text} by {abs(change):.2f}% to ${current_price:,.2f}."
        
        return f"CryptoAlarm Alert! {crypto_name} target reached at ${current_price:,.2f}."

    async def send_notifications_for_trigger(self, trigger_event: AlertTriggerEvent) -> List[Dict]:
        """Send notifications for a triggered alert."""
        try:
            results = await notification_service.send_notifications(trigger_event)
            logger.info(f"� Sent {len(results)} notifications for alert {trigger_event.alert_id}")
            return results
        except Exception as e:
            logger.error(f"❌ Failed to send notifications for alert {trigger_event.alert_id}: {e}")
            return []

    def get_alert_stats(self) -> Dict:
        """Get statistics about alerts"""
        total_alerts = len(self.alerts)
        active_alerts = len([a for a in self.alerts.values() if a.status == AlertStatus.ACTIVE])
        triggered_alerts = len([a for a in self.alerts.values() if a.status == AlertStatus.TRIGGERED])
        
        return {
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "triggered_alerts": triggered_alerts,
            "paused_alerts": total_alerts - active_alerts - triggered_alerts,
            "last_sync": self.last_sync.isoformat() if self.last_sync else None,
            "database_connected": supabase_client.is_connected()
        }
    
    async def get_monitoring_status(self, alert_id: str) -> Dict:
        """Get monitoring status for a specific alert."""
        alert = self.get_alert(alert_id)
        return {
            "alert_id": alert_id,
            "is_active": alert.status == AlertStatus.ACTIVE if alert else False,
            "is_monitored": alert_id in self.alerts,
            "last_checked": alert.last_checked.isoformat() if alert and alert.last_checked else None,
            "trigger_count": alert.trigger_count if alert else 0,
            "status": alert.status.value if alert else "not_found"
        }

# Global alert manager instance
alert_manager = AlertManager()
