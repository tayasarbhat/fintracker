import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Goal, Category, CreditDebitAccount } from '../types/baseTypes';
import { initialCategories } from '../data/initialData';

interface State {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  creditDebitAccounts: CreditDebitAccount[];
}

const initialState: State = {
  transactions: [],
  goals: [],
  categories: initialCategories,
  creditDebitAccounts: [],
};

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CONTRIBUTION'; payload: { goalId: string; contribution: { id: string; amount: number; date: string } } }
  | { type: 'DELETE_CONTRIBUTION'; payload: { goalId: string; contributionId: string } }
  | { type: 'ADD_CREDIT_DEBIT_ACCOUNT'; payload: CreditDebitAccount }
  | { type: 'UPDATE_CREDIT_DEBIT_ACCOUNT'; payload: CreditDebitAccount }
  | { type: 'DELETE_CREDIT_DEBIT_ACCOUNT'; payload: string }
  | { type: 'ADD_CREDIT_DEBIT_TRANSACTION'; payload: { accountId: string; transaction: any } };

function expenseReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: [
          ...state.goals.filter((g) => g.id !== action.payload.id),
          action.payload,
        ],
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };
    case 'ADD_CONTRIBUTION':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.goalId
            ? {
                ...goal,
                currentAmount: goal.currentAmount + action.payload.contribution.amount,
                contributions: [...(goal.contributions || []), action.payload.contribution],
              }
            : goal
        ),
      };
    case 'DELETE_CONTRIBUTION':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.goalId
            ? {
                ...goal,
                currentAmount:
                  goal.currentAmount -
                  (goal.contributions?.find((c) => c.id === action.payload.contributionId)
                    ?.amount || 0),
                contributions: goal.contributions?.filter(
                  (c) => c.id !== action.payload.contributionId
                ),
              }
            : goal
        ),
      };
    case 'ADD_CREDIT_DEBIT_ACCOUNT':
      return {
        ...state,
        creditDebitAccounts: [...state.creditDebitAccounts, action.payload],
      };
    case 'UPDATE_CREDIT_DEBIT_ACCOUNT':
      return {
        ...state,
        creditDebitAccounts: state.creditDebitAccounts.map((account) =>
          account.id === action.payload.id ? action.payload : account
        ),
      };
    case 'DELETE_CREDIT_DEBIT_ACCOUNT':
      return {
        ...state,
        creditDebitAccounts: state.creditDebitAccounts.filter(
          (account) => account.id !== action.payload
        ),
      };
    case 'ADD_CREDIT_DEBIT_TRANSACTION':
      return {
        ...state,
        creditDebitAccounts: state.creditDebitAccounts.map((account) =>
          account.id === action.payload.accountId
            ? {
                ...account,
                transactions: [...account.transactions, action.payload.transaction],
                totalCredit:
                  action.payload.transaction.type === 'credit'
                    ? account.totalCredit + action.payload.transaction.amount
                    : account.totalCredit,
                totalDebit:
                  action.payload.transaction.type === 'debit'
                    ? account.totalDebit + action.payload.transaction.amount
                    : account.totalDebit,
                balance:
                  action.payload.transaction.type === 'credit'
                    ? account.balance - action.payload.transaction.amount
                    : account.balance + action.payload.transaction.amount,
              }
            : account
        ),
      };
    default:
      return state;
  }
}

const ExpenseContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financeTrackerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'SET_TRANSACTIONS', payload: parsedData.transactions || [] });
      if (parsedData.creditDebitAccounts) {
        parsedData.creditDebitAccounts.forEach((account: CreditDebitAccount) => {
          dispatch({ type: 'ADD_CREDIT_DEBIT_ACCOUNT', payload: account });
        });
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('financeTrackerData', JSON.stringify({
      transactions: state.transactions,
      goals: state.goals,
      creditDebitAccounts: state.creditDebitAccounts,
    }));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
