import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface Props {
  onContribute: (amount: number, date: string) => void;
  onCancel: () => void;
  goalName: string;
}

export default function ContributionForm({ onContribute, onCancel, goalName }: Props) {
  const [amount, setAmount] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contributionAmount = parseFloat(amount);
    if (contributionAmount > 0) {
      onContribute(contributionAmount, date);
      setAmount('');
      setDate(today);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
      <div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter contribution amount for ${goalName}`}
          step="0.01"
          min="0"
          required
          className="w-full"
        />
      </div>
      
      <div>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          required
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={Plus}
          className="flex-1"
        >
          Add Contribution
        </Button>
      </div>
    </form>
  );
}