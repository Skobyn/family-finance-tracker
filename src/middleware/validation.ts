/**
 * Input Validation Middleware and Utilities
 *
 * Provides comprehensive input validation utilities for API routes to prevent
 * injection attacks, data corruption, and ensure data integrity.
 *
 * @module middleware/validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema, ZodError } from 'zod';

/**
 * Sanitizes a string by removing potentially dangerous characters
 * Helps prevent XSS and injection attacks
 *
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/['"]/g, '') // Remove quotes to prevent SQL injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validates an email address format
 *
 * @param email - The email to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a UUID format
 *
 * @param uuid - The UUID to validate
 * @returns true if valid UUID v4, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates a date string
 *
 * @param dateString - The date string to validate
 * @returns true if valid date, false otherwise
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates that a number is within a specified range
 *
 * @param value - The number to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if within range, false otherwise
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

/**
 * Validates and sanitizes pagination parameters
 *
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Validated and constrained pagination parameters
 */
export function validatePagination(
  page: number | string | undefined,
  limit: number | string | undefined
): { page: number; limit: number; offset: number } {
  const pageNum = Math.max(1, parseInt(String(page || '1'), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || '10'), 10) || 10));
  const offset = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, offset };
}

/**
 * Common Zod schemas for reuse across the application
 */
export const commonSchemas = {
  /**
   * Email validation schema
   */
  email: z.string().email('Invalid email format').min(1, 'Email is required'),

  /**
   * UUID validation schema
   */
  uuid: z.string().uuid('Invalid UUID format'),

  /**
   * Date string validation schema
   */
  dateString: z.string().refine(isValidDate, 'Invalid date format'),

  /**
   * Positive number validation schema
   */
  positiveNumber: z.number().positive('Must be a positive number'),

  /**
   * Non-negative number validation schema (includes 0)
   */
  nonNegativeNumber: z.number().min(0, 'Must be non-negative'),

  /**
   * Currency amount validation schema (up to 2 decimal places)
   */
  currencyAmount: z.number().refine(
    (val) => {
      const str = val.toString();
      const decimalIndex = str.indexOf('.');
      if (decimalIndex === -1) return true;
      return str.length - decimalIndex - 1 <= 2;
    },
    'Amount must have at most 2 decimal places'
  ),

  /**
   * Pagination parameters schema
   */
  pagination: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
  }),

  /**
   * Safe string schema (non-empty, trimmed, max length)
   */
  safeString: (maxLength: number = 255) =>
    z.string().trim().min(1, 'Required').max(maxLength, `Must be ${maxLength} characters or less`),
};

/**
 * Creates a validation middleware that validates request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Validation middleware function
 *
 * @example
 * ```typescript
 * import { createValidator, commonSchemas } from '@/middleware/validation';
 * import { z } from 'zod';
 *
 * const schema = z.object({
 *   email: commonSchemas.email,
 *   amount: commonSchemas.currencyAmount,
 * });
 *
 * const validator = createValidator(schema);
 *
 * export async function POST(req: NextRequest) {
 *   const validationResult = await validator(req);
 *   if (validationResult.error) {
 *     return validationResult.response;
 *   }
 *
 *   const data = validationResult.data;
 *   // Use validated data
 * }
 * ```
 */
export function createValidator<T>(schema: ZodSchema<T>) {
  return async function validate(req: NextRequest): Promise<
    | { error: true; response: NextResponse; data?: never }
    | { error: false; data: T; response?: never }
  > {
    try {
      // Parse request body
      let body: unknown;
      try {
        body = await req.json();
      } catch (error) {
        return {
          error: true,
          response: NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          ),
        };
      }

      // Validate against schema
      const validatedData = schema.parse(body);

      return {
        error: false,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable structure
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return {
          error: true,
          response: NextResponse.json(
            {
              error: 'Validation failed',
              details: formattedErrors,
            },
            { status: 400 }
          ),
        };
      }

      // Unexpected error
      return {
        error: true,
        response: NextResponse.json(
          { error: 'Internal validation error' },
          { status: 500 }
        ),
      };
    }
  };
}

/**
 * Validates query parameters from the URL
 *
 * @param req - The incoming request
 * @param schema - Zod schema to validate query parameters against
 * @returns Validation result with data or error response
 *
 * @example
 * ```typescript
 * import { validateQueryParams, commonSchemas } from '@/middleware/validation';
 * import { z } from 'zod';
 *
 * const querySchema = z.object({
 *   userId: commonSchemas.uuid,
 *   ...commonSchemas.pagination.shape,
 * });
 *
 * export async function GET(req: NextRequest) {
 *   const validationResult = validateQueryParams(req, querySchema);
 *   if (validationResult.error) {
 *     return validationResult.response;
 *   }
 *
 *   const { userId, page, limit } = validationResult.data;
 *   // Use validated query parameters
 * }
 * ```
 */
export function validateQueryParams<T>(
  req: NextRequest,
  schema: ZodSchema<T>
):
  | { error: true; response: NextResponse; data?: never }
  | { error: false; data: T; response?: never } {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, unknown> = {};

    // Convert URLSearchParams to plain object
    searchParams.forEach((value, key) => {
      // Try to parse numbers
      if (!isNaN(Number(value))) {
        params[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        // Parse booleans
        params[key] = value === 'true';
      } else {
        params[key] = value;
      }
    });

    const validatedData = schema.parse(params);

    return {
      error: false,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        error: true,
        response: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: formattedErrors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      error: true,
      response: NextResponse.json(
        { error: 'Internal validation error' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to validate request size
 * Prevents large payload attacks
 *
 * @param maxSizeBytes - Maximum allowed request size in bytes
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * import { validateRequestSize } from '@/middleware/validation';
 *
 * export async function POST(req: NextRequest) {
 *   const sizeValidation = validateRequestSize(1024 * 1024); // 1MB
 *   const result = await sizeValidation(req);
 *   if (result) return result;
 *
 *   // Continue with request handling
 * }
 * ```
 */
export function validateRequestSize(maxSizeBytes: number) {
  return async function (req: NextRequest): Promise<NextResponse | null> {
    const contentLength = req.headers.get('content-length');

    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      return NextResponse.json(
        {
          error: 'Request payload too large',
          maxSize: `${(maxSizeBytes / 1024).toFixed(0)}KB`,
        },
        { status: 413 }
      );
    }

    return null;
  };
}

/**
 * Validates Content-Type header
 *
 * @param req - The incoming request
 * @param allowedTypes - Array of allowed content types
 * @returns NextResponse if invalid, null if valid
 *
 * @example
 * ```typescript
 * import { validateContentType } from '@/middleware/validation';
 *
 * export async function POST(req: NextRequest) {
 *   const typeValidation = validateContentType(req, ['application/json']);
 *   if (typeValidation) return typeValidation;
 *
 *   // Continue with request handling
 * }
 * ```
 */
export function validateContentType(
  req: NextRequest,
  allowedTypes: string[]
): NextResponse | null {
  const contentType = req.headers.get('content-type');

  if (!contentType || !allowedTypes.some((type) => contentType.includes(type))) {
    return NextResponse.json(
      {
        error: 'Invalid Content-Type',
        allowedTypes,
      },
      { status: 415 }
    );
  }

  return null;
}

/**
 * Combined validation middleware that applies multiple validations
 *
 * @param validations - Array of validation middleware functions
 * @returns Combined middleware function
 *
 * @example
 * ```typescript
 * import { combineValidations, validateRequestSize, validateContentType } from '@/middleware/validation';
 *
 * const validations = combineValidations([
 *   validateRequestSize(1024 * 1024),
 *   (req) => validateContentType(req, ['application/json']),
 * ]);
 *
 * export async function POST(req: NextRequest) {
 *   const validationResult = await validations(req);
 *   if (validationResult) return validationResult;
 *
 *   // All validations passed
 * }
 * ```
 */
export function combineValidations(
  validations: Array<(req: NextRequest) => Promise<NextResponse | null> | NextResponse | null>
) {
  return async function (req: NextRequest): Promise<NextResponse | null> {
    for (const validation of validations) {
      const result = await validation(req);
      if (result) {
        return result;
      }
    }
    return null;
  };
}
