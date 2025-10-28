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
  crypto_symbol: string;
  alert_type: 'price_above' | 'price_below' | 'percent_change' | 'volume' | 'technical_indicator';
  target_value: number;
  current_value?: number;
  is_active: boolean;
  is_triggered: boolean;
  triggered_at?: string;
  notification_method: 'phone' | 'email' | 'both';
  created_at: string;
  updated_at: string;
}

export interface AlertCondition {
  id: string;
  alert_id: string;
  condition_type: string;
  target_value: number;
  operator: 'greater_than' | 'less_than' | 'equal_to';
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
  crypto_symbol: string;
  alert_type: Alert['alert_type'];
  target_value: number;
  notification_method: Alert['notification_method'];
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