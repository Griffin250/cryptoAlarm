-- Migration: Add voice notification type support
-- Date: 2025-11-08
-- Description: Add 'voice' as a valid notification type for alert notifications

-- Update the CHECK constraint to include 'voice'
ALTER TABLE public.alert_notifications 
DROP CONSTRAINT IF EXISTS alert_notifications_notification_type_check;

ALTER TABLE public.alert_notifications 
ADD CONSTRAINT alert_notifications_notification_type_check 
CHECK (notification_type IN ('email', 'sms', 'push', 'voice', 'webhook'));

-- Update existing records if needed (optional, for data migration)
-- UPDATE public.alert_notifications 
-- SET notification_type = 'voice' 
-- WHERE notification_type = 'sms' AND destination LIKE '+%';

-- Add comment for clarity
COMMENT ON COLUMN public.alert_notifications.notification_type IS 'Type of notification: email, sms, push, voice, or webhook';