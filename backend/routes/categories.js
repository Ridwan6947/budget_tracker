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
    const { name, description } = req.body;
    
    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    const category = new Category({
      name,
      description
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 