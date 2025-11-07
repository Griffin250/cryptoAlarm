import axios from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
                   import.meta.env.VITE_API_URL || 
                   "https://cryptoalarm.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth headers
api.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Enhanced API functions for alert management and testing
export const alertAPI = {
  // Test alert triggering
  testAlert: async (alertId: string, message?: string) => {
    const response = await api.post(`/alerts/${alertId}/test`, {
      alert_id: alertId,
      message: message
    });
    return response.data;
  },

  // Sync alerts with backend
  syncAlerts: async () => {
    const response = await api.post('/alerts/sync');
    return response.data;
  },

  // Get alert monitoring status
  getAlertStatus: async (alertId: string) => {
    const response = await api.get(`/alerts/${alertId}/status`);
    return response.data;
  },

  // Debug endpoint to check alert synchronization
  debugAlerts: async () => {
    const response = await api.get('/alerts/debug');
    return response.data;
  },

  // Check backend connectivity
  checkBackendHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Test notification methods
  testNotification: async (notificationData: {
    alert_id: string;
    notification_type: 'sms' | 'email' | 'voice' | 'push';
    destination: string;
    message: string;
  }) => {
    const response = await api.post('/test-notification', notificationData);
    return response.data;
  },

  // Get alert statistics
  getAlertStats: async () => {
    const response = await api.get('/alerts/stats');
    return response.data;
  },

  // Health check with detailed system status
  getHealthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get current crypto prices
  getPrices: async () => {
    const response = await api.get('/prices');
    return response.data;
  },

  // Simple test alert (legacy)
  testSimpleAlert: async () => {
    const response = await api.get('/test-alert');
    return response.data;
  }
};

// Utility functions for backend integration
export const backendUtils = {
  // Check if backend is connected
  checkBackendConnection: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Backend connection check failed:', error);
      return false;
    }
  },

  // Get backend status information
  getBackendStatus: async () => {
    try {
      const response = await api.get('/');
      return {
        connected: true,
        data: response.data
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Format alert for backend compatibility
  formatAlertForBackend: (alert: any) => {
    return {
      symbol: alert.symbol,
      alert_type: alert.alert_type === 'price' ? 'price_target' : 'percentage_change',
      direction: alert.condition_type?.includes('above') ? 'above' : 'below',
      target_value: parseFloat(alert.target_price || alert.percentage_change || '0'),
      message: alert.name || `${alert.symbol} Alert`
    };
  }
};

// Types for enhanced API responses
export interface AlertSyncResponse {
  synced_count: number;
  active_alerts: string[];
  message: string;
  timestamp: string;
}

export interface AlertStatusResponse {
  alert_id: string;
  is_active: boolean;
  is_monitored: boolean;
  last_checked?: string;
  trigger_count: number;
  status: 'active' | 'triggered' | 'paused' | 'deleted';
}

export interface HealthCheckResponse {
  api_status: string;
  database_connected: boolean;
  notification_service: boolean;
  active_symbols: number;
  alert_stats: {
    total_alerts: number;
    active_alerts: number;
    triggered_alerts: number;
    paused_alerts: number;
    last_sync?: string;
    database_connected: boolean;
  };
  timestamp: string;
}

export interface TestAlertResponse {
  message: string;
  alert_id: string;
  test_message: string;
  notification_results: Array<{
    type: string;
    destination: string;
    success: boolean;
    result?: string;
    error?: string;
    timestamp: string;
  }>;
  current_price: number;
}

export interface NotificationTestResponse {
  success: boolean;
  notification_type: string;
  destination: string;
  result?: string;
  error?: string;
  message: string;
}

// Export the main api instance and enhanced functionality
export default api;
export { API_BASE_URL };