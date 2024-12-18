import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/api/supabase/client';
import { TransactionService } from '../../services/api/transactions';
import type { Transaction } from '../../types/baseTypes';
import type { ApiError } from '../../types/api';

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: ApiError | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.fetchTransactions(user.id);
      setTransactions(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    loadTransactions();

    const subscription = supabase
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
            setTransactions((prev) => 
              prev.filter((t) => t.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      setError(null);
      await TransactionService.createTransaction(user.id, transaction);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      await TransactionService.deleteTransaction(user.id, id);
    } catch (err) {
      setError(err as ApiError);
      throw err;
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