import React from 'react';
import { Filter } from 'lucide-react';
import { Category } from '../types';

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
  categories = [], // Provide default empty array
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.type})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}