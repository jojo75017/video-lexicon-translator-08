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

export const useSubscriptionGeneration = (
  subscriberEmail: string, 
  apiKey?: string, 
  ebookTitle?: string, 
  targetAudience?: string, 
  tomeNumber?: number | null,
  writingStyle?: string,
  chapterLength?: string,
  detailLevel?: string,
  tone?: string,
  narrativeFormat?: string
) => {
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
    const styleLine = writingStyle ? `\nStyle d'écriture : ${writingStyle}. Adopte ce style dans ta rédaction.` : '';
    const lengthLine = chapterLength ? `\nLongueur souhaitée : ${chapterLength}.` : '';
    const detailLine = detailLevel ? `\nNiveau de détail : ${detailLevel}. Fournis un contenu avec ce niveau de détail.` : '';
    const toneLine = tone ? `\nTon : ${tone}. Utilise ce ton tout au long du texte.` : '';
    const narrativeLine = narrativeFormat ? `\nFormat de narration : ${narrativeFormat}.` : '';
    
    const prompt = `Rédige un chapitre complet de 350 mots exactement sur le sujet : "${chapter.title}".${contextLine}${audienceLine}${tomeLine}${styleLine}${lengthLine}${detailLine}${toneLine}${narrativeLine}
    
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- En lien direct avec le titre de l'ebook si fourni
- Parfaitement adapté au public cible spécifié (vocabulaire, ton, exemples)
- Bien structuré avec des paragraphes
- Exactement 350 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`;

    const content = await callGenerateContent('chapters_generated', prompt);
    // Toast supprimé - génération silencieuse
    return content;
  };

  const generateSubChapterContent = async (subChapter: SubChapter) => {
    const contextLine = ebookTitle ? `\nCe sous-chapitre fait partie de l'ebook intitulé "${ebookTitle}". Assure-toi que le contenu reste cohérent avec ce titre et traite des éléments/personnages/thèmes mentionnés dans le titre de l'ebook.` : '';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style d'écriture et les exemples pour ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Maintiens la cohérence avec les tomes précédents.` : '';
    const styleLine = writingStyle ? `\nStyle d'écriture : ${writingStyle}.` : '';
    const detailLine = detailLevel ? `\nNiveau de détail : ${detailLevel}.` : '';
    const toneLine = tone ? `\nTon : ${tone}.` : '';
    const narrativeLine = narrativeFormat ? `\nFormat de narration : ${narrativeFormat}.` : '';
    
    const prompt = `Rédige le contenu pour le sous-chapitre : "${subChapter.title}".${contextLine}${audienceLine}${tomeLine}${styleLine}${detailLine}${toneLine}${narrativeLine}
    
Le contenu doit faire environ 200 mots et être :
- Informatif et pertinent
- En lien direct avec le titre de l'ebook si fourni
- Parfaitement adapté au public cible (vocabulaire, ton, exemples)
- Bien structuré
- Engageant pour le lecteur
- Utiliser l'italique (*) pour les points importants`;

    const content = await callGenerateContent('subchapters_generated', prompt);
    // Toast supprimé - génération silencieuse
    return content;
  };

  const generateEbookPlan = async (ebookTitle: string, authorName: string, numberOfChapters: number) => {
    // Instructions spécifiques selon le public cible
    let audienceInstructions = '';
    if (targetAudience) {
      const audienceGuides: Record<string, string> = {
        'Enfants (3-6 ans)': `Public: Enfants 3-6 ans. Utilise un vocabulaire très simple, des phrases courtes (max 10 mots), des répétitions ludiques, des onomatopées, et des thèmes adaptés (animaux, famille, jeux). Évite tout contenu effrayant ou complexe.`,
        'Enfants (6-10 ans)': `Public: Enfants 6-10 ans. Vocabulaire accessible, phrases simples mais plus élaborées, aventures légères, leçons de vie positives, personnages auxquels ils peuvent s'identifier. Évite les thèmes matures.`,
        'Enfants (10-12 ans)': `Public: Pré-adolescents 10-12 ans. Vocabulaire plus riche, intrigues plus complexes, thèmes comme l'amitié, l'école, les premiers défis. Pas de contenu romantique ou violent.`,
        'Adolescents': `Public: Adolescents 13-17 ans. Thèmes qui résonnent avec eux (identité, relations, défis sociaux), style moderne, personnages ados, évite le côté moralisateur.`,
        'Jeunes adultes': `Public: Jeunes adultes 18-25 ans. Thèmes matures (carrière, relations amoureuses, indépendance), style contemporain, références culturelles actuelles.`,
        'Adultes': `Public: Adultes. Contenu approfondi, vocabulaire riche, thèmes complexes, analyses nuancées.`,
        'Seniors': `Public: Seniors. Thèmes pertinents (sagesse, mémoires, santé, loisirs), style respectueux et accessible, évite le jargon technologique excessif.`,
        'Tout public': `Public: Tout public. Contenu accessible à tous les âges, évite les thèmes exclusivement adultes, vocabulaire universel.`
      };
      audienceInstructions = audienceGuides[targetAudience] || `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style et les thèmes à ce public.`;
    }
    
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Structure le plan en conséquence.` : '';
    const styleLine = writingStyle ? `\nStyle d'écriture : ${writingStyle}.` : '';
    const toneLine = tone ? `\nTon général : ${tone}.` : '';
    
    const prompt = `Crée un plan détaillé pour un ebook intitulé "${ebookTitle}" par ${authorName}.

${audienceInstructions}${tomeLine}${styleLine}${toneLine}

IMPORTANT: Le contenu DOIT être parfaitement adapté au public cible. Les titres, thèmes et vocabulaire doivent correspondre à l'âge et au niveau de compréhension du public.
    
Le plan doit contenir exactement ${numberOfChapters} chapitres principaux.

Format JSON attendu :
{
  "preface": "Une préface captivante adaptée au public",
  "chapters": [
    {
      "title": "Titre du chapitre 1",
      "subChapters": [
        "Sous-chapitre 1.1",
        "Sous-chapitre 1.2"
      ]
    }
  ],
  "conclusion": "Une conclusion percutante adaptée au public"
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;

    const content = await callGenerateContent('ebook_plans_generated', prompt);
    
    if (content) {
      try {
        // Nettoyer le contenu pour enlever les balises markdown
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        // Toast supprimé - génération silencieuse
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
    // Toast supprimé - génération silencieuse
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
    const prompt = `Tu es un expert en optimisation Amazon KDP et algorithme A9.

Génère exactement 7 mots-clés Amazon KDP pour le livre "${title}" avec ces chapitres : ${chaptersText}.

RÈGLES STRICTES pour chaque mot-clé :
- Maximum 50 caractères
- Pertinent pour la recherche Amazon
- Pas de répétition du titre exact
- Inclure des variantes longue traîne

Réponds UNIQUEMENT avec ce format JSON (pas de texte avant/après) :
[
  {"keyword": "mot clé 1", "chars": 12, "relevance": "haute", "tip": "conseil A9"},
  {"keyword": "mot clé 2", "chars": 15, "relevance": "haute", "tip": "conseil A9"},
  ...
]

Les niveaux de relevance sont : "haute", "moyenne", "faible"
Le tip doit expliquer pourquoi ce mot-clé est efficace pour A9.`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        let clean = content.trim().replace(/```json\s*|```/g, '').trim();
        const match = clean.match(/\[[\s\S]*\]/);
        const jsonText = match ? match[0] : clean;
        return JSON.parse(jsonText);
      } catch {
        return null;
      }
    }
    return null;
  };

  const generateKDPCategories = async (title: string, chapters: Chapter[]) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const prompt = `Tu es un expert en catégories Amazon KDP et BISAC.

Suggère les 5 meilleures catégories Amazon KDP pour le livre "${title}" avec ces chapitres : ${chaptersText}.

Pour chaque catégorie, fournis :
- Le chemin BISAC complet (ex: "Fiction > Romance > Contemporary")
- Le niveau de concurrence estimé
- Une recommandation stratégique

Réponds UNIQUEMENT avec ce format JSON (pas de texte avant/après) :
[
  {
    "category": "Chemin > Complet > Catégorie",
    "competition": "faible",
    "books_estimate": "500-1000",
    "recommendation": "Excellente niche avec peu de concurrence",
    "ranking_potential": "Top 100 accessible"
  },
  ...
]

Les niveaux de competition sont : "faible", "moyenne", "élevée", "très élevée"`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        let clean = content.trim().replace(/```json\s*|```/g, '').trim();
        const match = clean.match(/\[[\s\S]*\]/);
        const jsonText = match ? match[0] : clean;
        return JSON.parse(jsonText);
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
    
    // Toast supprimé - génération silencieuse
    return content;
  };

  const generatePricingStrategy = async (ebookTitle: string, genre: string, targetAge: string) => {
    const prompt = `Crée une stratégie de prix complète pour un ebook "${ebookTitle}" dans le genre "${genre}", public cible: ${targetAge || 'adultes'}. Inclus:
    - Prix de lancement recommandé (en €)
    - Prix optimal après lancement
    - Stratégie de promotions (quand faire des réductions)
    - Comparaison avec concurrents du genre
    - Prévisions de revenus réalistes
    
    Présente le tout de manière structurée et professionnelle.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    // Toast supprimé - génération silencieuse
    return content;
  };

  const generateLaunchPlan = async (ebookTitle: string) => {
    const prompt = `Crée un plan de lancement détaillé sur 90 jours pour l'ebook "${ebookTitle}". Inclus:
    - Semaines -4 à 0: Préparation (création contenu, mise en place, pre-launch)
    - Jour du lancement: Actions critiques heure par heure
    - Mois 1: Acquisition initiale (tactiques, canaux, objectifs)
    - Mois 2-3: Croissance et optimisation
    - KPIs à suivre chaque semaine
    - Budget marketing suggéré par phase
    
    Présente le tout sous forme de plan d'action détaillé et actionnable.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    // Toast supprimé - génération silencieuse
    return content;
  };

  const generateAuthorBio = async (authorName: string, genre: string) => {
    const prompt = `Crée 3 versions de biographie d'auteur professionnelle pour "${authorName || 'l\'auteur'}" spécialisé dans "${genre || 'écriture'}":
    
    1. **Courte** (50 mots): Pour les réseaux sociaux
    2. **Moyenne** (150 mots): Pour Amazon KDP
    3. **Longue** (300 mots): Pour site web personnel
    
    Chaque bio doit :
    - Être engageante et professionnelle
    - Mettre en avant l'expertise
    - Créer de la crédibilité
    - Inclure un ton chaleureux et accessible
    
    Présente les 3 versions clairement séparées.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generatePreface = async (title: string, chapters: Chapter[], audience: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const prompt = `Génère une préface engageante et professionnelle pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}

La préface doit:
- Accrocher le lecteur dès les premières lignes
- Expliquer pourquoi ce livre a été écrit
- Donner un aperçu de ce que le lecteur va apprendre/découvrir
- Créer de l'enthousiasme et de l'anticipation
- Faire environ 300-400 mots
- Être écrite de manière personnelle et authentique

Écris UNIQUEMENT la préface, sans titre ni commentaires.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generateConclusion = async (title: string, chapters: Chapter[], audience: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const prompt = `Génère une conclusion mémorable pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}

La conclusion doit:
- Résumer les points clés abordés
- Rappeler les enseignements principaux
- Motiver le lecteur à passer à l'action
- Laisser une impression durable et positive
- Remercier le lecteur pour son temps
- Faire environ 300-400 mots

Écris UNIQUEMENT la conclusion, sans titre ni commentaires.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generateEpilogue = async (title: string, chapters: Chapter[], audience: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const prompt = `Génère un épilogue touchant pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}

L'épilogue doit:
- Offrir une réflexion finale sur le sujet
- Partager une perspective personnelle ou une anecdote
- Ouvrir sur l'avenir ou donner de l'espoir
- Créer une connexion émotionnelle avec le lecteur
- Faire environ 200-300 mots

Écris UNIQUEMENT l'épilogue, sans titre ni commentaires.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const translateContent = async (content: string, targetLanguage: string) => {
    const prompt = `Traduis le texte suivant en ${targetLanguage}. Conserve le style, le ton et la mise en forme originale. Ne fais que traduire, sans ajouter de commentaires.

Texte à traduire:
${content}`;
    
    const translatedContent = await callGenerateContent('chapters_generated', prompt);
    return translatedContent;
  };

  const analyzeTextStatistics = async (text: string) => {
    const prompt = `Analyse ce texte et fournis des statistiques détaillées au format JSON:

${text.substring(0, 5000)}

Retourne UNIQUEMENT un objet JSON valide avec ces propriétés:
{
  "wordCount": nombre de mots,
  "sentenceCount": nombre de phrases,
  "paragraphCount": nombre de paragraphes,
  "avgWordsPerSentence": moyenne de mots par phrase,
  "readingTimeMinutes": temps de lecture estimé en minutes,
  "readabilityScore": score de lisibilité (0-100, 100 = très facile),
  "readabilityLevel": "Très facile" | "Facile" | "Moyen" | "Difficile" | "Très difficile",
  "vocabularyRichness": richesse du vocabulaire (0-100),
  "topKeywords": ["mot1", "mot2", "mot3", "mot4", "mot5"]
}`;
    
    const result = await callGenerateContent('chapters_generated', prompt);
    try {
      // Extract JSON from the response
      const jsonMatch = result?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse statistics:', e);
    }
    return null;
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
    generateBackCover,
    generatePricingStrategy,
    generateLaunchPlan,
    generateAuthorBio,
    generatePreface,
    generateConclusion,
    generateEpilogue,
    translateContent,
    analyzeTextStatistics
  };
};