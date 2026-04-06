import { useState } from 'react';
import { toast } from 'sonner';
import { callGemini, callGeminiJSON } from '@/services/geminiService';

export interface Chapter {
  id: string;
  title: string;
  subChapters: SubChapter[];
  content?: string;
}

export interface SubChapter {
  id: string;
  title: string;
  content?: string;
}

export const useEbookGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChapterContent = async (
    chapter: Chapter, 
    apiKey: string,
    bookContext?: { title: string; category?: string; allChapters?: Chapter[]; currentIndex?: number }
  ) => {
    if (!chapter.title || !apiKey) {
      toast.error('Titre du chapitre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      // Construire le contexte enrichi
      let contextBlock = '';
      if (bookContext) {
        contextBlock += `\nLIVRE : "${bookContext.title}"`;
        if (bookContext.category) contextBlock += `\nCATÉGORIE : ${bookContext.category}`;
        
        if (bookContext.allChapters && bookContext.allChapters.length > 0) {
          const plan = bookContext.allChapters.map((ch, i) => `${i + 1}. ${ch.title}`).join('\n');
          contextBlock += `\n\nPLAN DU LIVRE :\n${plan}`;
          
          // Résumé des chapitres déjà rédigés (max 800 chars chacun, les 3 derniers)
          const previousChapters = bookContext.allChapters
            .filter((ch, i) => ch.content && i < (bookContext.currentIndex ?? Infinity))
            .slice(-3);
          if (previousChapters.length > 0) {
            contextBlock += `\n\nCHAPITRES PRÉCÉDENTS (pour continuité) :\n${previousChapters.map(ch => 
              `- "${ch.title}": ${ch.content!.substring(0, 800)}...`
            ).join('\n')}`;
          }
        }
      }

      const content = await callGemini(apiKey, 
        `Rédige un chapitre complet de 350 mots exactement sur le sujet : "${chapter.title}".
${contextBlock}
            
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 350 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent
- Technique et détaillé quand approprié
- COHÉRENT avec les chapitres précédents (ne pas répéter, poursuivre la progression)

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`,
        { maxTokens: 600, temperature: 0.7 }
      );

      if (!content || content.length < 50) {
        throw new Error('Contenu généré trop court ou vide');
      }
      
      return content.trim();
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      toast.error(error.message || 'Erreur lors de la génération');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSubChapterContent = async (
    subChapter: SubChapter, 
    apiKey: string,
    bookContext?: { title: string; category?: string; parentChapterTitle?: string }
  ) => {
    if (!subChapter.title || !apiKey) {
      toast.error('Titre du sous-chapitre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      let contextBlock = '';
      if (bookContext) {
        contextBlock += `\nLIVRE : "${bookContext.title}"`;
        if (bookContext.category) contextBlock += `\nCATÉGORIE : ${bookContext.category}`;
        if (bookContext.parentChapterTitle) contextBlock += `\nCHAPITRE PARENT : "${bookContext.parentChapterTitle}"`;
      }

      const content = await callGemini(apiKey,
        `Rédige un sous-chapitre complet de 300 mots exactement sur le sujet : "${subChapter.title}".
${contextBlock}
            
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 300 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent
- Technique et détaillé quand approprié
- COHÉRENT avec le chapitre parent et le livre dans son ensemble

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`,
        { maxTokens: 500, temperature: 0.7 }
      );

      return content;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération. Vérifiez votre clé API.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEbookPlan = async (ebookTitle: string, authorName: string, numberOfChapters: number, apiKey: string) => {
    if (!ebookTitle || !apiKey) {
      toast.error('Titre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const planData = await callGeminiJSON(apiKey,
        `Crée un plan détaillé d'ebook sur le sujet: "${ebookTitle}". 
            
Génère:
1. ${authorName ? `Garde le nom d'auteur: "${authorName}"` : "Un nom d'auteur approprié"}
2. Une préface d'au moins 500 caractères sur "${ebookTitle}", engageante et professionnelle
3. Exactement ${numberOfChapters} chapitres avec des titres liés au sujet "${ebookTitle}"
4. 2-4 sous-chapitres pour chaque chapitre, tous liés au sujet principal
5. Une conclusion sur "${ebookTitle}" de 350 mots minimum

IMPORTANT: Tous les titres et contenus doivent être cohérents avec le sujet principal "${ebookTitle}".

Réponds uniquement au format JSON suivant (SANS balises markdown):
{
  "author": "Nom de l'auteur",
  "preface": "Préface complète sur le sujet...",
  "chapters": [
    {
      "title": "Titre du chapitre lié au sujet",
      "subChapters": ["Sous-chapitre 1", "Sous-chapitre 2"]
    }
  ],
  "conclusion": "Conclusion complète sur le sujet..."
}`,
        { maxTokens: 2000, temperature: 0.7 }
      );
      
      return planData;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du plan. Vérifiez votre clé API Gemini.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const splitChapterAutomatically = async (chapter: Chapter, apiKey: string) => {
    if (!chapter.content || !apiKey) {
      toast.error('Contenu du chapitre et clé API requis');
      return null;
    }

    setIsGenerating(true);
    
    try {
      const result = await callGeminiJSON(apiKey,
        `Analyse ce contenu de chapitre et propose une division logique en sous-chapitres :

"${chapter.content}"

Réponds uniquement au format JSON:
{
  "subChapters": [
    {
      "title": "Titre du sous-chapitre 1",
      "content": "Contenu correspondant..."
    },
    {
      "title": "Titre du sous-chapitre 2", 
      "content": "Contenu correspondant..."
    }
  ]
}`,
        { maxTokens: 2000, temperature: 0.7 }
      );
      
      const newSubChapters = result.subChapters.map((sub: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: sub.title,
        content: sub.content
      }));

      return newSubChapters;
    } catch (error) {
      toast.error('Erreur lors de la division automatique');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBookSummary = async (chapters: Chapter[], ebookTitle: string, apiKey: string) => {
    if (!chapters.length || !apiKey) {
      toast.error('Chapitres et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const chaptersText = chapters.map(c => `${c.title}: ${c.content || 'Pas de contenu'}`).join('\n\n');
      
      const summary = await callGemini(apiKey,
        `Créé un résumé engageant de 150-200 mots pour cet ebook intitulé "${ebookTitle}" basé sur ces chapitres:

${chaptersText}

Le résumé doit:
- Présenter le livre de manière attractive
- Mentionner les bénéfices pour le lecteur
- Être accrocheur pour donner envie d'acheter
- Inclure des mots-clés du sujet principal`,
        { maxTokens: 400, temperature: 0.8 }
      );

      return summary;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération du résumé');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEbookCover = async (ebookTitle: string, apiKey: string) => {
    if (!ebookTitle || !apiKey) {
      toast.error('Titre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const concepts = await callGemini(apiKey,
        `Génère 5 concepts visuels créatifs pour la couverture d'un ebook intitulé "${ebookTitle}".

Pour chaque concept, décris:
- Les couleurs principales
- Les éléments visuels clés
- Le style (moderne, classique, minimaliste, etc.)
- La disposition du titre
- L'ambiance générale

Format de réponse:
**Concept 1 - [Nom du style]**
Couleurs: ...
Éléments: ...
Style: ...
Disposition: ...
Ambiance: ...`,
        { maxTokens: 800, temperature: 0.9 }
      );

      return concepts;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des concepts');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeForSEO = async (ebookTitle: string, chapters: Chapter[], apiKey: string) => {
    if (!ebookTitle || !chapters.length || !apiKey) {
      toast.error('Titre, chapitres et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const chaptersText = chapters.map(c => c.title).join(', ');
      
      const seoData = await callGeminiJSON(apiKey,
        `Optimise ce titre d'ebook pour le SEO: "${ebookTitle}" avec ces chapitres: ${chaptersText}

Génère:
1. 3 titres alternatifs optimisés SEO (max 60 caractères)
2. 5 mots-clés principaux
3. 10 mots-clés longue traîne
4. Meta description (150-160 caractères)
5. 5 hashtags pertinents

Réponds au format JSON:
{
  "optimizedTitles": ["titre1", "titre2", "titre3"],
  "keywords": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "longTailKeywords": ["expression1", "expression2"],
  "metaDescription": "description optimisée...",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`,
        { maxTokens: 800, temperature: 0.7 }
      );

      return seoData;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'optimisation SEO");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKDPDescription = async (title: string, chapters: Chapter[], apiKey: string): Promise<string | null> => {
    if (!apiKey) {
      toast.error('Clé API Gemini manquante');
      return null;
    }

    setIsGenerating(true);
    try {
      const description = await callGemini(apiKey,
        `Crée une description Amazon KDP attractive et optimisée pour l'ebook "${title}".

Chapitres:
${chapters.map(ch => `- ${ch.title}`).join('\n')}

Critères:
- 4000 caractères maximum
- Utilise des bullet points et formatage HTML basique
- Inclut un hook accrocheur
- Mentionne les bénéfices pour le lecteur
- Appel à l'action à la fin
- Optimisé pour la conversion`,
        { maxTokens: 1200, temperature: 0.7 }
      );

      toast.success('Description KDP générée !');
      return description.trim();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération de la description KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKDPKeywords = async (title: string, chapters: Chapter[], apiKey: string): Promise<string[] | null> => {
    if (!apiKey) {
      toast.error('Clé API Gemini manquante');
      return null;
    }

    setIsGenerating(true);
    try {
      const keywords = await callGeminiJSON<string[]>(apiKey,
        `Génère 7 mots-clés Amazon KDP pour l'ebook "${title}".

Chapitres:
${chapters.map(ch => `- ${ch.title}`).join('\n')}

Critères:
- Maximum 7 mots-clés (limite Amazon)
- Chaque mot-clé: 50 caractères maximum
- Mélange de mots-clés courts et longue traîne
- Optimisés pour la recherche Amazon
- Évite la répétition du titre
- Format JSON: ["mot-clé 1", "mot-clé 2", ...]`,
        { maxTokens: 500, temperature: 0.7 }
      );

      toast.success('Mots-clés KDP générés !');
      return keywords;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des mots-clés KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKDPCategories = async (title: string, chapters: Chapter[], apiKey: string): Promise<string[] | null> => {
    if (!apiKey) {
      toast.error('Clé API Gemini manquante');
      return null;
    }

    setIsGenerating(true);
    try {
      const categories = await callGeminiJSON<string[]>(apiKey,
        `Suggère les meilleures catégories Amazon KDP pour l'ebook "${title}".

Chapitres:
${chapters.map(ch => `- ${ch.title}`).join('\n')}

Critères:
- 2 catégories principales (Amazon permet 2 max)
- Utilise la hiérarchie complète (ex: "Livres > Business > Marketing")
- Choisis les catégories les moins concurrentielles mais pertinentes
- Format JSON: ["Catégorie 1 > Sous-catégorie", "Catégorie 2 > Sous-catégorie"]`,
        { maxTokens: 400, temperature: 0.7 }
      );

      toast.success('Catégories KDP générées !');
      return categories;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération des catégories KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateChapterContent,
    generateSubChapterContent,
    generateEbookPlan,
    splitChapterAutomatically,
    generateBookSummary,
    generateEbookCover,
    optimizeForSEO,
    generateKDPDescription,
    generateKDPKeywords,
    generateKDPCategories
  };
};
