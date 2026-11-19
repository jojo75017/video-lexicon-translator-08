import { describe, expect, it } from 'vitest';
import { readerSignupSchema } from '../../supabase/functions/book-reader-signup/validation';

describe('inscriptions des lecteurs El Cuervo', () => {
  const valid = { book_slug: 'el-cuervo', email: 'lecteur@example.org', consent: true };
  it('exige le consentement explicite pour les nouvelles du livre', () => {
    expect(readerSignupSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(readerSignupSchema.safeParse(valid).success).toBe(true);
  });
  it('ne permet pas de collecter des lecteurs pour un autre livre', () => {
    expect(readerSignupSchema.safeParse({ ...valid, book_slug: '../admin' }).success).toBe(false);
  });
  it('normalise les emails pour éviter les doublons', () => {
    expect(readerSignupSchema.parse({ ...valid, email: ' Lecteur@Example.org ' }).email).toBe('lecteur@example.org');
  });
});