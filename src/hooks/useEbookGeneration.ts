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
- Informatif et engageant
- Bien structuré avec des paragraphes
- Professionnel mais accessible
- Exactement 350 mots

Assure-toi que le contenu soit riche, détaillé et apporte une vraie valeur ajoutée au lecteur.`
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
            content: `Crée un plan détaillé d'ebook sur le sujet: "${ebookTitle}". 
            
            Génère:
            1. ${authorName ? `Garde le nom d'auteur: "${authorName}"` : 'Un nom d\'auteur approprié'}
            2. Une préface d'au moins 500 caractères ou 350 mots, engageante et professionnelle
            3. Exactement ${numberOfChapters} chapitres avec des titres accrocheurs
            4. 2-4 sous-chapitres pour chaque chapitre
            5. Une conclusion de 350 mots minimum

            Réponds uniquement au format JSON suivant:
            {
              "author": "Nom de l'auteur",
              "preface": "Préface complète...",
              "chapters": [
                {
                  "title": "Titre du chapitre 1",
                  "subChapters": ["Sous-chapitre 1", "Sous-chapitre 2"]
                }
              ],
              "conclusion": "Conclusion complète..."
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
      const planData = JSON.parse(data.choices[0].message.content);
      
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
      const result = JSON.parse(data.choices[0].message.content);
      
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
    generateEbookPlan,
    splitChapterAutomatically
  };
};