import React from 'react';
import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useExpense } from '../../context/ExpenseContext';

export default function CategoryBreakdown() {
  const { state } = useExpense();

  // Get the 5 most recent transactions, sorted by date (newest first)
  const recentTransactions = [...state.transactions]
    .sort((a, b) => {
      // First compare by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateB !== dateA) {
        return dateB - dateA; // Sort by date in descending order
      }
      
      // If dates are equal, sort by ID in descending order
      // Assuming newer transactions have higher/later IDs
      return b.id.localeCompare(a.id);
    })
    .slice(0, 5);

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white/90">Recent Transactions</h3>
        <BarChart2 className="w-6 h-6 text-blue-400" />
      </div>
      
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {transaction.type === 'expense' ? (
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                )}
                <div>
                  <p className="text-white/90 font-medium">{transaction.description}</p>
                  <p className="text-white/60 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className={`text-lg font-semibold ${
                transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
              </p>
            </div>
          </div>
        ))}

        {recentTransactions.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No recent transactions to display
          </div>
        )}
      </div>
    </div>
  );
}