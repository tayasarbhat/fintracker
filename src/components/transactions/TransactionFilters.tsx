import React from 'react';
import { Filter } from 'lucide-react';
import { Category } from '../../types';

interface Props {
  dateRange: string;
  setDateRange: (range: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: Category[];
}

export default function TransactionFilters({
  dateRange,
  setDateRange,
  categoryFilter,
  setCategoryFilter,
  categories,
}: Props) {
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-black/60" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white/80 border border-black/10 text-black/90 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2.5"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/80 border border-black/10 text-black/90 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2.5"
        >
          <option value="" className="text-black">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id} className="text-black">
              {category.name} ({category.type})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}