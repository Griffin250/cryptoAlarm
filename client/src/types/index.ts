// Global types for the CryptoAlarm application

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  symbol: string;
  exchange?: string;
  alert_type: 'price' | 'percent_change' | 'volume' | 'technical_indicator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  triggered_at?: string;
  trigger_count?: number;
  max_triggers?: number;
  cooldown_minutes?: number;
  is_recurring?: boolean;
  recurring_frequency?: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  recurring_days?: number[]; // For weekly: [0,1,2,3,4,5,6] where 0=Sunday
  recurring_time?: string; // HH:MM format for daily/weekly/monthly
  recurring_end_date?: string; // ISO date string for when to stop recurring
}

export interface AlertCondition {
  id: string;
  alert_id: string;
  condition_type: 'price_above' | 'price_below' | 'price_between' | 'percent_change_up' | 'percent_change_down' | 'volume_above' | 'volume_below' | 'rsi_above' | 'rsi_below' | 'macd_cross';
  target_value: number;
  target_value_2?: number;
  timeframe?: string;
  operator?: 'AND' | 'OR';
  created_at: string;
}

export interface AlertNotification {
  id: string;
  alert_id: string;
  notification_type: 'email' | 'sms' | 'push' | 'voice' | 'webhook';
  destination: string;
  is_enabled: boolean;
  created_at: string;
}



export interface CryptoPrice {
  symbol: string;
  price: number;
  change_24h: number;
  change_24h_percent: number;
  volume_24h: number;
  market_cap?: number;
  last_updated: string;
}

export interface AlertStats {
  total_alerts: number;
  active_alerts: number;
  triggered_alerts: number;
  success_rate: number;
}

export interface ApiResponse<T = any> {
  data?: T | null;
  error?: string | null;
  message?: string;
}

// Navigation and UI types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
}

export interface Breadcrumb {
  title: string;
  href?: string;
}

// Component props interfaces
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Auth types
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

// Crypto data types
export interface CryptoInfo {
  name: string;
  symbol: string;
  icon: string;
  color: string;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  change24h: number;
  change24hPercent: number;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercent: number;
  items: PortfolioItem[];
}

// Form types
export interface AlertFormData {
  name?: string;
  symbol: string;
  alert_type: Alert['alert_type'];
  condition_type: AlertCondition['condition_type'];
  target_value: number;
  notification_type: 'email' | 'sms' | 'push';
  notification_destination: string;
}

export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}