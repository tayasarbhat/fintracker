import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/currency';

interface Props {
  onClose: () => void;
}

export default function CreditDebitModal({ onClose }: Props) {
  const { state, dispatch } = useExpense();
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    description: '',
    type: 'credit',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const selectedAccount = state.creditDebitAccounts.find(acc => acc.id === formData.accountId);
    
    if (!selectedAccount) return;

    const transaction = {
      id: crypto.randomUUID(),
      accountId: formData.accountId,
      amount,
      type: formData.type as 'credit' | 'debit',
      date: formData.date,
      description: formData.description,
      status: 'pending',
    };

    // Add the credit/debit transaction
    dispatch({
      type: 'ADD_CREDIT_DEBIT_TRANSACTION',
      payload: {
        accountId: formData.accountId,
        transaction,
      },
    });

    // Add corresponding transaction to main ledger
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: crypto.randomUUID(),
        date: formData.date,
        description: `${formData.type === 'credit' ? 'Borrowed from' : 'Lent to'} ${selectedAccount.name} - ${formData.description}`,
        amount: formData.type === 'credit' ? amount : -amount,
        type: formData.type === 'credit' ? 'income' : 'expense',
        relatedAccountId: formData.accountId,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">New Credit/Debit Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Account
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select an account</option>
              {state.creditDebitAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} (Balance: {formatCurrency(account.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="credit"
                  checked={formData.type === 'credit'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Money Borrowed (Credit)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="debit"
                  checked={formData.type === 'debit'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Money Lent (Debit)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}