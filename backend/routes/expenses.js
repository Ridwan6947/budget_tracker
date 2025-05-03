const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

// Get all expenses
router.get('/', async (req, res, next) => {
  try {
    const expenses = await Expense.find().populate('category');
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

// Create a new expense
router.post('/', async (req, res, next) => {
  try {
    const { category, amount, description } = req.body;

    if (!category || !amount) {
      return next(new AppError('Category and amount are required', 400));
    }

    if (isNaN(amount) || amount <= 0) {
      return next(new AppError('Amount must be a positive value', 400));
    }

    const expense = new Expense({
      category,
      amount: parseFloat(amount),
      description
    });

    const newExpense = await expense.save();
    const populatedExpense = await Expense.findById(newExpense._id).populate('category');
    res.status(201).json(populatedExpense);
  } catch (err) {
    next(err);
  }
});

// Get expenses by month
router.get('/monthly/:year/:month', async (req, res, next) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return next(new AppError('Invalid year or month', 400));
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('category');

    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 