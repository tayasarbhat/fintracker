import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        No transactions found. Add some transactions to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {transaction.type === 'expense' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-400 mr-2" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-2" />
                  )}
                  <span className="text-sm font-medium text-white/90">
                    {transaction.description}
                  </span>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}