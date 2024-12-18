import { supabase } from './supabase/client';
import type { Transaction } from '../../types/baseTypes';
import type { ApiError } from '../../types/api';

export class TransactionService {
  static async fetchTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw this.handleError(error);
      return data || [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async createTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: userId }])
        .select()
        .single();

      if (error) throw this.handleError(error);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId);

      if (error) throw this.handleError(error);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): ApiError {
    console.error('Transaction service error:', error);
    return {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      code: 'TRANSACTION_ERROR'
    };
  }
}