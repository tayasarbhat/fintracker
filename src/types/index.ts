import { Transaction, Goal, Category, Subcategory } from './baseTypes';

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
}

export type { Transaction, Goal, Category, Subcategory };