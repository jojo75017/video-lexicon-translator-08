import { z } from 'zod';

export const readerSignupSchema = z.object({
  book_slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).min(3).max(60),
  email: z.string().trim().toLowerCase().email().max(254),
  first_name: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});