import React from 'react';
import { PlusCircle, DollarSign, FileText } from 'lucide-react';
import { useTransactionForm } from '../utils/hooks/useTransactionForm';
import { useExpense } from '../context/ExpenseContext';
import AutocompleteInput from './AutocompleteInput';

export default function QuickAdd() {
  const { state } = useExpense();
  const {
    amount,
    setAmount,
    description,
    setDescription,
    type,
    setType,
    handleSubmit,
  } = useTransactionForm();

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white/90 mb-6">Quick Add Transaction</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all"
              step="0.01"
              required
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <AutocompleteInput
              value={description}
              onChange={setDescription}
              placeholder="Description"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 transition-all"
              categories={state.categories}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              type === 'expense'
                ? 'bg-red-500/20 text-red-300 ring-2 ring-red-500/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              type === 'income'
                ? 'bg-green-500/20 text-green-300 ring-2 ring-green-500/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Income
          </button>
        </div>
      </div>
      <button
        type="submit"
        className={`w-full py-3 rounded-xl flex items-center justify-center text-sm font-medium text-white transition-all ${
          type === 'expense' 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
        }`}
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </button>
    </form>
  );
}