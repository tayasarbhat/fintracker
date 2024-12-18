import React from 'react';
import { Calendar } from 'lucide-react';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/currency';
import GoalProgress from './GoalProgress';

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white/90">{goal.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-2xl font-bold text-white/90">
            {formatCurrency(goal.currentAmount)}
          </div>
          <div className="text-sm text-white/60">
            of {formatCurrency(goal.targetAmount)}
          </div>
        </div>
      </div>

      <GoalProgress 
        currentAmount={goal.currentAmount} 
        targetAmount={goal.targetAmount} 
      />

      {goal.deadline && (
        <div className="flex items-center gap-2 mt-4 text-sm text-white/60">
          <Calendar className="w-4 h-4" />
          <span>Due by {new Date(goal.deadline).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}