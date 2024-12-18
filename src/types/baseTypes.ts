export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId?: string;
  subcategoryId?: string;
  paymentMethod?: string;
  notes?: string;
  relatedAccountId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  contributions: Contribution[];
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  items?: string[];
}

export interface CreditDebitAccount {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  totalCredit: number;
  totalDebit: number;
  balance: number;
  transactions: CreditDebitTransaction[];
}

export interface CreditDebitTransaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  description: string;
  status: 'pending' | 'settled';
  settledDate?: string;
}