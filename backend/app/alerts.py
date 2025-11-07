"""
Enhanced notification service for CryptoAlarm.
Supports multiple notification types including SMS, Email, and Voice calls.
"""
import os
import asyncio
import logging
from typing import List, Dict, Any, Optional
from twilio.rest import Client
from dotenv import load_dotenv
from .models import AlertTriggerEvent, NotificationType, NotificationRequest
from .database import supabase_client

load_dotenv()

logger = logging.getLogger(__name__)

class NotificationService:
    """Enhanced notification service with multiple delivery methods."""
    
    def __init__(self):
        # Twilio configuration
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        # Initialize Twilio client if credentials are available
        if self.twilio_account_sid and self.twilio_auth_token:
            try:
                self.twilio_client = Client(self.twilio_account_sid, self.twilio_auth_token)
                logger.info("✅ Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Twilio client: {e}")
                self.twilio_client = None
        else:
            logger.warning("⚠️ Twilio credentials not configured")
            self.twilio_client = None
    
    def is_twilio_configured(self) -> bool:
        """Check if Twilio is properly configured."""
        return self.twilio_client is not None
    
    async def send_notifications(self, trigger_event: AlertTriggerEvent) -> List[Dict[str, Any]]:
        """Send notifications based on alert configuration."""
        notifications = getattr(trigger_event, 'notification_data', [])
        results = []
        
        if not notifications:
            logger.warning(f"No notification configuration found for alert {trigger_event.alert_id}")
            return results
        
        for notification in notifications:
            if not notification.get('is_enabled', True):
                logger.info(f"Notification disabled, skipping: {notification}")
                continue
                
            notification_type = notification.get('notification_type', '').lower()
            destination = notification.get('destination')
            
            if not destination:
                logger.warning(f"No destination provided for {notification_type} notification")
                continue
            
            try:
                result = None
                if notification_type == 'sms' or notification_type == 'voice':
                    result = await self._send_voice_call(destination, trigger_event.message)
                elif notification_type == 'email':
                    result = await self._send_email(destination, trigger_event)
                elif notification_type == 'push':
                    result = await self._send_push_notification(destination, trigger_event)
                else:
                    logger.warning(f"Unknown notification type: {notification_type}")
                    continue
                
                results.append({
                    'type': notification_type,
                    'destination': destination,
                    'success': result is not None,
                    'result': result,
                    'timestamp': trigger_event.triggered_at.isoformat()
                })
                
            except Exception as e:
                logger.error(f"❌ Failed to send {notification_type} notification: {e}")
                results.append({
                    'type': notification_type,
                    'destination': destination,
                    'success': False,
                    'error': str(e),
                    'timestamp': trigger_event.triggered_at.isoformat()
                })
        
        # Log notification results to database
        await self._log_notification_results(trigger_event.alert_id, results)
        
        return results
    
    async def _send_voice_call(self, phone_number: str, message: str) -> Optional[str]:
        """Send Twilio voice call with enhanced message."""
        if not self.is_twilio_configured():
            logger.error("❌ Twilio not configured, cannot send voice call")
            raise Exception("Twilio service not available")
        
        try:
            # Clean phone number (ensure it has country code)
            clean_number = self._clean_phone_number(phone_number)
            
            # Enhanced TwiML with better voice and pacing
            twiml = f'''
            <Response>
                <Say voice="alice" language="en-US">
                    <prosody rate="medium" volume="loud">
                        Crypto Alarm Alert! {message}
                        <break time="0.5s"/>
                        I repeat: {message}
                    </prosody>
                </Say>
            </Response>
            '''
            
            call = self.twilio_client.calls.create(
                to=clean_number,
                from_=self.twilio_phone,
                twiml=twiml
            )
            
            logger.info(f"📞 Voice call sent to {clean_number}: {call.sid}")
            return call.sid
            
        except Exception as e:
            logger.error(f"❌ Voice call failed: {e}")
            raise
    
    async def _send_email(self, email_address: str, trigger_event: AlertTriggerEvent) -> Optional[str]:
        """Send email notification (placeholder for future implementation)."""
        logger.info(f"📧 Email notification to {email_address}: {trigger_event.message}")
        # TODO: Implement email service (SendGrid, AWS SES, etc.)
        return f"email_placeholder_{trigger_event.alert_id}"
    
    async def _send_push_notification(self, device_id: str, trigger_event: AlertTriggerEvent) -> Optional[str]:
        """Send push notification (placeholder for future implementation)."""
        logger.info(f"📱 Push notification to {device_id}: {trigger_event.message}")
        # TODO: Implement push notification service (Firebase, etc.)
        return f"push_placeholder_{trigger_event.alert_id}"
    
    def _clean_phone_number(self, phone_number: str) -> str:
        """Clean and format phone number for Twilio."""
        # Remove any non-digit characters
        clean = ''.join(filter(str.isdigit, phone_number))
        
        # Add country code if not present
        if not clean.startswith('1') and len(clean) == 10:
            clean = '1' + clean
        
        return '+' + clean
    
    async def _log_notification_results(self, alert_id: str, results: List[Dict[str, Any]]) -> None:
        """Log notification results to database."""
        try:
            from datetime import datetime
            log_data = {
                'alert_id': alert_id,
                'notification_results': results,
                'total_sent': len([r for r in results if r.get('success')]),
                'total_failed': len([r for r in results if not r.get('success')]),
                'logged_at': datetime.now().isoformat()
            }
            
            await supabase_client.log_alert_trigger(log_data)
            
        except Exception as e:
            logger.error(f"❌ Failed to log notification results: {e}")
    
    async def test_notification(self, notification_request: NotificationRequest) -> Dict[str, Any]:
        """Test a single notification method."""
        try:
            result = None
            
            if notification_request.notification_type == NotificationType.VOICE:
                result = await self._send_voice_call(
                    notification_request.destination, 
                    notification_request.message
                )
            elif notification_request.notification_type == NotificationType.SMS:
                # For SMS, we'll use voice call since Twilio SMS requires verification
                result = await self._send_voice_call(
                    notification_request.destination, 
                    f"SMS Test: {notification_request.message}"
                )
            elif notification_request.notification_type == NotificationType.EMAIL:
                result = await self._send_email(
                    notification_request.destination, 
                    None  # Pass a mock trigger event
                )
            
            return {
                'success': True,
                'notification_type': notification_request.notification_type,
                'destination': notification_request.destination,
                'result': result,
                'message': 'Notification sent successfully'
            }
            
        except Exception as e:
            return {
                'success': False,
                'notification_type': notification_request.notification_type,
                'destination': notification_request.destination,
                'error': str(e),
                'message': f'Failed to send notification: {str(e)}'
            }

# Legacy function for backward compatibility
def send_voice_alert(message="CryptoAlarm alert! A price target has been reached.", phone_number=None):
    """Legacy function for backward compatibility."""
    service = NotificationService()
    
    if not service.is_twilio_configured():
        logger.error("❌ Twilio not configured")
        return None
    
    target_phone = phone_number or os.getenv("MY_PHONE_NUMBER")
    if not target_phone:
        logger.error("❌ No phone number provided")
        return None
    
    try:
        # Run async function in sync context
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Create a new task if loop is already running
            task = asyncio.create_task(service._send_voice_call(target_phone, message))
            return task
        else:
            return loop.run_until_complete(service._send_voice_call(target_phone, message))
    except Exception as e:
        logger.error(f"❌ Legacy voice alert failed: {e}")
        return None

# Global notification service instance
notification_service = NotificationService()
