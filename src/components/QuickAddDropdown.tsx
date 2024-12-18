import React, { useState, useRef, useEffect } from 'react';
import { Plus, UserPlus, CreditCard } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import AutocompleteInput from './AutocompleteInput';
import AccountModal from './dashboard/AccountModal';
import CreditDebitModal from './dashboard/CreditDebitModal';

export default function QuickAddDropdown() {
  const { state, dispatch } = useExpense();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCreditDebitModalOpen, setIsCreditDebitModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    dispatch({
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
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors border border-purple-500/30"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Add Account
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-colors border border-blue-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          Quick Add
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-50">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white/90">Quick Add</h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCreditDebitModalOpen(true);
                  }}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center text-white/90"
                >
                  <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                  <span>Add Credit/Debit Entry</span>
                </button>

                <div className="w-full h-px bg-white/10 my-2" />

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <AutocompleteInput
                      value={description}
                      onChange={setDescription}
                      placeholder="Description"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      categories={state.categories}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        type === 'expense'
                          ? 'bg-red-500/20 text-red-300 ring-2 ring-red-500/50'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        type === 'income'
                          ? 'bg-green-500/20 text-green-300 ring-2 ring-green-500/50'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Income
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      type === 'expense'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {type === 'expense' ? 'Expense' : 'Income'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAccountModalOpen && (
        <AccountModal onClose={() => setIsAccountModalOpen(false)} />
      )}

      {isCreditDebitModalOpen && (
        <CreditDebitModal onClose={() => setIsCreditDebitModalOpen(false)} />
      )}
    </div>
  );
}