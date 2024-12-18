import { Transaction } from '../types';

export const calculateMonthlyIncome = (transactions: Transaction[]) => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const calculateMonthlyExpenses = (transactions: Transaction[]) => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const calculateTotalsByCategory = (transactions: Transaction[]) => {
  return transactions.reduce((acc: Record<string, number>, transaction) => {
    const category = transaction.type;
    const amount = Math.abs(transaction.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
};