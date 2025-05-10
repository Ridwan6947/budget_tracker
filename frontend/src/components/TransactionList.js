import React from 'react';
import axios from 'axios';

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  // Group expenses by date
  const expensesByDate = transactions.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(expensesByDate).sort((a, b) => new Date(b) - new Date(a));

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5005/api/expenses/${transactionId}`);
        onTransactionDeleted(transactionId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div className="transaction-list">
      <h2>Recent Transactions</h2>
      {sortedDates.map(date => (
        <div key={date} className="date-group">
          <h3 className="date-header">{date}</h3>
          <div className="transactions">
            {expensesByDate[date].map(transaction => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-header">
                    <span className="transaction-category">{transaction.category.name}</span>
                    <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(transaction._id)}
                  title="Delete transaction"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to generate consistent colors for categories
const getCategoryColor = (categoryName) => {
  const colors = {
    'Food': '#FF6384',
    'Transportation': '#36A2EB',
    'Entertainment': '#FFCE56',
    'Bills': '#4BC0C0',
    'Shopping': '#9966FF',
    'Other': '#FF9F40'
  };
  return colors[categoryName] || '#CCCCCC';
};

export default TransactionList; 