
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';

export const exportKeywordsToCSV = (
  selectedKeywords: string[],
  allKeywords: KeywordSuggestion[],
  baseKeyword: string
) => {
  const selected = allKeywords.filter(kw => selectedKeywords.includes(kw.keyword));
  
  let csv = "Mot-clé,Volume,Difficulté,CPC,Opportunité,Type,Intention\n";
  selected.forEach(kw => {
    csv += `"${kw.keyword}",${kw.volume || 'N/A'},${kw.difficulty || 'N/A'},${kw.cpc || 'N/A'},${kw.opportunity || 'N/A'},${kw.type || 'standard'},${kw.intent || 'N/A'}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `mots-cles-${baseKeyword.replace(/\s+/g, '-')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`${selectedKeywords.length} mots-clés exportés`);
};
