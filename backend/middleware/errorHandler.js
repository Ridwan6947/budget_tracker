const AppError = require('../utils/AppError');

// Handle invalid MongoDB ID error (like when ID is malformed)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400); // Send 400 Bad Request
};

// Handle duplicate key error (e.g., duplicate email, username, etc.)
const handleDuplicateFieldsDB = (err) => {
  // Extract value that caused duplication from error message
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle Mongoose validation errors (like required fields, minLength, etc.)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Error response during development (sends full stack trace)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,               // Full error object
    message: err.message,     // Custom or default message
    stack: err.stack,         // Stack trace for debugging
  });
};

// Error response in production (no stack trace)
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Known and safe error (e.g. AppError)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown or programming error — don't leak details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// Main global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // If in development, show detailed errors
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

  // If in production, handle specific error types and sanitize output
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };         // Shallow copy
    error.message = err.message;   // Preserve message manually (important!)

    // Handle known MongoDB/Mongoose error types
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
