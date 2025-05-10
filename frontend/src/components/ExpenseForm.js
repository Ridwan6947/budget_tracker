import React, { useState } from 'react';
import axios from 'axios';

const ExpenseForm = ({ categories, onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5005/api/expenses', {
        amount: parseFloat(amount),
        description,
        category,
        date: date || new Date().toISOString().split('T')[0]
      });
      onExpenseAdded(response.data);
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="form-card">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group amount-input">
            <label htmlFor="expenseAmount">Amount</label>
            <input
              type="number"
              id="expenseAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expenseDate">Date</label>
            <input
              type="date"
              id="expenseDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="expenseCategory">Category</label>
          <select
            id="expenseCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="expenseDescription">Description</label>
          <textarea
            id="expenseDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense description..."
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm; 