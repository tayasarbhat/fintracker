import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { clearAuthData } from '../lib/supabase';
import type { Transaction } from '../types';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user) return;

    let isSubscribed = true;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select()
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      if (isSubscribed) {
        setTransactions(data || []);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to load transactions'));
      if (err.message?.includes('JWT')) {
        clearAuthData();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }

    return () => { isSubscribed = false; };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return () => {};
    }

    const cleanup = loadTransactions();

    // Set up real-time subscription
    const channel = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [payload.new as Transaction, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      channel.unsubscribe();
    };
  }, [user, loadTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refresh: loadTransactions,
  };
}