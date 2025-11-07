from enum import Enum
from typing import Optional, Union, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class AlertType(str, Enum):
    PRICE_TARGET = "price_target"
    PERCENTAGE_CHANGE = "percentage_change"
    VOLUME = "volume"
    TECHNICAL_INDICATOR = "technical_indicator"

class AlertDirection(str, Enum):
    ABOVE = "above"
    BELOW = "below"
    BOTH = "both"  # For percentage changes

class AlertStatus(str, Enum):
    ACTIVE = "active"
    TRIGGERED = "triggered"
    PAUSED = "paused"
    DELETED = "deleted"

class NotificationType(str, Enum):
    SMS = "sms"
    EMAIL = "email"
    PUSH = "push"
    VOICE = "voice"

class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"  # For future multi-user support
    symbol: str = Field(..., description="Crypto symbol (e.g., BTCUSDT)")
    alert_type: AlertType
    direction: AlertDirection
    target_value: float = Field(..., description="Price target or percentage value")
    baseline_price: Optional[float] = Field(None, description="Base price for percentage calculations")
    current_price: Optional[float] = None
    status: AlertStatus = AlertStatus.ACTIVE
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    triggered_at: Optional[datetime] = None
    last_checked: Optional[datetime] = None
    trigger_count: int = 0
    is_one_time: bool = True
    notification_data: Optional[List[Dict[str, Any]]] = []

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CreateAlertRequest(BaseModel):
    symbol: str = Field(..., description="Crypto symbol (e.g., BTCUSDT)")
    alert_type: AlertType
    direction: AlertDirection
    target_value: float = Field(..., gt=0, description="Price target or percentage value")
    message: Optional[str] = Field(None, description="Custom alert message")

class AlertResponse(BaseModel):
    id: str
    symbol: str
    alert_type: AlertType
    direction: AlertDirection
    target_value: float
    baseline_price: Optional[float]
    current_price: Optional[float]
    status: AlertStatus
    message: Optional[str]
    created_at: datetime
    triggered_at: Optional[datetime]
    trigger_count: int
    is_monitored: bool = False

class AlertTriggerEvent(BaseModel):
    alert_id: str
    symbol: str
    trigger_price: float
    target_value: float
    alert_type: AlertType
    direction: AlertDirection
    message: str
    triggered_at: datetime
    notification_data: Optional[List[Dict[str, Any]]] = []

class NotificationRequest(BaseModel):
    alert_id: str
    notification_type: NotificationType
    destination: str
    message: str
    metadata: Optional[Dict[str, Any]] = {}

class DatabaseAlert(BaseModel):
    """Model for alerts fetched from Supabase database"""
    id: str
    user_id: str
    symbol: str
    alert_type: str
    is_active: bool
    name: Optional[str] = None
    description: Optional[str] = None
    created_at: str
    triggered_at: Optional[str] = None
    trigger_count: Optional[int] = 0
    is_recurring: Optional[bool] = False
    recurring_frequency: Optional[str] = None
    alert_conditions: Optional[List[Dict[str, Any]]] = []
    alert_notifications: Optional[List[Dict[str, Any]]] = []

class AlertSyncResponse(BaseModel):
    """Response model for alert synchronization"""
    synced_count: int
    active_alerts: List[str]
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)

class TestAlertRequest(BaseModel):
    """Request model for testing alerts"""
    alert_id: str
    message: Optional[str] = None

class AlertStatusResponse(BaseModel):
    """Response model for alert monitoring status"""
    alert_id: str
    is_active: bool
    is_monitored: bool
    last_checked: Optional[datetime] = None
    trigger_count: int = 0
    status: AlertStatus
