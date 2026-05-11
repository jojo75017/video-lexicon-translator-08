import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { callGemini, callGeminiJSON, extractKeywordsFromText } from '@/services/geminiService';

// Récupère la clé Gemini de l'abonné depuis le localStorage (BYOK).
const getGeminiKey = (fallback?: string) => {
  const local = (typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : '') || '';
  const key = (local || fallback || '').trim();
  return key;
};

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

    const geminiKey = getGeminiKey(apiKey);
    if (!geminiKey) {
      toast.error('Clé API Gemini requise', {
        description: 'Renseignez votre clé Gemini (commence par AIza) dans les paramètres.',
      });
      return null;
    }
    if (!geminiKey.startsWith('AIza')) {
      toast.error('Clé API invalide', {
        description: 'Cette application utilise Gemini. Votre clé doit commencer par "AIza".',
      });
      return null;
    }

    setIsGenerating(true);

    try {
      console.log('[useSubscriptionGeneration] Calling Gemini for action:', actionType);
      const content = await callGemini(geminiKey, prompt, {
        systemPrompt: 'Vous êtes un expert en création de contenu pour ebooks. Répondez en français avec un contenu de haute qualité, bien structuré et engageant.',
        temperature: 0.7,
        maxTokens: 8192,
      });

      if (!content || content.trim().length === 0) {
        toast.error('Erreur lors de la génération du contenu', {
          description: 'Réponse vide de l\'IA. Vérifiez votre clé Gemini ou réessayez.',
        });
        return null;
      }

      return content;
    } catch (error: any) {
      console.error('Generation error:', error);
      const msg = error?.message || 'Erreur lors de la génération';
      toast.error('Erreur lors de la génération du contenu', { description: msg });
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
    // Mapper chapterLength vers des contraintes concrètes de mots
    const lengthMultipliers: Record<string, number> = { 'court': 0.7, 'moyen': 1, 'long': 1.4, 'très long': 1.8 };
    const lengthMultiplier = chapterLength ? (lengthMultipliers[chapterLength] || 1) : 1;
    const effectiveWordCount = Math.round(wordsPerChapter * lengthMultiplier);
    const lengthLine = chapterLength ? `\nLongueur souhaitée : ${chapterLength} (${effectiveWordCount} mots MINIMUM ABSOLU).` : '';
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
    
    const finalWordTarget = chapterLength ? effectiveWordCount : wordsPerChapter;
    const prompt = `Tu es un auteur expert. Rédige un chapitre complet de MINIMUM ${finalWordTarget} mots sur le sujet : "${chapter.title}".${contextLine}${audienceLine}${tomeLine}${genreLine}${styleLine}${lengthLine}${detailLine}${toneLine}${narrativeLine}${positionContext}${descriptionContext}${charactersContext}${synopsisContext}${previousContext}
    
⚠️ CONTRAINTE DE LONGUEUR ABSOLUE:
- Ce chapitre DOIT contenir AU MINIMUM ${finalWordTarget} mots.
- Si tu n'atteins pas ${finalWordTarget} mots, développe davantage avec plus d'exemples, de détails, de dialogues et d'explications.
- Ne termine PAS le chapitre avant d'avoir atteint cet objectif de mots.
- Compte tes mots pendant la rédaction.

INSTRUCTIONS CRITIQUES:
- Le contenu doit être informatif, engageant et COHÉRENT avec l'ensemble du livre
- Adapte parfaitement le vocabulaire et le ton au public cible
- Structure bien le texte avec des paragraphes distincts
- Utilise l'*italique* pour les mots/phrases importantes
- Fais référence aux éléments établis précédemment si pertinent
- ${bookDescription ? 'RESPECTE LE CONTEXTE DU LIVRE fourni ci-dessus' : 'Sois créatif tout en restant cohérent'}
- ${characters && characters.length > 0 ? 'UTILISE LES PERSONNAGES définis ci-dessus de manière cohérente et fidèle à leurs descriptions' : ''}

⚠️ RAPPEL FINAL: Le chapitre DOIT faire AU MINIMUM ${finalWordTarget} mots. Ne termine pas avant d'avoir atteint cet objectif.

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
    
⚠️ CONTRAINTE DE LONGUEUR ABSOLUE:
- Ce sous-chapitre DOIT contenir AU MINIMUM ${wordsPerSubChapter} mots.
- Ne termine PAS avant d'avoir atteint cet objectif.

Le contenu doit être :
- Informatif et pertinent
- COHÉRENT avec la synopsis globale du livre
- Parfaitement adapté au public cible (vocabulaire, ton, exemples)
- Bien structuré avec des paragraphes développés
- Engageant pour le lecteur
- Utiliser l'italique (*) pour les points importants
${characters && characters.length > 0 ? '- UTILISER LES PERSONNAGES définis de manière cohérente et fidèle à leurs descriptions' : ''}

⚠️ RAPPEL: MINIMUM ${wordsPerSubChapter} mots obligatoire.`;

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
4. Ne crée AUCUN sous-chapitre : l'ebook simple doit contenir uniquement des chapitres principaux
5. ${bookDescription ? 'RESPECTE IMPÉRATIVEMENT la description fournie ci-dessus' : 'Crée une structure originale et engageante basée sur le titre'}

Le plan doit contenir exactement ${numberOfChapters} chapitres principaux.

Format JSON attendu (réponds UNIQUEMENT avec le JSON, sans texte additionnel):
{
  "preface": "Une préface captivante de 150-200 mots qui présente le livre, son contexte, et donne envie de lire. Personnalisée selon le genre et le sujet.",
  "chapters": [
    {
      "title": "Titre du chapitre 1 (clair et engageant)",
      "subChapters": []
    }
  ],
  "conclusion": "Une conclusion percutante de 100-150 mots adaptée au genre et au public"
}`;

    const content = await callGenerateContent('ebook_plans_generated', prompt);
    
    if (content) {
      try {
        // Nettoyer le contenu pour enlever les balises markdown
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed: { chapters?: Array<Record<string, unknown>> } & Record<string, unknown> = JSON.parse(cleanContent);
        if (Array.isArray(parsed?.chapters)) {
          parsed.chapters = parsed.chapters.map((chapter) => ({
            ...chapter,
            subChapters: [],
          }));
        }
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
    const key = getGeminiKey(apiKey);
    if (!key || !key.startsWith('AIza')) {
      toast.error('Clé API Gemini manquante', { description: 'Ajoute ta clé Gemini (commençant par AIza) dans Paramètres.' });
      return null;
    }
    const chaptersText = chapters.map(c => c.title).join(', ') || '(pas de chapitres définis)';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}.` : '';
    const genreLine = genre ? `\nGenre : ${genre}.` : '';
    const summaryLine = bookDescription ? `\nRésumé / contexte du livre : ${bookDescription}` : '';
    const prompt = `Tu es un copywriter expert Amazon KDP. Rédige une description Amazon KDP percutante pour le livre "${title}".${audienceLine}${genreLine}${summaryLine}
Chapitres principaux : ${chaptersText}.

Contraintes :
- Maximum 1900 caractères (limite Amazon : 2000, garde de la marge).
- Ouvre par un HOOK qui interpelle directement le lecteur (1-2 phrases).
- Présente le PROBLÈME que le livre résout, puis la PROMESSE.
- Liste 4 à 6 BÉNÉFICES concrets sous forme de bullet points (utilise • en début de ligne).
- Termine par un APPEL À L'ACTION clair.
- Ton : professionnel, persuasif, sans superlatifs creux ("révolutionnaire", "incroyable").
- Pas de markdown, pas de balises HTML, pas de guillemets autour de la description.
- Réponds UNIQUEMENT par le texte de la description, sans introduction.`;

    setIsGenerating(true);
    try {
      const content = await callGemini(key, prompt, { maxTokens: 4000, temperature: 0.7 });
      return (content || '').trim();
    } catch (e: any) {
      console.error('[KDP description] error', e);
      toast.error(e?.message || 'Erreur lors de la génération de la description KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKDPKeywords = async (title: string, chapters: Chapter[]) => {
    const key = getGeminiKey(apiKey);
    if (!key || !key.startsWith('AIza')) {
      toast.error('Clé API Gemini manquante', { description: 'Ajoute ta clé Gemini (commençant par AIza) dans Paramètres.' });
      return null;
    }
    const chaptersText = chapters.map(c => c.title).join(', ') || '(pas de chapitres définis)';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}.` : '';
    const genreLine = genre ? `\nGenre : ${genre}.` : '';
    const prompt = `Tu es un expert SEO Amazon KDP / algorithme A9.
Génère EXACTEMENT 7 mots-clés Amazon KDP pour le livre "${title}".${audienceLine}${genreLine}
Chapitres : ${chaptersText}.

Règles strictes :
- Chaque mot-clé : maximum 50 caractères, en français.
- Mélange de courte et longue traîne (expressions de 2 à 5 mots).
- Pertinents pour la recherche Amazon, pas de répétition exacte du titre.
- Pas de marques déposées, pas de noms d'auteurs concurrents.

Réponds UNIQUEMENT par un tableau JSON valide (aucun texte avant/après) :
[
  { "keyword": "exemple mot clé", "chars": 17, "relevance": "haute", "tip": "pourquoi ce mot-clé est efficace pour A9" }
]
Les niveaux de "relevance" autorisés : "haute", "moyenne", "faible".`;

    setIsGenerating(true);
    try {
      const raw = await callGeminiJSON<any>(key, prompt, { maxTokens: 3000, temperature: 0.6 });
      // Normalisation : accepte string[] ou objet
      const arr = Array.isArray(raw) ? raw : (Array.isArray((raw as any)?.keywords) ? (raw as any).keywords : []);
      const normalized = arr.slice(0, 7).map((k: any) => {
        if (typeof k === 'string') {
          return { keyword: k.trim(), chars: k.trim().length, relevance: 'moyenne', tip: '' };
        }
        const kw = (k?.keyword || k?.mot || k?.term || '').toString().trim();
        return {
          keyword: kw,
          chars: typeof k?.chars === 'number' ? k.chars : kw.length,
          relevance: k?.relevance || 'moyenne',
          tip: k?.tip || k?.conseil || '',
        };
      }).filter((k: any) => k.keyword);
      if (!normalized.length) {
        toast.error('Aucun mot-clé exploitable n\'a été retourné par Gemini.');
        return null;
      }
      return normalized;
    } catch (e: any) {
      console.error('[KDP keywords] error', e);
      toast.error(e?.message || 'Erreur lors de la génération des mots-clés KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateKDPCategories = async (title: string, chapters: Chapter[]) => {
    const key = getGeminiKey(apiKey);
    if (!key || !key.startsWith('AIza')) {
      toast.error('Clé API Gemini manquante', { description: 'Ajoute ta clé Gemini (commençant par AIza) dans Paramètres.' });
      return null;
    }
    const chaptersText = chapters.map(c => c.title).join(', ') || '(pas de chapitres définis)';
    const audienceLine = targetAudience ? `\nPublic cible : ${targetAudience}.` : '';
    const genreLine = genre ? `\nGenre : ${genre}.` : '';
    const prompt = `Tu es un expert catégories Amazon KDP / BISAC.
Suggère les 5 meilleures catégories Amazon KDP (FR) pour le livre "${title}".${audienceLine}${genreLine}
Chapitres : ${chaptersText}.

Pour chaque catégorie :
- Chemin BISAC complet (ex: "Livres > Développement personnel > Gestion du stress").
- Niveau de concurrence estimé.
- Estimation grossière du nombre de livres en compétition.
- Recommandation stratégique courte.
- Potentiel de classement.

Réponds UNIQUEMENT par un tableau JSON valide (aucun texte avant/après) :
[
  {
    "category": "Livres > X > Y",
    "competition": "faible",
    "books_estimate": "500-1000",
    "recommendation": "Niche peu concurrentielle, bon angle pour démarrer.",
    "ranking_potential": "Top 100 atteignable"
  }
]
Valeurs autorisées pour "competition" : "faible", "moyenne", "élevée", "très élevée".`;

    setIsGenerating(true);
    try {
      const raw = await callGeminiJSON<any>(key, prompt, { maxTokens: 3000, temperature: 0.6 });
      const arr = Array.isArray(raw) ? raw : (Array.isArray((raw as any)?.categories) ? (raw as any).categories : []);
      const normalized = arr.slice(0, 5).map((c: any) => {
        if (typeof c === 'string') return { category: c };
        return {
          category: c?.category || c?.path || c?.name || '',
          competition: c?.competition || '',
          books_estimate: c?.books_estimate || c?.estimate || '',
          recommendation: c?.recommendation || c?.tip || '',
          ranking_potential: c?.ranking_potential || c?.potential || '',
        };
      }).filter((c: any) => c.category);
      if (!normalized.length) {
        toast.error('Aucune catégorie exploitable n\'a été retournée par Gemini.');
        return null;
      }
      return normalized;
    } catch (e: any) {
      console.error('[KDP categories] error', e);
      toast.error(e?.message || 'Erreur lors de la génération des catégories KDP');
      return null;
    } finally {
      setIsGenerating(false);
    }
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
      "quote": "Modèle de témoignage à demander à un vrai lecteur (style authentique, à personnaliser).",
      "attribution": "Type de lecteur cible (ex: Lectrice de 35 ans, entrepreneure)"
    },
    {
      "quote": "Deuxième modèle de témoignage à recueillir auprès d'un beta-lecteur réel.",
      "attribution": "Autre profil de lecteur cible"
    }
  ],
  "call_to_action": {
    "headline": "Prêt à commencer votre lecture ?",
    "body": "Texte d'incitation à l'achat en 50 mots max",
    "button_text": "Texte du bouton (max 20 car.)"
  }
}

IMPORTANT :
- Tous les modules doivent être cohérents entre eux et refléter fidèlement le contenu réel du livre.
- Les "testimonial_templates" sont des MODÈLES à faire remplir par de vrais lecteurs : ne jamais les présenter comme des avis réels. Indique clairement par le style qu'il s'agit d'exemples à personnaliser.`;

    const key = getGeminiKey(apiKey);
    if (!key || !key.startsWith('AIza')) {
      toast.error('Clé API Gemini manquante', { description: 'Ajoute ta clé Gemini (commençant par AIza) dans Paramètres.' });
      return null;
    }
    setIsGenerating(true);
    try {
      const content = await callGemini(key, prompt, { maxTokens: 8000, temperature: 0.7 });
      let clean = (content || '').trim().replace(/```json\s*|```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      const jsonText = match ? match[0] : clean;
      const parsed = JSON.parse(jsonText);
      // Validation minimale
      if (!parsed?.brand_story || !parsed?.hero_module || !Array.isArray(parsed?.key_features)) {
        toast.error('Le contenu A+ retourné est incomplet. Réessaie.');
        return null;
      }
      return parsed;
    } catch (e: any) {
      console.error('[A+ content] error', e);
      toast.error(e?.message || 'Erreur lors de la génération du contenu A+');
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