import { supabase, clearAuthData } from '../../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export class AuthService {
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async signOut() {
    try {
      // Clear local storage first
      localStorage.clear();
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // Force reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Error in signOut:', error);
      // Clear local data and reload even on error
      localStorage.clear();
      window.location.reload();
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearAuthData();
      }
      callback(session?.user ?? null);
    });
  }

  private static handleAuthError(error: unknown): Error {
    if (this.isAuthError(error)) {
      switch (error.name) {
        case 'AuthSessionMissingError':
          return new Error('Session expired. Please sign in again.');
        case 'AuthApiError':
          return new Error(error.message);
        default:
          return new Error('Please try signing in again.');
      }
    }
    return new Error('An error occurred while signing out. Please try again.');
  }

  private static isAuthError(error: unknown): error is AuthError {
    return (
      typeof error === 'object' &&
      error !== null &&
      '__isAuthError' in error &&
      error.__isAuthError === true
    );
  }
}