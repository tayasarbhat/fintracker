import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { calculateMonthlyIncome, calculateMonthlyExpenses } from '../utils/calculations';
import BalanceCard from './dashboard/BalanceCard';
import CategoryBreakdown from './dashboard/CategoryBreakdown';
import CreditDebitCard from './dashboard/CreditDebitCard';
import GoalsManager from './goals/GoalsManager';
import TransactionList from './transactions/TransactionList';

export default function Dashboard() {
  const { state } = useExpense();

  const monthlyIncome = calculateMonthlyIncome(state.transactions);
  const monthlyExpenses = calculateMonthlyExpenses(state.transactions);
  const balance = monthlyIncome - monthlyExpenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BalanceCard
          income={monthlyIncome}
          expenses={monthlyExpenses}
          balance={balance}
        />
        <CategoryBreakdown />
        <CreditDebitCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsManager />
        <TransactionList />
      </div>
    </div>
  );
}