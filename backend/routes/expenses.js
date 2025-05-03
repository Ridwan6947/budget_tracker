const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().populate('category');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    category: req.body.category,
    amount: req.body.amount,
    description: req.body.description
  });

  try {
    const newExpense = await expense.save();
    const populatedExpense = await Expense.findById(newExpense._id).populate('category');
    res.status(201).json(populatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get expenses by month
router.get('/monthly/:year/:month', async (req, res) => {
  try {
    const startDate = new Date(req.params.year, req.params.month - 1, 1);
    const endDate = new Date(req.params.year, req.params.month, 0);

    const expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('category');

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 