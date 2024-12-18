import { Category } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'income',
    name: 'Income',
    type: 'income',
    subcategories: [
      { id: 'salary', name: 'Salary' },
      { id: 'freelance', name: 'Freelance' },
      { id: 'investments', name: 'Investments' },
      { id: 'rental', name: 'Rental Income' },
      { id: 'business', name: 'Business Income' },
      { id: 'bonus', name: 'Bonus' },
      { id: 'commission', name: 'Commission' },
      { id: 'gifts', name: 'Gifts Received' },
      { id: 'tax-refund', name: 'Tax Refund' },
      { id: 'other-income', name: 'Other Income' }
    ],
  },
  {
    id: 'essentials',
    name: 'Essential Expenses',
    type: 'expense',
    subcategories: [
      { id: 'rent', name: 'Rent/Mortgage' },
      { id: 'utilities', name: 'Utilities' },
      { id: 'groceries', name: 'Groceries', items: ['Fruits', 'Vegetables', 'Meat', 'Dairy', 'Bread', 'Beverages'] },
      { id: 'transportation', name: 'Transportation', items: ['Gas', 'Public Transit', 'Car Maintenance', 'Parking'] },
      { id: 'insurance', name: 'Insurance', items: ['Health', 'Car', 'Home', 'Life'] },
      { id: 'healthcare', name: 'Healthcare', items: ['Doctor Visits', 'Medications', 'Dental', 'Vision'] },
      { id: 'phone', name: 'Phone & Internet' },
      { id: 'education', name: 'Education', items: ['Tuition', 'Books', 'Supplies', 'Courses'] },
      { id: 'childcare', name: 'Childcare' },
      { id: 'debt-payments', name: 'Debt Payments', items: ['Credit Card', 'Student Loans', 'Personal Loans'] }
    ],
  },
  {
    id: 'household',
    name: 'Household & Living',
    type: 'expense',
    subcategories: [
      { id: 'groceries-food', name: 'Food & Beverages', items: ['Snacks', 'Condiments', 'Canned Goods', 'Frozen Foods'] },
      { id: 'cleaning', name: 'Cleaning Supplies', items: ['Detergent', 'Cleaning Tools', 'Paper Products'] },
      { id: 'toiletries', name: 'Toiletries & Personal Care', items: ['Soap', 'Shampoo', 'Dental Care', 'Skincare'] },
      { id: 'kitchen', name: 'Kitchen & Dining', items: ['Utensils', 'Cookware', 'Small Appliances'] },
      { id: 'furniture', name: 'Furniture & Decor', items: ['Furniture', 'Lighting', 'Home Decor'] },
      { id: 'maintenance', name: 'Home Maintenance', items: ['Repairs', 'Tools', 'Services'] },
      { id: 'laundry', name: 'Laundry & Clothing Care', items: ['Detergent', 'Dry Cleaning', 'Repairs'] },
      { id: 'pets', name: 'Pet Supplies', items: ['Food', 'Supplies', 'Vet Care', 'Grooming'] },
      { id: 'garden', name: 'Garden & Outdoor', items: ['Plants', 'Tools', 'Furniture'] },
      { id: 'storage', name: 'Storage & Organization', items: ['Containers', 'Shelving', 'Storage Solutions'] }
    ],
  },
  {
    id: 'discretionary',
    name: 'Discretionary Spending',
    type: 'expense',
    subcategories: [
      { id: 'entertainment', name: 'Entertainment & Hobbies', items: ['Movies', 'Games', 'Sports', 'Music'] },
      { id: 'dining', name: 'Dining Out', items: ['Restaurants', 'Cafes', 'Fast Food', 'Delivery'] },
      { id: 'shopping', name: 'Shopping & Clothing', items: ['Clothes', 'Shoes', 'Accessories'] },
      { id: 'travel', name: 'Travel & Vacation', items: ['Flights', 'Hotels', 'Activities', 'Transportation'] },
      { id: 'gifts', name: 'Gifts & Donations', items: ['Birthday', 'Holiday', 'Charity'] },
      { id: 'fitness', name: 'Fitness & Sports', items: ['Gym', 'Equipment', 'Classes'] },
      { id: 'beauty', name: 'Beauty & Spa', items: ['Haircuts', 'Spa Services', 'Cosmetics'] },
      { id: 'electronics', name: 'Electronics & Gadgets', items: ['Devices', 'Accessories', 'Software'] },
      { id: 'subscriptions', name: 'Subscriptions & Media', items: ['Streaming', 'Magazines', 'Software'] },
      { id: 'misc', name: 'Miscellaneous', items: ['Other Expenses'] }
    ],
  }
];