import { expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph } from 'docx';

it('imports an Excel contact sheet with the upgraded parser', () => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet([
    { email: 'contact@example.invalid', prenom: 'Georges' },
  ]), 'Contacts');
  const buffer = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
  const parsed = XLSX.read(buffer, { type: 'array' });
  expect(XLSX.utils.sheet_to_json(parsed.Sheets.Contacts)).toEqual([
    { email: 'contact@example.invalid', prenom: 'Georges' },
  ]);
});

it('imports French manuscript text with the upgraded Word parser', async () => {
  const doc = new Document({ sections: [{ children: [
    new Paragraph('Chapitre 1'), new Paragraph('Une histoire rédigée en français.'),
  ] }] });
  const buffer = await Packer.toBuffer(doc);
  const result = await mammoth.extractRawText({ buffer });
  expect(result.value).toContain('Une histoire rédigée en français.');
});