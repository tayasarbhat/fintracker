import { Transaction } from '../types';

export const filterTransactionsByDate = (transactions: Transaction[], dateRange: string) => {
  const now = new Date();
  
  switch (dateRange) {
    case 'today':
      return transactions.filter(
        (t) => new Date(t.date).toDateString() === now.toDateString()
      );
    case 'week':
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return transactions.filter((t) => new Date(t.date) >= weekAgo);
    case 'month':
      return transactions.filter(
        (t) =>
          new Date(t.date).getMonth() === now.getMonth() &&
          new Date(t.date).getFullYear() === now.getFullYear()
      );
    case 'year':
      return transactions.filter(
        (t) => new Date(t.date).getFullYear() === now.getFullYear()
      );
    default:
      return transactions;
  }
};

export const filterTransactionsByCategory = (transactions: Transaction[], categoryId: string) => {
  return categoryId ? transactions.filter((t) => t.categoryId === categoryId) : transactions;
};

export const sortTransactionsByDate = (transactions: Transaction[]) => {
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};