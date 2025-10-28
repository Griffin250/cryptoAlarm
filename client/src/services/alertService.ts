import { supabase } from '../lib/supabase';
import type { Alert, AlertStats, UserProfile, ApiResponse } from '../types';

// Alert Service - handles all CRUD operations for alerts
export class AlertService {

  // Check if Supabase is properly configured
  static isSupabaseConfigured(): boolean {
    return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  // Return demo error when Supabase is not configured
  static getDemoError(): ApiResponse {
    return { 
      error: 'Demo mode: Supabase not configured. Add environment variables for full functionality.',
      data: null 
    };
  }
  
  // Ensure user profile exists
  static async ensureUserProfile(user: any): Promise<UserProfile> {
    try {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', user.id);
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || user.email.split('@')[0],
            last_name: user.user_metadata?.last_name || '',
            avatar_url: user.user_metadata?.avatar_url || null
          }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        console.log('Profile created successfully:', newProfile);
        return newProfile;
      } else if (profileError) {
        throw profileError;
      }

      console.log('Profile exists:', profile);
      return profile;
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      throw new Error(`Profile setup failed: ${error.message}`);
    }
  }
  
  // Get all alerts for the current user
  static async getUserAlerts(): Promise<ApiResponse<Alert[]>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Ensure profile exists
      await this.ensureUserProfile(user);

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select(`
          *,
          alert_conditions (*),
          alert_notifications (*),
          alert_logs (
            id,
            triggered_at,
            trigger_price,
            trigger_conditions
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data: alerts || [], error: null };
    } catch (error: any) {
      console.error('Error fetching alerts:', error);
      return { data: null, error: error.message };
    }
  }

  // Create new alert
  static async createAlert(alertData: Partial<Alert>): Promise<ApiResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: alert, error } = await supabase
        .from('alerts')
        .insert([{
          ...alertData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: alert, error: null };
    } catch (error: any) {
      console.error('Error creating alert:', error);
      return { data: null, error: error.message };
    }
  }

  // Update alert
  static async updateAlert(alertId: string, updates: Partial<Alert>): Promise<ApiResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: alert, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', alertId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: alert, error: null };
    } catch (error: any) {
      console.error('Error updating alert:', error);
      return { data: null, error: error.message };
    }
  }

  // Delete alert
  static async deleteAlert(alertId: string): Promise<ApiResponse> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      return { data: true, error: null };
    } catch (error: any) {
      console.error('Error deleting alert:', error);
      return { data: null, error: error.message };
    }
  }

  // Toggle alert status
  static async toggleAlertStatus(alertId: string, isActive: boolean): Promise<ApiResponse<Alert>> {
    return this.updateAlert(alertId, { is_active: isActive });
  }

  // Get alert statistics
  static async getAlertStats(): Promise<ApiResponse<AlertStats>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('is_active, is_triggered')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      const stats: AlertStats = {
        total_alerts: alerts?.length || 0,
        active_alerts: alerts?.filter((a: any) => a.is_active).length || 0,
        triggered_alerts: alerts?.filter((a: any) => a.is_triggered).length || 0,
        success_rate: alerts?.length ? 
          (alerts.filter((a: any) => a.is_triggered).length / alerts.length) * 100 : 0
      };

      return { data: stats, error: null };
    } catch (error: any) {
      console.error('Error fetching alert stats:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user profile
  static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const profile = await this.ensureUserProfile(user);
      return { data: profile, error: null };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return { data: null, error: error.message };
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError();
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: profile, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }
  }

  // Subscribe to real-time alerts updates
  static subscribeToAlerts(callback: (payload: any) => void) {
    if (!this.isSupabaseConfigured()) {
      console.warn('Supabase not configured - real-time updates disabled');
      return null;
    }

    const channel = supabase
      .channel('alerts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  static unsubscribeFromAlerts(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

export default AlertService;