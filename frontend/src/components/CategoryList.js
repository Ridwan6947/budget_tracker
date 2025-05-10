import React from 'react';
import axios from 'axios';

const CategoryList = ({ categories, onCategoryDeleted }) => {
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all expenses in this category.')) {
      try {
        // Delete category from backend
        await axios.delete(`http://localhost:5005/api/categories/${categoryId}`);
        
        // Call the onCategoryDeleted function passed from the parent to update the UI
        onCategoryDeleted(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="category-list">
      <h2>Categories</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category._id} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <button 
                className="delete-button"
                onClick={() => handleDelete(category._id)}
                title="Delete category"
              >
                Delete
              </button>
            </div>
            <div className="category-budget">
              Budget: ${category.budget.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

