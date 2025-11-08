import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export const useSubscriptionGeneration = (subscriberEmail: string, apiKey?: string, ebookTitle?: string, targetAudience?: string, tomeNumber?: number | null) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateContent = async (actionType: string, prompt: string, additionalData?: any) => {
    if (!apiKey) {
      toast.error('Clé API OpenAI requise');
      return null;
    }

    setIsGenerating(true);

    try {
      // Appel direct à l'API OpenAI sans vérification d'abonnement
      console.log('Calling OpenAI directly with provided API key');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Vous êtes un expert en création de contenu pour ebooks. Répondez en français avec un contenu de haute qualité.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        toast.error('Erreur lors de la génération du contenu');
        return null;
      }

      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateChapterContent = async (chapter: Chapter) => {
    const contextLine = ebookTitle ? `\nCe chapitre fait partie de l'ebook intitulé "${ebookTitle}". Assure-toi que le contenu reste cohérent avec ce titre et traite des éléments/personnages/thèmes mentionnés dans le titre de l'ebook.` : '';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style d'écriture, la complexité des concepts et les exemples utilisés pour correspondre parfaitement à ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Assure-toi de maintenir la continuité avec les tomes précédents si applicable, et de laisser place à une suite si ce n'est pas le dernier tome.` : '';
    
    const prompt = `Rédige un chapitre complet de 350 mots exactement sur le sujet : "${chapter.title}".${contextLine}${audienceLine}${tomeLine}
    
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- En lien direct avec le titre de l'ebook si fourni
- Parfaitement adapté au public cible spécifié (vocabulaire, ton, exemples)
- Bien structuré avec des paragraphes
- Exactement 350 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`;

    const content = await callGenerateContent('chapters_generated', prompt);
    if (content) {
      toast.success('Chapitre généré avec succès !');
    }
    return content;
  };

  const generateSubChapterContent = async (subChapter: SubChapter) => {
    const contextLine = ebookTitle ? `\nCe sous-chapitre fait partie de l'ebook intitulé "${ebookTitle}". Assure-toi que le contenu reste cohérent avec ce titre et traite des éléments/personnages/thèmes mentionnés dans le titre de l'ebook.` : '';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style d'écriture et les exemples pour ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Maintiens la cohérence avec les tomes précédents.` : '';
    
    const prompt = `Rédige le contenu pour le sous-chapitre : "${subChapter.title}".${contextLine}${audienceLine}${tomeLine}
    
Le contenu doit faire environ 200 mots et être :
- Informatif et pertinent
- En lien direct avec le titre de l'ebook si fourni
- Parfaitement adapté au public cible (vocabulaire, ton, exemples)
- Bien structuré
- Engageant pour le lecteur
- Utiliser l'italique (*) pour les points importants`;

    const content = await callGenerateContent('subchapters_generated', prompt);
    if (content) {
      toast.success('Sous-chapitre généré !');
    }
    return content;
  };

  const generateEbookPlan = async (ebookTitle: string, authorName: string, numberOfChapters: number) => {
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Les titres des chapitres et sous-chapitres doivent être adaptés à ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Structure le plan en conséquence, en tenant compte de l'arc narratif global de la série.` : '';
    
    const prompt = `Crée un plan détaillé pour un ebook intitulé "${ebookTitle}" par ${authorName}.${audienceLine}${tomeLine}
    
Le plan doit contenir exactement ${numberOfChapters} chapitres principaux.

Format JSON attendu :
{
  "preface": "Une préface captivante",
  "chapters": [
    {
      "title": "Titre du chapitre 1",
      "subChapters": [
        "Sous-chapitre 1.1",
        "Sous-chapitre 1.2"
      ]
    }
  ],
  "conclusion": "Une conclusion percutante"
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;

    const content = await callGenerateContent('ebook_plans_generated', prompt);
    
    if (content) {
      try {
        // Nettoyer le contenu pour enlever les balises markdown
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        toast.success('Plan généré avec succès !');
        return parsed;
      } catch (error) {
        console.error('Erreur parsing JSON:', error, 'Contenu reçu:', content);
        toast.error('Erreur de format du plan généré');
        return null;
      }
    }
    return null;
  };

  const generateBookSummary = async (chapters: Chapter[], ebookTitle: string) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Génère un résumé de 200 mots pour l'ebook "${ebookTitle}" qui contient ces chapitres : ${chaptersText}`;

    return await callGenerateContent('chapters_generated', prompt);
  };

  const generateEbookCover = async (ebookTitle: string) => {
    const prompt = `Génère 3 concepts créatifs de couverture pour l'ebook "${ebookTitle}". Pour chaque concept, décris :
- Le style visuel
- Les couleurs principales
- Les éléments graphiques
- La typographie suggérée`;

    const content = await callGenerateContent('covers_generated', prompt);
    if (content) {
      toast.success('Concepts de couverture générés !');
    }
    return content;
  };

  const optimizeForSEO = async (ebookTitle: string, chapters: Chapter[]) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Optimise pour le SEO l'ebook "${ebookTitle}" avec ces chapitres : ${chaptersText}.
    
Génère :
1. 5 variantes de titres optimisés SEO
2. 10 mots-clés principaux
3. Une meta description de 160 caractères
4. 15 hashtags pertinents

Format JSON attendu:
{
  "titles": ["titre1", "titre2"...],
  "keywords": ["mot1", "mot2"...],
  "metaDescription": "description",
  "hashtags": ["#tag1", "#tag2"...]
}`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        toast.error('Erreur de format SEO');
        return null;
      }
    }
    return null;
  };

  const generateKDPDescription = async (title: string, chapters: Chapter[]) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Crée une description Amazon KDP attractive pour le livre "${title}" avec ces chapitres : ${chaptersText}.
    
La description doit :
- Faire 2000 caractères maximum
- Être persuasive et engageante
- Mettre en avant les bénéfices pour le lecteur
- Inclure un appel à l'action`;

    return await callGenerateContent('chapters_generated', prompt);
  };

  const generateKDPKeywords = async (title: string, chapters: Chapter[]) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Génère 7 mots-clés Amazon KDP pour le livre "${title}" avec ces chapitres : ${chaptersText}.
Chaque mot-clé doit faire moins de 50 caractères.
Réponds avec un tableau JSON : ["mot1", "mot2",...]`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }
    return null;
  };

  const generateKDPCategories = async (title: string, chapters: Chapter[]) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Suggère 5 catégories Amazon KDP pour le livre "${title}" avec ces chapitres : ${chaptersText}.
Réponds avec un tableau JSON de catégories : ["catégorie1", "catégorie2",...]`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }
    return null;
  };

  const generateBackCover = async (
    ebookTitle: string, 
    authorName: string, 
    chapters: Chapter[], 
    tone: string, 
    audience: string, 
    highlights: string
  ) => {
    console.log('[useSubscriptionGeneration] generateBackCover called with:', { 
      ebookTitle, 
      authorName, 
      chaptersCount: chapters.length, 
      tone, 
      audience, 
      highlights 
    });
    
    const chaptersText = chapters.map(c => c.title).join(', ');
    const highlightsText = highlights ? `Points forts à mettre en avant : ${highlights}` : '';
    
    const prompt = `Génère une 4ème de couverture professionnelle pour un ebook intitulé "${ebookTitle}" par ${authorName}.

Chapitres : ${chaptersText}
Ton : ${tone}
Public : ${audience}
${highlightsText}

Structure attendue :
1. **Hook** (1-2 phrases percutantes qui captent l'attention)
2. **Problème** (quel défi ou besoin le livre résout)
3. **Solution** (comment le livre y répond)
4. **Contenu** (aperçu des chapitres principaux)
5. **Bénéfices** (ce que le lecteur va gagner)
6. **Call-to-Action** (appel à l'action persuasif)

Contraintes :
- Maximum 2000 caractères pour Amazon KDP
- Style persuasif, professionnel, orienté bénéfices
- Langage adapté au public cible
- Utilise le ton demandé
- Inclure les mots-clés naturellement

Réponds avec la description complète uniquement, sans titre de section.`;

    console.log('[useSubscriptionGeneration] Calling generate-content function...');
    const content = await callGenerateContent('covers_generated', prompt);
    console.log('[useSubscriptionGeneration] Content received:', content ? 'Success' : 'Failed');
    
    if (content) {
      toast.success('4ème de couverture générée !');
    }
    return content;
  };

  return {
    isGenerating,
    generateChapterContent,
    generateSubChapterContent,
    generateEbookPlan,
    generateBookSummary,
    generateEbookCover,
    optimizeForSEO,
    generateKDPDescription,
    generateKDPKeywords,
    generateKDPCategories,
    generateBackCover
  };
};