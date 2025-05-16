
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { toast } from 'sonner';

/**
 * Exports selected keywords to a CSV file
 */
export const exportKeywordsToCSV = (
  selectedKeywords: string[],
  allKeywords: KeywordSuggestion[],
  baseKeyword: string
): void => {
  if (selectedKeywords.length === 0) {
    toast.error('Aucun mot-clé sélectionné pour l\'export');
    return;
  }

  const keywordsToExport = allKeywords.filter(k => selectedKeywords.includes(k.keyword));

  const csv = [
    ['Mot-clé', 'Volume', 'Difficulté', 'CPC', 'Compétition'].join(','),
    ...keywordsToExport.map(k => [
      `"${k.keyword}"`,
      k.volume,
      k.difficulty,
      k.cpc,
      k.competition
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `mots-cles-${baseKeyword.replace(/\s+/g, '-')}.csv`);
  link.click();

  toast.success(`${keywordsToExport.length} mots-clés exportés`);
};
