from enum import Enum
from typing import Optional, Union
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class AlertType(str, Enum):
    PRICE_TARGET = "price_target"
    PERCENTAGE_CHANGE = "percentage_change"

class AlertDirection(str, Enum):
    ABOVE = "above"
    BELOW = "below"
    BOTH = "both"  # For percentage changes

class AlertStatus(str, Enum):
    ACTIVE = "active"
    TRIGGERED = "triggered"
    PAUSED = "paused"
    DELETED = "deleted"

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

class AlertTriggerEvent(BaseModel):
    alert_id: str
    symbol: str
    trigger_price: float
    target_value: float
    alert_type: AlertType
    direction: AlertDirection
    message: str
    triggered_at: datetime
