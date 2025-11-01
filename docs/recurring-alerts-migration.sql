-- Migration: Add recurring alert functionality to alerts table
-- Run this in your Supabase SQL Editor to add recurring alert support

-- Add recurring alert columns to the alerts table
ALTER TABLE public.alerts 
ADD COLUMN is_recurring BOOLEAN DEFAULT false,
ADD COLUMN recurring_frequency TEXT CHECK (recurring_frequency IN ('once', 'hourly', 'daily', 'weekly', 'monthly')) DEFAULT 'once',
ADD COLUMN recurring_days INTEGER[] DEFAULT NULL, -- Array of days for weekly: [0,1,2,3,4,5,6] where 0=Sunday
ADD COLUMN recurring_time TIME DEFAULT NULL, -- HH:MM format for daily/weekly/monthly
ADD COLUMN recurring_end_date DATE DEFAULT NULL; -- Date when recurring should stop

-- Add index for recurring alerts for better performance
CREATE INDEX idx_alerts_recurring ON public.alerts(is_recurring) WHERE is_recurring = true;

-- Add comments for documentation
COMMENT ON COLUMN public.alerts.is_recurring IS 'Whether this alert should repeat based on a schedule';
COMMENT ON COLUMN public.alerts.recurring_frequency IS 'How often the alert should repeat: once, hourly, daily, weekly, monthly';
COMMENT ON COLUMN public.alerts.recurring_days IS 'Array of days for weekly recurring alerts (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN public.alerts.recurring_time IS 'Time of day for daily/weekly/monthly recurring alerts';
COMMENT ON COLUMN public.alerts.recurring_end_date IS 'Optional end date for recurring alerts';

-- Update the updated_at trigger to include new columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists for alerts table
DROP TRIGGER IF EXISTS update_alerts_updated_at ON public.alerts;
CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON public.alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();