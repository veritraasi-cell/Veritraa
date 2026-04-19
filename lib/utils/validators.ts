import { z } from 'zod';

export const idSchema = z.string().trim().min(1, 'An id is required.');
export const emailSchema = z.string().trim().email('Enter a valid email address.');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.').max(128);
export const slugSchema = z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'Use a URL-safe slug.');
export const shopifyGidSchema = z.string().trim().regex(/^gid:\/\/shopify\/[A-Za-z]+\/\d+$/i, 'Enter a valid Shopify GID.');
export const quantitySchema = z.coerce.number().int('Quantity must be a whole number.');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

export const productSearchSchema = z.object({
  query: z.string().trim().min(1, 'Enter a product id, title, or handle.'),
});

export const commonTextSchema = z.string().trim().max(5000);
