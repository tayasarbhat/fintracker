import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface Props {
  income: number;
  expenses: number;
  balance: number;
}

export default function BalanceCard({ income, expenses, balance }: Props) {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white/90">Monthly Overview</h3>
        <Wallet className="w-6 h-6 text-blue-400" />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
          <div>
            <p className="text-sm font-medium text-green-400">Income</p>
            <p className="text-2xl font-bold text-green-300">
              +{formatCurrency(income)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
        <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
          <div>
            <p className="text-sm font-medium text-red-400">Expenses</p>
            <p className="text-2xl font-bold text-red-300">
              -{formatCurrency(expenses)}
            </p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-400" />
        </div>
        <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <div>
            <p className="text-sm font-medium text-blue-400">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
              {balance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(balance))}
            </p>
          </div>
          <Wallet className="w-8 h-8 text-blue-400" />
        </div>
      </div>
    </div>
  );
}