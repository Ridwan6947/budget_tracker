import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryForm = ({ onCategoryAdded, editingCategory, setEditingCategory }) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setBudget(editingCategory.estimatedExpense?.toString() || '');
    } else {
      setName('');
      setBudget('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await axios.put(
          `http://localhost:5005/api/categories/${editingCategory._id}`,
          {
            name,
            estimatedExpense: parseFloat(budget),
          }
        );
        onCategoryAdded(response.data);
      } else {
        const response = await axios.post('http://localhost:5005/api/categories', {
          name,
          estimatedExpense: parseFloat(budget),
        });
        onCategoryAdded(response.data);
      }
      setName('');
      setBudget('');
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="form-card">
      <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group amount-input">
          <label htmlFor="categoryBudget">Monthly Budget</label>
          <input
            type="number"
            id="categoryBudget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setName('');
              setBudget('');
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
