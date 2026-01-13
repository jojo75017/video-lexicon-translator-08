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

interface CharacterInfo {
  id: string;
  name: string;
  description: string;
  role?: string;
  referenceImageUrl?: string;
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
  narrativeFormat?: string,
  bookDescription?: string,
  genre?: string,
  characters?: CharacterInfo[],
  isDemo: boolean = false,
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateContent = async (actionType: string, prompt: string, additionalData?: any) => {
    // Hard stop in demo mode: prevents any premium generation, even if a user has an API key.
    if (isDemo) {
      toast.error("Fonction réservée aux abonnés", {
        description: "Souscrivez pour débloquer la génération complète (chapitres, SEO, couvertures, export, etc.).",
      });
      return null;
    }

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

  // Génère le contexte des personnages pour les prompts
  const getCharactersContext = () => {
    if (!characters || characters.length === 0) return '';
    
    const roleLabels: Record<string, string> = {
      'protagonist': 'Protagoniste',
      'antagonist': 'Antagoniste', 
      'sidekick': 'Acolyte',
      'mentor': 'Mentor',
      'love-interest': 'Intérêt amoureux',
      'secondary': 'Personnage secondaire'
    };
    
    const characterDescriptions = characters
      .filter(c => c.name && c.description)
      .map(c => {
        const role = c.role ? ` (${roleLabels[c.role] || c.role})` : '';
        const hasImage = c.referenceImageUrl ? ' [Image de référence disponible]' : '';
        return `- **${c.name}**${role}${hasImage}: ${c.description}`;
      })
      .join('\n');
    
    if (!characterDescriptions) return '';
    
    return `\n\n=== PERSONNAGES DU LIVRE (À UTILISER DE MANIÈRE COHÉRENTE) ===
${characterDescriptions}

INSTRUCTIONS POUR LES PERSONNAGES:
- Utilise EXACTEMENT les noms des personnages tels qu'ils sont définis ci-dessus
- Respecte scrupuleusement les descriptions physiques et psychologiques de chaque personnage
- Maintiens la cohérence des traits de caractère, motivations et particularités de chaque personnage
- Les personnages doivent agir de manière cohérente avec leur rôle (protagoniste, antagoniste, etc.)
- Fais référence aux personnages de manière naturelle dans le récit
=== FIN PERSONNAGES ===\n`;
  };

  const generateChapterContent = async (chapter: Chapter, wordsPerChapter: number = 350, synopsis?: string, chapterIndex?: number, totalChapters?: number, previousChapterSummary?: string) => {
    const contextLine = ebookTitle ? `\nCe chapitre fait partie de l'ebook intitulé "${ebookTitle}".` : '';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style d'écriture, la complexité des concepts et les exemples utilisés pour correspondre parfaitement à ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série.` : '';
    const styleLine = writingStyle ? `\nStyle d'écriture : ${writingStyle}. Adopte ce style dans ta rédaction.` : '';
    const lengthLine = chapterLength ? `\nLongueur souhaitée : ${chapterLength}.` : '';
    const detailLine = detailLevel ? `\nNiveau de détail : ${detailLevel}. Fournis un contenu avec ce niveau de détail.` : '';
    const toneLine = tone ? `\nTon : ${tone}. Utilise ce ton tout au long du texte.` : '';
    const narrativeLine = narrativeFormat ? `\nFormat de narration : ${narrativeFormat}.` : '';
    const genreLine = genre ? `\nGenre du livre : ${genre}.` : '';
    
    // Description du livre fournie par l'utilisateur
    const descriptionContext = bookDescription 
      ? `\n\n=== CONTEXTE DU LIVRE (INFORMATIONS À RESPECTER) ===\n${bookDescription}\n=== FIN CONTEXTE ===\n\nCe chapitre doit s'inscrire parfaitement dans ce contexte.` 
      : '';
    
    // Contexte des personnages
    const charactersContext = getCharactersContext();
    
    // Contexte de position dans le livre
    const positionContext = (chapterIndex !== undefined && totalChapters) 
      ? `\nCeci est le chapitre ${chapterIndex + 1} sur ${totalChapters}. ${chapterIndex === 0 ? 'C\'est le premier chapitre, introduis bien le sujet et pose les bases.' : ''} ${chapterIndex === totalChapters - 1 ? 'C\'est le dernier chapitre, prépare la conclusion et boucle l\'histoire.' : ''}` 
      : '';
    
    // Synopsis pour la cohérence globale
    const synopsisContext = synopsis 
      ? `\n\n=== SYNOPSIS DU LIVRE (à suivre impérativement pour la cohérence) ===\n${synopsis}\n=== FIN SYNOPSIS ===\n\nRespects strictement cette synopsis: utilise les mêmes personnages/concepts, le même vocabulaire, et assure-toi que ce chapitre s'inscrit dans la progression narrative définie.` 
      : '';
    
    // Résumé du chapitre précédent pour la continuité
    const previousContext = previousChapterSummary 
      ? `\n\nRésumé du chapitre précédent (pour assurer la continuité):\n${previousChapterSummary}\n\nAssure une transition fluide depuis ce qui précède.` 
      : '';
    
    const prompt = `Tu es un auteur expert. Rédige un chapitre complet d'environ ${wordsPerChapter} mots sur le sujet : "${chapter.title}".${contextLine}${audienceLine}${tomeLine}${genreLine}${styleLine}${lengthLine}${detailLine}${toneLine}${narrativeLine}${positionContext}${descriptionContext}${charactersContext}${synopsisContext}${previousContext}
    
INSTRUCTIONS CRITIQUES:
- Le contenu doit être informatif, engageant et COHÉRENT avec l'ensemble du livre
- Adapte parfaitement le vocabulaire et le ton au public cible
- Structure bien le texte avec des paragraphes distincts
- Utilise l'*italique* pour les mots/phrases importantes
- Fais référence aux éléments établis précédemment si pertinent
- ${bookDescription ? 'RESPECTE LE CONTEXTE DU LIVRE fourni ci-dessus' : 'Sois créatif tout en restant cohérent'}
- ${characters && characters.length > 0 ? 'UTILISE LES PERSONNAGES définis ci-dessus de manière cohérente et fidèle à leurs descriptions' : ''}

Rédige directement le contenu du chapitre, sans titre ni numérotation.`;

    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generateSubChapterContent = async (subChapter: SubChapter, wordsPerSubChapter: number = 200, synopsis?: string, parentChapterTitle?: string) => {
    const contextLine = ebookTitle ? `\nCe sous-chapitre fait partie de l'ebook intitulé "${ebookTitle}" et du chapitre "${parentChapterTitle || 'non spécifié'}".` : '';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}. Adapte le vocabulaire, le style d'écriture et les exemples pour ce public.` : '';
    const tomeLine = tomeNumber ? `\nCeci est le Tome ${tomeNumber} d'une série. Maintiens la cohérence avec les tomes précédents.` : '';
    const styleLine = writingStyle ? `\nStyle d'écriture : ${writingStyle}.` : '';
    const detailLine = detailLevel ? `\nNiveau de détail : ${detailLevel}.` : '';
    const toneLine = tone ? `\nTon : ${tone}.` : '';
    const narrativeLine = narrativeFormat ? `\nFormat de narration : ${narrativeFormat}.` : '';
    
    // Contexte des personnages
    const charactersContext = getCharactersContext();
    
    const synopsisContext = synopsis 
      ? `\n\n=== SYNOPSIS DU LIVRE ===\n${synopsis}\n=== FIN SYNOPSIS ===\n\nRespects strictement cette synopsis pour la cohérence globale.` 
      : '';
    
    const prompt = `Rédige le contenu pour le sous-chapitre : "${subChapter.title}".${contextLine}${audienceLine}${tomeLine}${styleLine}${detailLine}${toneLine}${narrativeLine}${charactersContext}${synopsisContext}
    
Le contenu doit faire environ ${wordsPerSubChapter} mots et être :
- Informatif et pertinent
- COHÉRENT avec la synopsis globale du livre
- Parfaitement adapté au public cible (vocabulaire, ton, exemples)
- Bien structuré
- Engageant pour le lecteur
- Utiliser l'italique (*) pour les points importants
${characters && characters.length > 0 ? '- UTILISER LES PERSONNAGES définis de manière cohérente et fidèle à leurs descriptions' : ''}`;

    const content = await callGenerateContent('subchapters_generated', prompt);
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
    const genreLine = genre ? `\nGenre/Catégorie : ${genre}.` : '';
    
    // Description fournie par l'utilisateur - CRUCIAL pour la cohérence
    const descriptionContext = bookDescription ? `

=== DESCRIPTION DU LIVRE (INFORMATIONS CRUCIALES À RESPECTER) ===
${bookDescription}
=== FIN DESCRIPTION ===

IMPORTANT: Le plan DOIT correspondre exactement à cette description. Utilise les éléments mentionnés (personnages, lieux, intrigue, thèmes) comme base pour structurer les chapitres.` : '';
    
    const prompt = `Tu es un auteur expert en création de livres. Crée un plan détaillé et COHÉRENT pour un ebook intitulé "${ebookTitle}" par ${authorName || 'l\'auteur'}.

${audienceInstructions}${tomeLine}${styleLine}${toneLine}${genreLine}${descriptionContext}

INSTRUCTIONS CRITIQUES:
1. Le contenu DOIT être parfaitement adapté au public cible
2. Les titres de chapitres doivent former une progression logique et narrative
3. Chaque chapitre doit avoir un objectif clair et s'enchaîner naturellement avec le suivant
4. Les sous-chapitres doivent détailler le contenu de manière cohérente
5. ${bookDescription ? 'RESPECTE IMPÉRATIVEMENT la description fournie ci-dessus' : 'Crée une structure originale et engageante basée sur le titre'}

Le plan doit contenir exactement ${numberOfChapters} chapitres principaux.

Format JSON attendu (réponds UNIQUEMENT avec le JSON, sans texte additionnel):
{
  "preface": "Une préface captivante de 150-200 mots qui présente le livre, son contexte, et donne envie de lire. Personnalisée selon le genre et le sujet.",
  "chapters": [
    {
      "title": "Titre du chapitre 1 (clair et engageant)",
      "subChapters": [
        "Sous-chapitre 1.1 (détaillé)",
        "Sous-chapitre 1.2 (détaillé)"
      ]
    }
  ],
  "conclusion": "Une conclusion percutante de 100-150 mots adaptée au genre et au public"
}`;

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

  // Génère une synopsis détaillée pour assurer la cohérence de tout l'ebook
  const generateBookSynopsis = async (title: string, chapters: Chapter[], audience: string) => {
    const chapterTitles = chapters.map((c, i) => `${i + 1}. ${c.title}`).join('\n');
    const subChaptersList = chapters.map((c, i) => 
      c.subChapters.map((sub, j) => `  ${i + 1}.${j + 1} ${sub.title}`).join('\n')
    ).join('\n');
    
    const styleLine = writingStyle ? `Style d'écriture: ${writingStyle}` : '';
    const toneLine = tone ? `Ton: ${tone}` : '';
    const narrativeLine = narrativeFormat ? `Format de narration: ${narrativeFormat}` : '';
    const genreLine = genre ? `Genre: ${genre}` : '';
    
    // Description fournie par l'utilisateur
    const descriptionContext = bookDescription 
      ? `\n\n=== DESCRIPTION FOURNIE PAR L'AUTEUR (À RESPECTER IMPÉRATIVEMENT) ===\n${bookDescription}\n=== FIN DESCRIPTION ===\n\nCette description doit être la BASE de toute la synopsis. Reprends les éléments mentionnés (personnages, lieux, intrigue, thèmes) et développe-les.` 
      : '';
    
    const prompt = `Tu es un éditeur expert. Crée une SYNOPSIS DÉTAILLÉE pour l'ebook "${title}" qui servira de fil conducteur pour TOUTE la rédaction.

Public cible: ${audience}
${genreLine}
${styleLine}
${toneLine}
${narrativeLine}
${descriptionContext}

Structure du livre:
${chapterTitles}

Sous-chapitres:
${subChaptersList}

La synopsis DOIT définir PRÉCISÉMENT:
1. Le THÈME CENTRAL et le message principal du livre
2. Le FIL CONDUCTEUR narratif qui relie TOUS les chapitres de manière logique
3. La PROGRESSION: comment chaque chapitre s'enchaîne avec le suivant
4. Les PERSONNAGES/CONCEPTS CLÉS récurrents avec leurs noms et caractéristiques exactes
5. Le VOCABULAIRE SPÉCIFIQUE à utiliser de manière cohérente partout
6. L'ARC NARRATIF complet: situation initiale → développement → climax → résolution
7. Les ÉLÉMENTS À RAPPELER entre les chapitres (références croisées, running gags, thèmes récurrents)

${bookDescription ? 'IMPORTANT: Respecte la description fournie par l\'auteur comme base principale.' : 'Sois créatif mais cohérent.'}

Cette synopsis sera utilisée pour garantir que la préface, tous les chapitres, la conclusion et l'épilogue forment un ensemble parfaitement cohérent.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
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

  const generatePreface = async (title: string, chapters: Chapter[], audience: string, synopsis?: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const synopsisContext = synopsis 
      ? `\n\n=== SYNOPSIS DU LIVRE (à suivre impérativement) ===\n${synopsis}\n=== FIN SYNOPSIS ===\n\nLa préface DOIT être cohérente avec cette synopsis. Utilise le même vocabulaire, les mêmes thèmes et annonce l'arc narratif défini.` 
      : '';
    
    const prompt = `Génère une préface engageante et professionnelle pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}${synopsisContext}

La préface doit:
- Accrocher le lecteur dès les premières lignes
- Expliquer pourquoi ce livre a été écrit
- Donner un aperçu de ce que le lecteur va apprendre/découvrir
- ANNONCER les thèmes et le fil conducteur définis dans la synopsis
- Créer de l'enthousiasme et de l'anticipation
- Faire environ 300-400 mots
- Être écrite de manière personnelle et authentique

Écris UNIQUEMENT la préface, sans titre ni commentaires.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generateConclusion = async (title: string, chapters: Chapter[], audience: string, synopsis?: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const synopsisContext = synopsis 
      ? `\n\n=== SYNOPSIS DU LIVRE ===\n${synopsis}\n=== FIN SYNOPSIS ===\n\nLa conclusion DOIT reprendre et conclure le fil conducteur établi dans la synopsis. Rappelle les éléments clés et les personnages/concepts introduits.` 
      : '';
    
    const prompt = `Génère une conclusion mémorable pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}${synopsisContext}

La conclusion doit:
- Résumer les points clés abordés EN COHÉRENCE avec la synopsis
- Rappeler les enseignements principaux et le fil conducteur
- Motiver le lecteur à passer à l'action
- Laisser une impression durable et positive
- Remercier le lecteur pour son temps
- Faire environ 300-400 mots

Écris UNIQUEMENT la conclusion, sans titre ni commentaires.`;
    
    const content = await callGenerateContent('chapters_generated', prompt);
    return content;
  };

  const generateEpilogue = async (title: string, chapters: Chapter[], audience: string, synopsis?: string) => {
    const chapterTitles = chapters.map(c => c.title).join(', ');
    const synopsisContext = synopsis 
      ? `\n\n=== SYNOPSIS DU LIVRE ===\n${synopsis}\n=== FIN SYNOPSIS ===\n\nL'épilogue DOIT s'inscrire dans la continuité du fil conducteur et clôturer l'arc narratif défini dans la synopsis.` 
      : '';
    
    const prompt = `Génère un épilogue touchant pour un ebook intitulé "${title}".

Public cible: ${audience}
Chapitres du livre: ${chapterTitles}${synopsisContext}

L'épilogue doit:
- Offrir une réflexion finale sur le sujet EN LIEN avec la synopsis
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

  const generateAPlusContent = async (title: string, authorName: string, chapters: Chapter[], bookSummary?: string) => {
    const chaptersText = chapters.map(c => c.title).join(', ');
    const summaryContext = bookSummary ? `\nRésumé du livre : ${bookSummary}` : '';
    
    const prompt = `Tu es un expert en création de contenu A+ Amazon (Enhanced Brand Content).

CONTEXTE DU LIVRE :
- Titre : "${title}"
- Auteur : ${authorName || 'Non spécifié'}
- Chapitres : ${chaptersText}${summaryContext}

MISSION : Génère un contenu A+ complet et COHÉRENT pour ce livre. Tous les textes doivent :
- Utiliser le même ton et style
- Faire référence aux mêmes thèmes et points clés
- Se compléter sans redondance
- Créer une progression logique pour convaincre l'acheteur

Réponds UNIQUEMENT avec ce format JSON (pas de texte avant/après) :
{
  "brand_story": {
    "headline": "Titre accrocheur de la marque/auteur (max 60 car.)",
    "body": "Histoire de l'auteur et sa mission en 150 mots max. Pourquoi ce livre existe."
  },
  "hero_module": {
    "headline": "Accroche principale du livre (max 50 car.)",
    "body": "Proposition de valeur unique en 100 mots. Qu'apporte ce livre au lecteur ?"
  },
  "key_features": [
    {
      "icon_suggestion": "📖",
      "title": "Caractéristique 1 (max 30 car.)",
      "description": "Description en 50 mots max"
    },
    {
      "icon_suggestion": "✨",
      "title": "Caractéristique 2 (max 30 car.)",
      "description": "Description en 50 mots max"
    },
    {
      "icon_suggestion": "🎯",
      "title": "Caractéristique 3 (max 30 car.)",
      "description": "Description en 50 mots max"
    },
    {
      "icon_suggestion": "💡",
      "title": "Caractéristique 4 (max 30 car.)",
      "description": "Description en 50 mots max"
    }
  ],
  "comparison_chart": {
    "title": "Ce que vous trouverez dans ce livre",
    "items": [
      {"feature": "Aspect 1", "included": true, "detail": "Détail court"},
      {"feature": "Aspect 2", "included": true, "detail": "Détail court"},
      {"feature": "Aspect 3", "included": true, "detail": "Détail court"},
      {"feature": "Aspect 4", "included": true, "detail": "Détail court"},
      {"feature": "Aspect 5", "included": true, "detail": "Détail court"}
    ]
  },
  "ideal_reader": {
    "headline": "Ce livre est fait pour vous si...",
    "points": [
      "Profil lecteur idéal 1",
      "Profil lecteur idéal 2",
      "Profil lecteur idéal 3",
      "Profil lecteur idéal 4"
    ]
  },
  "testimonial_templates": [
    {
      "quote": "Citation fictive de lecteur satisfait (style authentique)",
      "attribution": "Type de lecteur"
    },
    {
      "quote": "Deuxième citation de style différent",
      "attribution": "Type de lecteur"
    }
  ],
  "call_to_action": {
    "headline": "Prêt à commencer votre lecture ?",
    "body": "Texte d'incitation à l'achat en 50 mots max",
    "button_text": "Texte du bouton (max 20 car.)"
  }
}

IMPORTANT : Tous les modules doivent être cohérents entre eux et refléter fidèlement le contenu réel du livre.`;

    const content = await callGenerateContent('chapters_generated', prompt);
    
    if (content) {
      try {
        let clean = content.trim().replace(/```json\s*|```/g, '').trim();
        const match = clean.match(/\{[\s\S]*\}/);
        const jsonText = match ? match[0] : clean;
        return JSON.parse(jsonText);
      } catch (e) {
        console.error('Error parsing A+ content JSON:', e);
        return null;
      }
    }
    return null;
  };

  return {
    isGenerating,
    generateChapterContent,
    generateSubChapterContent,
    generateEbookPlan,
    generateBookSummary,
    generateBookSynopsis,
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
    analyzeTextStatistics,
    generateAPlusContent
  };
};