class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const normalizedErr =
    err instanceof Error
      ? err
      : new Error(typeof err === 'string' ? err : 'Server Error');

  console.log('Error handler called:', normalizedErr.message);
  console.log('Error stack:', normalizedErr.stack);

  let error = { ...normalizedErr };
  error.message = normalizedErr.message;

  if (err && typeof err === 'object' && 'statusCode' in err) {
    error.statusCode = err.statusCode;
  }

  // Log to console for dev
  console.log(normalizedErr.stack);

  // Mongoose bad ObjectId
  if (normalizedErr.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (normalizedErr.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (normalizedErr.name === 'ValidationError') {
    const message = Object.values(normalizedErr.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = { ErrorResponse, errorHandler };