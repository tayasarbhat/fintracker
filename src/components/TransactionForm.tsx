import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Transaction } from '../types';

export default function TransactionForm() {
  const { state, dispatch } = useExpense();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    payee: '',
    amount: '',
    categoryId: '',
    subcategoryId: '',
    paymentMethod: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    item: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = state.categories.find(c => c.id === formData.categoryId);
    const amount = parseFloat(formData.amount);
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ...formData,
      amount: category?.type === 'expense' ? -amount : amount,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      payee: '',
      amount: '',
      categoryId: '',
      subcategoryId: '',
      paymentMethod: '',
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly',
      item: '',
    });
  };

  const selectedCategory = state.categories.find(c => c.id === formData.categoryId);
  const selectedSubcategory = selectedCategory?.subcategories.find(s => s.id === formData.subcategoryId);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            step="0.01"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => {
              setFormData({
                ...formData,
                categoryId: e.target.value,
                subcategoryId: '',
                item: '',
              });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {state.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.type})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subcategory</label>
          <select
            value={formData.subcategoryId}
            onChange={(e) => {
              setFormData({
                ...formData,
                subcategoryId: e.target.value,
                item: '',
              });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={!formData.categoryId}
          >
            <option value="">Select Subcategory</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        {selectedSubcategory?.items && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <select
              value={formData.item || ''}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Item</option>
              {selectedSubcategory.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payee</label>
          <input
            type="text"
            value={formData.payee}
            onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Enter payee name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Transaction
      </button>
    </form>
  );
}