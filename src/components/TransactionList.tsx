import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import TransactionFilters from './TransactionFilters';
import { filterTransactionsByDate, filterTransactionsByCategory, sortTransactionsByDate } from '../utils/filters';
import TransactionTable from './transactions/TransactionTable';

export default function TransactionList() {
  const { state, dispatch } = useExpense();
  const [dateRange, setDateRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('');

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const filteredTransactions = sortTransactionsByDate(
    filterTransactionsByCategory(
      filterTransactionsByDate(state.transactions, dateRange),
      categoryFilter
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <TransactionFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={state.categories}
        />
        <TransactionTable
          transactions={filteredTransactions}
          categories={state.categories}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
}