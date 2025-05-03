const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// Create a new category
router.post('/', async (req, res, next) => {
  try {
    const { name, estimatedExpense } = req.body;
    
    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    const category = new Category({
      name,
      estimatedExpense: estimatedExpense || 0
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

// Update a category
router.put('/:id', async (req, res, next) => {
  try {
    const { name, estimatedExpense } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    category.name = name || category.name;
    category.estimatedExpense = estimatedExpense !== undefined ? estimatedExpense : category.estimatedExpense;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    next(err);
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 