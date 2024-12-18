import { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';

export function useTransactionForm() {
  const { dispatch } = useExpense();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      await dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: crypto.randomUUID(),
          date: new Date().toISOString().split('T')[0],
          description,
          amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
          type,
        },
      });
      
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting transaction:', error);
      // You might want to show an error message to the user here
    }
  };

  return {
    amount,
    setAmount,
    description,
    setDescription,
    type,
    setType,
    handleSubmit,
  };
}