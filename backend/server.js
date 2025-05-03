const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const categoryRoutes = require('./routes/categories');
const expenseRoutes = require('./routes/expenses');
const AppError = require('./utils/AppError');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4djsm5g.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Handle undefined routes
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
