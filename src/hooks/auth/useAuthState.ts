import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth/authService';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await AuthService.getSession();
      setUser(session?.user ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initAuth]);

  const signOut = async () => {
    try {
      setError(null);
      await AuthService.signOut();
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign out');
      setError(error);
      throw error;
    }
  };

  const refreshSession = async () => {
    await initAuth();
  };

  return { 
    user, 
    loading, 
    error, 
    signOut,
    refreshSession 
  };
}