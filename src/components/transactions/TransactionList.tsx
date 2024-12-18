import React from 'react';
import { FileText } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { useTransactionFilters } from '../../utils/hooks/useTransactionFilters';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import Button from '../common/Button';

export default function TransactionList() {
  const { state, dispatch } = useExpense();
  const {
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions,
  } = useTransactionFilters(state.transactions);

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" /> Recent Transactions
        </h3>
      </div>
      <TransactionFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={state.categories}
      />
      <TransactionTable
        transactions={filteredTransactions}
        onDelete={deleteTransaction}
      />
    </div>
  );
}