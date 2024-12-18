import { useState } from 'react';
import { Transaction } from '../../types';
import { filterTransactionsByDate, filterTransactionsByCategory, sortTransactionsByDate } from '../filters';

export function useTransactionFilters(transactions: Transaction[]) {
  const [dateRange, setDateRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredTransactions = sortTransactionsByDate(
    filterTransactionsByCategory(
      filterTransactionsByDate(transactions, dateRange),
      categoryFilter
    )
  );

  return {
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions,
  };
}