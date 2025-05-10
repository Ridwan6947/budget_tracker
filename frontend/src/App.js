import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryForm from './components/CategoryForm';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
import BudgetAllocationChart from './components/BudgetAllocationChart';
import TransactionList from './components/TransactionList';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleCategoryAdded = (updatedCategory) => {
    setCategories(prevCategories => {
      const index = prevCategories.findIndex(cat => cat._id === updatedCategory._id);
      if (index !== -1) {
        const newCategories = [...prevCategories];
        newCategories[index] = updatedCategory;
        return newCategories;
      }
      return [...prevCategories, updatedCategory];
    });
    setEditingCategory(null);
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleCategoryDeleted = (categoryId) => {
    setCategories(categories.filter(cat => cat._id !== categoryId));
    // Also remove expenses associated with this category
    setExpenses(expenses.filter(exp => exp.category._id !== categoryId));
  };

  const handleTransactionDeleted = (transactionId) => {
    setExpenses(expenses.filter(exp => exp._id !== transactionId));
  };

  return (
    <div className="App">
      <header>
        <h1>Monthly Budget Tracker</h1>
      </header>
      <main>
        <div className="forms-container">
          <CategoryForm 
            onCategoryAdded={handleCategoryAdded} 
            editingCategory={editingCategory}
            setEditingCategory={setEditingCategory}
          />
          <ExpenseForm 
            categories={categories} 
            onExpenseAdded={handleExpenseAdded} 
          />
        </div>
        <div className="categories-list">
          <h2>Categories</h2>
          <ul>
            {categories.map(category => (
              <li key={category._id}>
                <span>{category.name} - {category.estimatedExpense}</span>
                <button onClick={() => handleEditCategory(category)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <div className="transactions-section">
            <TransactionList 
              transactions={expenses} 
              onTransactionDeleted={handleTransactionDeleted} 
            />
          </div>
          <div className="charts-section">
            <div className="chart">
              <BudgetAllocationChart categories={categories} />
            </div>
            <div className="chart">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
