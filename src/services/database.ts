import { supabase } from '../lib/supabase';
import { Transaction, CreditDebitAccount, Goal } from '../types/baseTypes';

export const DatabaseService = {
  // Transactions
  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTransaction(userId: string, transactionId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Credit/Debit Accounts
  async getAccounts(userId: string) {
    const { data, error } = await supabase
      .from('credit_debit_accounts')
      .select(`
        *,
        transactions:credit_debit_transactions(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async addAccount(userId: string, account: Omit<CreditDebitAccount, 'id'>) {
    const { data, error } = await supabase
      .from('credit_debit_accounts')
      .insert([{ ...account, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAccount(userId: string, accountId: string, updates: Partial<CreditDebitAccount>) {
    const { data, error } = await supabase
      .from('credit_debit_accounts')
      .update(updates)
      .eq('id', accountId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAccount(userId: string, accountId: string) {
    // First delete all related transactions
    await supabase
      .from('credit_debit_transactions')
      .delete()
      .eq('account_id', accountId);

    // Then delete the account
    const { error } = await supabase
      .from('credit_debit_accounts')
      .delete()
      .eq('id', accountId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Credit/Debit Transactions
  async addCreditDebitTransaction(
    userId: string,
    accountId: string,
    transaction: any
  ) {
    const { data, error } = await supabase
      .from('credit_debit_transactions')
      .insert([{ ...transaction, account_id: accountId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Real-time subscriptions
  subscribeToTransactions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToAccounts(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('accounts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credit_debit_accounts',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
};