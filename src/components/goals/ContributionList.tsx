import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import type { Contribution } from '../../types/baseTypes';

interface Props {
  contributions: Contribution[];
  onDelete: (contributionId: string) => void;
}

export default function ContributionList({ contributions, onDelete }: Props) {
  if (!contributions?.length) return null;

  const sortedContributions = [...contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mt-4 space-y-2">
      <h5 className="text-sm font-medium text-white/80">Recent Contributions</h5>
      {sortedContributions.map((contribution) => (
        <div
          key={contribution.id}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">
              {new Date(contribution.date).toLocaleDateString()}
            </span>
            <span className="text-sm font-medium text-white/90">
              {formatCurrency(contribution.amount)}
            </span>
          </div>
          <button
            onClick={() => onDelete(contribution.id)}
            className="text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}