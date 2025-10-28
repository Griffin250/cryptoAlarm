import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface SessionConfig {
  refreshMargin: number; // Minutes before expiry to refresh
  maxRetries: number;
  retryDelay: number; // Milliseconds
}

export class SessionManager {
  private static refreshTimer: number | null = null;
  private static refreshPromise: Promise<void> | null = null;
  private static retryCount = 0;
  
  private static config: SessionConfig = {
    refreshMargin: parseInt(import.meta.env.VITE_TOKEN_REFRESH_MARGIN) || 5,
    maxRetries: 3,
    retryDelay: 2000
  };

  /**
   * Initialize session monitoring and automatic refresh
   */
  static initialize(): void {
    this.setupSessionMonitoring();
    
    // Listen for auth state changes to reset monitoring
    supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        this.setupSessionMonitoring();
        this.retryCount = 0;
      } else if (event === 'SIGNED_OUT') {
        this.cleanup();
      }
    });

    // Listen for visibility change to refresh when user returns
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkAndRefreshSession();
      }
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.checkAndRefreshSession();
    });
  }

  /**
   * Setup automatic session monitoring
   */
  private static async setupSessionMonitoring(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        this.cleanup();
        return;
      }

      this.scheduleRefresh(session);
    } catch (error) {
      console.error('Error setting up session monitoring:', error);
    }
  }

  /**
   * Schedule the next token refresh
   */
  private static scheduleRefresh(session: Session): void {
    this.cleanup(); // Clear any existing timer

    const expiresAt = new Date(session.expires_at! * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const refreshTime = Math.max(
      timeUntilExpiry - (this.config.refreshMargin * 60 * 1000),
      30000 // Minimum 30 seconds
    );

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshSession();
      }, refreshTime);
      
      console.log(`Next token refresh scheduled in ${Math.round(refreshTime / 1000)}s`);
    } else {
      // Token is already expired or about to expire
      this.refreshSession();
    }
  }

  /**
   * Refresh the current session
   */
  private static async refreshSession(): Promise<void> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performRefresh();
    
    try {
      await this.refreshPromise;
      this.retryCount = 0; // Reset retry count on success
    } catch (error) {
      console.error('Session refresh failed:', error);
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual refresh operation
   */
  private static async _performRefresh(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      if (data.session) {
        console.log('Session refreshed successfully');
        this.scheduleRefresh(data.session);
        
        // Dispatch custom event for components that need to know about session refresh
        window.dispatchEvent(new CustomEvent('sessionRefreshed', { 
          detail: { session: data.session } 
        }));
      } else {
        throw new Error('No session returned from refresh');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        console.log(`Retrying session refresh (${this.retryCount}/${this.config.maxRetries})...`);
        
        setTimeout(() => {
          this.refreshSession();
        }, this.config.retryDelay * this.retryCount);
      } else {
        console.error('Max refresh retries exceeded. User may need to sign in again.');
        
        // Dispatch event to inform app that session could not be refreshed
        window.dispatchEvent(new CustomEvent('sessionExpired'));
        
        this.cleanup();
      }
    }
  }

  /**
   * Check current session and refresh if needed
   */
  static async checkAndRefreshSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return null;
      }

      if (!session) {
        return null;
      }

      // Check if session is close to expiry
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      const refreshThreshold = this.config.refreshMargin * 60 * 1000;

      if (timeUntilExpiry <= refreshThreshold) {
        console.log('Session is close to expiry, refreshing...');
        await this.refreshSession();
        
        // Get the refreshed session
        const { data: { session: newSession } } = await supabase.auth.getSession();
        return newSession;
      }

      return session;
    } catch (error) {
      console.error('Error checking/refreshing session:', error);
      return null;
    }
  }

  /**
   * Manually refresh the session (for user-triggered actions)
   */
  static async forceRefresh(): Promise<Session | null> {
    try {
      await this.refreshSession();
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Force refresh failed:', error);
      return null;
    }
  }

  /**
   * Check if the current session is valid
   */
  static async isSessionValid(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      
      return expiresAt > now;
    } catch {
      return false;
    }
  }

  /**
   * Get time until session expires (in milliseconds)
   */
  static async getTimeUntilExpiry(): Promise<number | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return null;
      }

      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      
      return Math.max(0, expiresAt.getTime() - now.getTime());
    } catch {
      return null;
    }
  }

  /**
   * Cleanup timers and listeners
   */
  private static cleanup(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Destroy session manager (call on app unmount)
   */
  static destroy(): void {
    this.cleanup();
    document.removeEventListener('visibilitychange', this.checkAndRefreshSession);
    window.removeEventListener('online', this.checkAndRefreshSession);
  }
}

export default SessionManager;