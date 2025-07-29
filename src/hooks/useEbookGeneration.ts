import { useState } from 'react';
import { toast } from 'sonner';

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

  const generateChapterContent = async (chapter: Chapter, apiKey: string) => {
    if (!chapter.title || !apiKey) {
      toast.error('Titre du chapitre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Rédige un chapitre complet de 350 mots exactement sur le sujet : "${chapter.title}".
            
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 350 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent
- Technique et détaillé quand approprié

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      toast.success('Chapitre généré avec succès !');
      return content;

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération. Vérifiez votre clé API.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSubChapterContent = async (subChapter: SubChapter, apiKey: string) => {
    if (!subChapter.title || !apiKey) {
      toast.error('Titre du sous-chapitre et clé API requis');
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Rédige un sous-chapitre complet de 300 mots exactement sur le sujet : "${subChapter.title}".
            
Le contenu doit être :
- Informatif et engageant sur le sujet donné
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 300 mots
- Inclure des mots ou phrases importantes en *italique* pour mettre l'accent
- Technique et détaillé quand approprié

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée aux lecteurs sur ce sujet spécifique.`
          }],
          temperature: 0.7,
          max_tokens: 350
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      toast.success('Sous-chapitre généré avec succès !');
      return content;

    } catch (error) {
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Crée un plan détaillé d'ebook sur le sujet: "${ebookTitle}" spécifiquement axé sur l'AQUARIOPHILIE. 
            
            Génère:
            1. ${authorName ? `Garde le nom d'auteur: "${authorName}"` : 'Un nom d\'auteur approprié'}
            2. Une préface d'au moins 500 caractères sur l'aquariophilie, engageante et professionnelle
            3. Exactement ${numberOfChapters} chapitres avec des titres liés à l'aquariophilie
            4. 2-4 sous-chapitres pour chaque chapitre, tous liés à l'aquariophilie
            5. Une conclusion sur l'aquariophilie de 350 mots minimum

            IMPORTANT: Tous les titres et contenus doivent être liés à l'aquariophilie : poissons, plantes aquatiques, équipements d'aquarium, entretien, soins, paramètres de l'eau, etc.

            Réponds uniquement au format JSON suivant (SANS balises markdown):
            {
              "author": "Nom de l'auteur",
              "preface": "Préface complète sur l'aquariophilie...",
              "chapters": [
                {
                  "title": "Titre du chapitre lié à l'aquariophilie",
                  "subChapters": ["Sous-chapitre aquariophilie 1", "Sous-chapitre aquariophilie 2"]
                }
              ],
              "conclusion": "Conclusion complète sur l'aquariophilie..."
            }`
          }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Nettoyer le contenu pour enlever les balises markdown
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const planData = JSON.parse(cleanContent);
      
      toast.success('Plan d\'ebook généré automatiquement !');
      return planData;

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la génération. Veuillez vérifier votre clé API OpenAI.');
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Analyse ce contenu de chapitre et propose une division logique en sous-chapitres :

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
}`
          }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Nettoyer le contenu pour enlever les balises markdown
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanContent);
      
      const newSubChapters = result.subChapters.map((sub: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: sub.title,
        content: sub.content
      }));

      toast.success(`Chapitre divisé en ${newSubChapters.length} sous-chapitres !`);
      return newSubChapters;

    } catch (error) {
      toast.error('Erreur lors de la division automatique');
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
    splitChapterAutomatically
  };
};