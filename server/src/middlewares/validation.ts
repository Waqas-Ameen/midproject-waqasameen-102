import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware to validate request body/query/params using Zod
 */
export function validateRequest(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce(
          (acc, err) => {
            const path = err.path.join('.');
            acc[path] = [err.message];
            return acc;
          },
          {} as Record<string, string[]>
        );

        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }
  };
}

/**
 * Query parameter validator
 */
export function validateQuery(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce(
          (acc, err) => {
            const path = err.path.join('.');
            acc[path] = [err.message];
            return acc;
          },
          {} as Record<string, string[]>
        );

        return res.status(400).json({
          success: false,
          message: 'Query validation error',
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
      });
    }
  };
}

/**
 * Global error handler
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}
