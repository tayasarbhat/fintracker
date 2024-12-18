import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { Contribution } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface Props {
  contributions: Contribution[];
  onDeleteContribution: (contributionId: string) => void;
}

export default function ContributionHistory({ contributions, onDeleteContribution }: Props) {
  if (contributions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h5 className="text-sm font-medium text-white/80 mb-2">Contribution History</h5>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {contributions.map((contribution) => (
          <div
            key={contribution.id}
            className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm border border-white/10"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4 text-white/60" />
              <span>{new Date(contribution.date).toLocaleDateString()}</span>
              <span className="font-medium">{formatCurrency(contribution.amount)}</span>
            </div>
            <button
              onClick={() => onDeleteContribution(contribution.id)}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}