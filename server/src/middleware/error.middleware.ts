import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('API Error Stack:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errorType: 'ValidationError',
      message: 'Invalid workflow input parameters.',
      errors: err.errors,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    errorType: 'ServerError',
    message,
  });
};
