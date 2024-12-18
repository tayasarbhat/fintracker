import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import GoalList from './GoalList';
import GoalModal from './GoalModal';
import Button from '../common/Button';

export default function GoalsManager() {
  const { state } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" /> Financial Goals
        </h3>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add Goal
        </Button>
      </div>
      
      <div className="space-y-4">
        {state.goals.map((goal) => (
          <GoalList key={goal.id} goal={goal} />
        ))}

        {state.goals.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No financial goals yet. Add a goal to get started!
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <GoalModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}