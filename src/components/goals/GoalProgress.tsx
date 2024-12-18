import React from 'react';
import { formatCurrency } from '../../utils/currency';

interface Props {
  currentAmount: number;
  targetAmount: number;
}

export default function GoalProgress({ currentAmount, targetAmount }: Props) {
  const progress = (currentAmount / targetAmount) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">Progress</span>
        <span className="text-white/90">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-white/80">
        <span>{formatCurrency(currentAmount)}</span>
        <span>{formatCurrency(targetAmount)}</span>
      </div>
    </div>
  );
}