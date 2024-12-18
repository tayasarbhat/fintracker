import React, { useState } from 'react';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/currency';
import ContributionForm from './ContributionForm';
import ContributionHistory from './ContributionHistory';
import GoalProgress from './GoalProgress';
import Button from '../common/Button';
import type { Goal } from '../../types/baseTypes';

interface Props {
  goal: Goal;
}

export default function GoalList({ goal }: Props) {
  const { state, dispatch } = useExpense();
  const [isContributing, setIsContributing] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleContribute = (amount: number, date: string) => {
    dispatch({
      type: 'ADD_CONTRIBUTION',
      payload: {
        goalId: goal.id,
        contribution: {
          id: crypto.randomUUID(),
          amount,
          date,
        },
      },
    });
    setIsContributing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch({ type: 'DELETE_GOAL', payload: goal.id });
    }
  };

  const handleDeleteContribution = (contributionId: string) => {
    dispatch({
      type: 'DELETE_CONTRIBUTION',
      payload: { goalId: goal.id, contributionId },
    });
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
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsContributing(!isContributing)}
          >
            Add Contribution
          </Button>
          <button
            onClick={handleDelete}
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

      <ContributionHistory
        contributions={goal.contributions || []}
        onDeleteContribution={handleDeleteContribution}
      />

      <div className="space-y-4">
        <GoalProgress
          currentAmount={goal.currentAmount}
          targetAmount={goal.targetAmount}
        />

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