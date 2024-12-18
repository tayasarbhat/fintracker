// Site URL based on environment
export const SITE_URL = import.meta.env.MODE === 'production' 
  ? 'https://tayasarbhat.github.io/fintracker'
  : 'http://localhost:5173/fintracker';

export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'mobile', label: 'Mobile Payment' },
];
