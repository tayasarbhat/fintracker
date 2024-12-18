import React, { useState } from 'react';
import { Target, Calendar, Trash2, Plus, ArrowUpRight } from 'lucide-react';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/currency';
import ContributionForm from './ContributionForm';

interface Props {
  goal: Goal;
  onDelete: (id: string) => void;
  onContribute: (goalId: string, amount: number, date: string) => void;
  onDeleteContribution: (goalId: string, contributionId: string) => void;
}

export default function GoalItem({
  goal,
  onDelete,
  onContribute,
  onDeleteContribution,
}: Props) {
  const [isContributing, setIsContributing] = useState(false);
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  // Sort contributions by date in descending order
  const sortedContributions = [...(goal.contributions || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleContribute = (amount: number, date: string) => {
    onContribute(goal.id, amount, date);
    setIsContributing(false);
  };
  
  return (
    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-white/90">{goal.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm text-white/90">
              Progress: {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
            </div>
            <div className="text-sm text-white/90">
              ({progress.toFixed(1)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsContributing(!isContributing)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors border border-blue-500/30 text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Contribution
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isContributing && (
        <ContributionForm
          onContribute={handleContribute}
          onCancel={() => setIsContributing(false)}
          goalName={goal.name}
        />
      )}

      {/* Recent Contributions Section */}
      <div className="space-y-3 mb-6">
        {sortedContributions.map((contribution) => (
          <div
            key={contribution.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white/90 font-medium">
                  {formatCurrency(contribution.amount)}
                </p>
                <p className="text-sm text-white/90">
                  {new Date(contribution.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDeleteContribution(goal.id, contribution.id)}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {goal.deadline && (
          <div className="flex items-center text-sm text-white/90">
            <Calendar className="w-4 h-4 mr-1.5" />
            Target date: {new Date(goal.deadline).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}