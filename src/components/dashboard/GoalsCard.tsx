import React from 'react';
import { Target } from 'lucide-react';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface Props {
  goals: Goal[];
}

export default function GoalsCard({ goals }: Props) {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white/90">Financial Goals</h3>
        <Target className="w-6 h-6 text-blue-400" />
      </div>
      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/60">{goal.name}</span>
                <span className="text-2xl font-bold text-white/90">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {goal.deadline && (
                <div className="text-xs text-white/60 mt-2">
                  Due by: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}