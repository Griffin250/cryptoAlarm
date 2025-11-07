"""
Database integration module for CryptoAlarm backend.
Connects to Supabase database for alert management and synchronization.
"""
from supabase import create_client, Client
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)

class SupabaseClient:
    """Supabase database client for alert operations."""
    
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_ANON_KEY')
        
        if not self.url or not self.key:
            logger.warning("Supabase credentials not configured - using mock mode")
            self.client = None
        else:
            try:
                self.client: Client = create_client(self.url, self.key)
                logger.info("✅ Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Supabase client: {e}")
                self.client = None
    
    def is_connected(self) -> bool:
        """Check if Supabase client is properly connected."""
        return self.client is not None
    
    async def fetch_active_alerts(self) -> List[Dict[str, Any]]:
        """Fetch all active alerts from database with conditions and notifications."""
        if not self.client:
            logger.warning("Supabase not connected - returning empty alerts list")
            return []
        
        try:
            response = self.client.table('alerts').select(
                '*', 
                'alert_conditions(*)',
                'alert_notifications(*)'
            ).eq('is_active', True).execute()
            
            alerts = response.data or []
            logger.info(f"📊 Fetched {len(alerts)} active alerts from database")
            return alerts
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch alerts from database: {e}")
            return []
    
    async def get_alert_by_id(self, alert_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific alert by ID with all related data."""
        if not self.client:
            return None
        
        try:
            response = self.client.table('alerts').select(
                '*', 
                'alert_conditions(*)',
                'alert_notifications(*)'
            ).eq('id', alert_id).single().execute()
            
            return response.data
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch alert {alert_id}: {e}")
            return None
    
    async def update_alert_status(self, alert_id: str, status_data: Dict[str, Any]) -> bool:
        """Update alert status and metadata in database."""
        if not self.client:
            logger.warning("Supabase not connected - skipping alert status update")
            return False
        
        try:
            response = self.client.table('alerts').update(status_data).eq('id', alert_id).execute()
            
            if response.data:
                logger.info(f"✅ Updated alert {alert_id} status")
                return True
            else:
                logger.warning(f"⚠️ No alert found with ID {alert_id} for status update")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to update alert status for {alert_id}: {e}")
            return False
    
    async def log_alert_trigger(self, alert_log_data: Dict[str, Any]) -> bool:
        """Log alert trigger event to database."""
        if not self.client:
            logger.warning("Supabase not connected - skipping alert trigger log")
            return False
        
        try:
            # Ensure the alert_logs table exists or create the log record
            response = self.client.table('alert_logs').insert(alert_log_data).execute()
            
            if response.data:
                logger.info(f"📝 Logged alert trigger for alert {alert_log_data.get('alert_id')}")
                return True
            else:
                logger.warning(f"⚠️ Failed to log alert trigger")
                return False
                
        except Exception as e:
            logger.error(f"❌ Failed to log alert trigger: {e}")
            return False
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile data for notifications."""
        if not self.client:
            return None
        
        try:
            response = self.client.table('profiles').select('*').eq('id', user_id).single().execute()
            return response.data
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch user profile {user_id}: {e}")
            return None
    
    async def create_alert_log_entry(self, alert_id: str, trigger_data: Dict[str, Any]) -> bool:
        """Create a structured log entry for alert triggers."""
        log_entry = {
            'alert_id': alert_id,
            'trigger_price': trigger_data.get('trigger_price'),
            'trigger_timestamp': datetime.now().isoformat(),
            'trigger_conditions': trigger_data.get('conditions', {}),
            'market_data': trigger_data.get('market_data', {}),
            'notification_sent': trigger_data.get('notification_sent', False),
            'notification_details': trigger_data.get('notification_details', {})
        }
        
        return await self.log_alert_trigger(log_entry)
    
    async def increment_alert_trigger_count(self, alert_id: str) -> bool:
        """Increment the trigger count for an alert."""
        if not self.client:
            return False
        
        try:
            # First get current count
            current_response = self.client.table('alerts').select('trigger_count').eq('id', alert_id).single().execute()
            current_count = current_response.data.get('trigger_count', 0) if current_response.data else 0
            
            # Update with incremented count
            update_data = {
                'trigger_count': current_count + 1,
                'last_triggered_at': datetime.now().isoformat()
            }
            
            return await self.update_alert_status(alert_id, update_data)
            
        except Exception as e:
            logger.error(f"❌ Failed to increment trigger count for {alert_id}: {e}")
            return False

# Global instance
supabase_client = SupabaseClient()