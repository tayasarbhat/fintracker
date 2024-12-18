import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/database';
import { Transaction, CreditDebitAccount } from '../types/baseTypes';

export function useSupabase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<CreditDebitAccount[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [transactionsData, accountsData] = await Promise.all([
          DatabaseService.getTransactions(user.id),
          DatabaseService.getAccounts(user.id),
        ]);

        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions
    const transactionSubscription = DatabaseService.subscribeToTransactions(
      user.id,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setTransactions((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id));
        }
      }
    );

    const accountSubscription = DatabaseService.subscribeToAccounts(
      user.id,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setAccounts((prev) => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setAccounts((prev) =>
            prev.map((a) => (a.id === payload.new.id ? payload.new : a))
          );
        } else if (payload.eventType === 'DELETE') {
          setAccounts((prev) => prev.filter((a) => a.id !== payload.old.id));
        }
      }
    );

    return () => {
      transactionSubscription.unsubscribe();
      accountSubscription.unsubscribe();
    };
  }, [user]);

  return {
    loading,
    transactions,
    accounts,
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
      if (!user) return;
      return DatabaseService.addTransaction(user.id, transaction);
    },
    deleteTransaction: async (transactionId: string) => {
      if (!user) return;
      return DatabaseService.deleteTransaction(user.id, transactionId);
    },
    addAccount: async (account: Omit<CreditDebitAccount, 'id'>) => {
      if (!user) return;
      return DatabaseService.addAccount(user.id, account);
    },
    updateAccount: async (accountId: string, updates: Partial<CreditDebitAccount>) => {
      if (!user) return;
      return DatabaseService.updateAccount(user.id, accountId, updates);
    },
    deleteAccount: async (accountId: string) => {
      if (!user) return;
      return DatabaseService.deleteAccount(user.id, accountId);
    },
    addCreditDebitTransaction: async (accountId: string, transaction: any) => {
      if (!user) return;
      return DatabaseService.addCreditDebitTransaction(user.id, accountId, transaction);
    },
  };
}