export const VC_BOOKS_KDP_DEFAULT_PRICE_CENTS = 1299;

export interface VCKdpSheet {
  isbn: string;
  title: string;
  author: string;
  theme: string;
  price: string;
}

export function formatVCKdpSheet(sheet: VCKdpSheet): string {
  return [
    `ISBN : ${sheet.isbn.trim() || 'À renseigner dans KDP'}`,
    `Titre : ${sheet.title.trim()}`,
    `Auteur : ${sheet.author.trim()}`,
    `Thème : ${sheet.theme.trim()}`,
    `Prix : ${sheet.price.trim()} €`,
  ].join('\n');
}