import { z } from 'zod';

export const readerSignupSchema = z.object({
  book_slug: z.literal('el-cuervo'),
  email: z.string().trim().toLowerCase().email().max(254),
  first_name: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});