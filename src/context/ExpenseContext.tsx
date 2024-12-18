import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Transaction, Goal, Category, CreditDebitAccount } from '../types/baseTypes';
import { initialCategories } from '../data/initialData';
import { useTransactions } from '../hooks/useTransactions';

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
    default:
      return state;
  }
}

const ExpenseContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Initialize state from localStorage
  const initialStateWithPersistedData = React.useMemo(() => {
    if (!user) return initialState;
    
    try {
      const savedGoals = localStorage.getItem(`goals_${user.id}`);
      return {
        ...initialState,
        goals: savedGoals ? JSON.parse(savedGoals) : [],
      };
    } catch (error) {
      console.error('Error loading persisted data:', error);
      return initialState;
    }
  }, [user]);

  // Update state with persisted data when available
  useEffect(() => {
    if (user) {
      dispatch({ 
        type: 'SET_TRANSACTIONS', 
        payload: initialStateWithPersistedData.transactions 
      });
    }
  }, [initialStateWithPersistedData, user]);

  // Save goals to localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`goals_${user.id}`, JSON.stringify(state.goals));
      } catch (error) {
        console.error('Error saving goals:', error);
      }
    }
  }, [state.goals, user]);

  // Sync transactions from Supabase
  useEffect(() => {
    if (!loading && user) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    }
  }, [transactions, loading, user]);

  // Wrap the dispatch to handle Supabase operations
  const wrappedDispatch = async (action: Action) => {
    if (!user) return;

    switch (action.type) {
      case 'ADD_TRANSACTION':
        try {
          const newTransaction = await addTransaction(action.payload);
          if (newTransaction) {
            dispatch(action);
          }
        } catch (error) {
          console.error('Error adding transaction:', error);
          throw error;
        }
        break;
      case 'DELETE_TRANSACTION':
        try {
          await deleteTransaction(action.payload);
          dispatch(action);
        } catch (error) {
          console.error('Error deleting transaction:', error);
          throw error;
        }
        break;
      default:
        dispatch(action);
    }
  };

  return (
    <ExpenseContext.Provider value={{ state, dispatch: wrappedDispatch }}>
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