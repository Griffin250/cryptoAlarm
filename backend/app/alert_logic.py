import asyncio
from typing import Dict, List, Optional
from datetime import datetime
from .models import Alert, AlertType, AlertDirection, AlertStatus, AlertTriggerEvent
from .alerts import send_voice_alert

class AlertManager:
    def __init__(self):
        self.alerts: Dict[str, Alert] = {}
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

    def create_alert(self, alert: Alert) -> Alert:
        """Create a new alert"""
        self.alerts[alert.id] = alert
        print(f"✅ Alert created: {alert.symbol} {alert.alert_type.value} {alert.direction.value} {alert.target_value}")
        return alert

    def get_alert(self, alert_id: str) -> Optional[Alert]:
        """Get a specific alert by ID"""
        return self.alerts.get(alert_id)

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

    def check_alert_conditions(self, symbol: str, current_price: float) -> List[AlertTriggerEvent]:
        """Check if any alerts should be triggered for a given symbol and price"""
        triggered_events = []
        
        for alert in self.alerts.values():
            if (alert.symbol == symbol and 
                alert.status == AlertStatus.ACTIVE and 
                self._should_trigger_alert(alert, current_price)):
                
                # Mark alert as triggered
                alert.status = AlertStatus.TRIGGERED
                alert.triggered_at = datetime.now()
                alert.current_price = current_price
                
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
                    triggered_at=datetime.now()
                )
                
                triggered_events.append(trigger_event)
                print(f"🚨 Alert triggered: {message}")
        
        return triggered_events

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

    async def trigger_voice_alert(self, trigger_event: AlertTriggerEvent):
        """Send voice alert for triggered event"""
        try:
            send_voice_alert(trigger_event.message)
            print(f"📞 Voice alert sent for {trigger_event.symbol}: {trigger_event.message}")
        except Exception as e:
            print(f"❌ Failed to send voice alert: {e}")

    def get_alert_stats(self) -> Dict:
        """Get statistics about alerts"""
        total_alerts = len(self.alerts)
        active_alerts = len([a for a in self.alerts.values() if a.status == AlertStatus.ACTIVE])
        triggered_alerts = len([a for a in self.alerts.values() if a.status == AlertStatus.TRIGGERED])
        
        return {
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "triggered_alerts": triggered_alerts,
            "paused_alerts": total_alerts - active_alerts - triggered_alerts
        }

# Global alert manager instance
alert_manager = AlertManager()
