
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
  try {
    console.log("Début de l'export avec:", { selectedKeywords, allKeywordsCount: allKeywords.length });
    
    if (!Array.isArray(selectedKeywords) || selectedKeywords.length === 0) {
      toast.error('Aucun mot-clé sélectionné pour l\'export');
      return;
    }

    // Filtrer les mots-clés sélectionnés parmi tous les mots-clés
    const keywordsToExport = allKeywords.filter(k => selectedKeywords.includes(k.keyword));

    console.log("Mots-clés filtrés pour l'export:", keywordsToExport.length);

    if (keywordsToExport.length === 0) {
      toast.error('Aucun mot-clé trouvé pour l\'export');
      return;
    }

    // Créer le contenu CSV
    const csv = [
      ['Mot-clé', 'Volume', 'Difficulté', 'CPC', 'Compétition'].join(','),
      ...keywordsToExport.map(k => [
        `"${k.keyword}"`,
        k.volume || '0',
        k.difficulty || '0',
        k.cpc || '0',
        k.competition || '0'
      ].join(','))
    ].join('\n');

    // Créer et télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${baseKeyword.replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${keywordsToExport.length} mots-clés exportés avec succès`);
  } catch (error) {
    console.error('Erreur lors de l\'exportation des mots-clés:', error);
    toast.error('Erreur lors de l\'exportation des mots-clés');
  }
};
