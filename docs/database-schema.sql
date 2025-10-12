-- CryptoAlarm Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  symbol TEXT NOT NULL, -- e.g., 'BTCUSDT', 'ETHUSDT'
  exchange TEXT DEFAULT 'binance',
  alert_type TEXT NOT NULL CHECK (alert_type IN ('price', 'percent_change', 'volume', 'technical_indicator')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  max_triggers INTEGER DEFAULT 1, -- 0 for unlimited
  cooldown_minutes INTEGER DEFAULT 0 -- minutes before can trigger again
);

-- Create alert conditions table
CREATE TABLE public.alert_conditions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE NOT NULL,
  condition_type TEXT NOT NULL CHECK (condition_type IN (
    'price_above', 'price_below', 'price_between',
    'percent_change_up', 'percent_change_down',
    'volume_above', 'volume_below',
    'rsi_above', 'rsi_below', 'macd_cross'
  )),
  target_value DECIMAL(20, 8) NOT NULL,
  target_value_2 DECIMAL(20, 8), -- for 'between' conditions
  timeframe TEXT DEFAULT '1h' CHECK (timeframe IN ('1m', '5m', '15m', '30m', '1h', '4h', '1d')),
  operator TEXT DEFAULT 'AND' CHECK (operator IN ('AND', 'OR')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alert notifications table
CREATE TABLE public.alert_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms', 'push', 'webhook')),
  destination TEXT NOT NULL, -- email address, phone number, webhook URL
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alert logs table
CREATE TABLE public.alert_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE NOT NULL,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  trigger_price DECIMAL(20, 8),
  trigger_conditions JSONB NOT NULL,
  market_data JSONB,
  notification_status JSONB DEFAULT '{"email": null, "sms": null, "push": null}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create price history table for caching
CREATE TABLE public.price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'binance',
  timeframe TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  open_price DECIMAL(20, 8) NOT NULL,
  high_price DECIMAL(20, 8) NOT NULL,
  low_price DECIMAL(20, 8) NOT NULL,
  close_price DECIMAL(20, 8) NOT NULL,
  volume DECIMAL(20, 8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, exchange, timeframe, timestamp)
);

-- Create indexes for better performance
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_symbol ON public.alerts(symbol);
CREATE INDEX idx_alerts_active ON public.alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_alert_conditions_alert_id ON public.alert_conditions(alert_id);
CREATE INDEX idx_alert_logs_alert_id ON public.alert_logs(alert_id);
CREATE INDEX idx_alert_logs_triggered_at ON public.alert_logs(triggered_at);
CREATE INDEX idx_price_history_symbol_timeframe ON public.price_history(symbol, timeframe, timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Alerts: users can only manage their own alerts
CREATE POLICY "Users can view own alerts" 
  ON public.alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" 
  ON public.alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" 
  ON public.alerts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" 
  ON public.alerts FOR DELETE 
  USING (auth.uid() = user_id);

-- Alert conditions: users can only manage conditions for their alerts
CREATE POLICY "Users can view own alert conditions" 
  ON public.alert_conditions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_conditions.alert_id 
    AND alerts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own alert conditions" 
  ON public.alert_conditions FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_conditions.alert_id 
    AND alerts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own alert conditions" 
  ON public.alert_conditions FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_conditions.alert_id 
    AND alerts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own alert conditions" 
  ON public.alert_conditions FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_conditions.alert_id 
    AND alerts.user_id = auth.uid()
  ));

-- Similar policies for alert_notifications and alert_logs
CREATE POLICY "Users can view own alert notifications" 
  ON public.alert_notifications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_notifications.alert_id 
    AND alerts.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own alert notifications" 
  ON public.alert_notifications FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_notifications.alert_id 
    AND alerts.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own alert logs" 
  ON public.alert_logs FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.alerts 
    WHERE alerts.id = alert_logs.alert_id 
    AND alerts.user_id = auth.uid()
  ));

-- Price history is public (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view price history" 
  ON public.price_history FOR SELECT 
  TO authenticated 
  USING (true);

-- Functions and triggers
-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sample data (optional)
-- You can run this after setting up authentication
/*
INSERT INTO public.price_history (symbol, timeframe, timestamp, open_price, high_price, low_price, close_price, volume)
VALUES 
  ('BTCUSDT', '1h', NOW() - INTERVAL '1 hour', 45000, 45500, 44800, 45200, 1250.5),
  ('ETHUSDT', '1h', NOW() - INTERVAL '1 hour', 2800, 2850, 2750, 2820, 8500.2);
*/