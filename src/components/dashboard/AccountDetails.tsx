import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, X, Edit2, Trash2 } from 'lucide-react';
import { CreditDebitAccount } from '../../types/baseTypes';
import { formatCurrency } from '../../utils/currency';
import { useExpense } from '../../context/ExpenseContext';
import EditAccountModal from './EditAccountModal';

interface Props {
  account: CreditDebitAccount;
  onClose: () => void;
}

export default function AccountDetails({ account, onClose }: Props) {
  const { dispatch } = useExpense();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sortedTransactions = [...account.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_CREDIT_DEBIT_ACCOUNT', payload: account.id });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{account.name}</h3>
            {account.phoneNumber && (
              <p className="text-gray-500 text-sm">{account.phoneNumber}</p>
            )}
            {account.email && (
              <p className="text-gray-500 text-sm">{account.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Account"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteAccount}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Account"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm font-medium text-red-600">Total Credit</p>
            <p className="text-2xl font-bold text-red-700">
              {formatCurrency(account.totalCredit)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-sm font-medium text-green-600">Total Debit</p>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(account.totalDebit)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Transaction History</h4>
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {transaction.type === 'credit' ? (
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-semibold ${
                  transaction.type === 'credit' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}

          {sortedTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <EditAccountModal
          account={account}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}