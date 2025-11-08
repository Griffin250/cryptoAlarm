-- Safe Migration: Add voice notification support
-- This script checks existing state and only makes necessary changes

DO $$
BEGIN
    -- Check if alert_notifications table exists
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'alert_notifications') THEN
        
        RAISE NOTICE 'alert_notifications table exists, updating constraint...';
        
        -- Drop existing constraint if it exists
        IF EXISTS (SELECT 1 FROM pg_constraint con
                   JOIN pg_class rel ON rel.oid = con.conrelid
                   WHERE rel.relname = 'alert_notifications' 
                   AND con.conname = 'alert_notifications_notification_type_check') THEN
            
            RAISE NOTICE 'Dropping existing notification_type constraint...';
            ALTER TABLE public.alert_notifications 
            DROP CONSTRAINT alert_notifications_notification_type_check;
        END IF;
        
        -- Add new constraint with voice support
        RAISE NOTICE 'Adding new constraint with voice support...';
        ALTER TABLE public.alert_notifications 
        ADD CONSTRAINT alert_notifications_notification_type_check 
        CHECK (notification_type IN ('email', 'sms', 'push', 'voice', 'webhook'));
        
        -- Add comment
        COMMENT ON COLUMN public.alert_notifications.notification_type IS 
        'Type of notification: email, sms, push, voice, or webhook';
        
        RAISE NOTICE 'Voice notification support added successfully!';
        
    ELSE
        -- Table doesn't exist, create it
        RAISE NOTICE 'alert_notifications table does not exist, creating it...';
        
        CREATE TABLE public.alert_notifications (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            alert_id UUID NOT NULL,
            notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms', 'push', 'voice', 'webhook')),
            destination TEXT NOT NULL,
            is_enabled BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Add foreign key constraint if alerts table exists
        IF EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' AND table_name = 'alerts') THEN
            ALTER TABLE public.alert_notifications 
            ADD CONSTRAINT fk_alert_notifications_alert_id 
            FOREIGN KEY (alert_id) REFERENCES public.alerts(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'alert_notifications table created with voice support!';
    END IF;
    
END $$;