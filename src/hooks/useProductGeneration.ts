import { useState } from 'react';
import { useOpenAIConfig } from './useOpenAIConfig';
import { toast } from 'sonner';

interface ProductSheet {
  title: string;
  shortDescription: string;
  h2Section: { title: string; content: string };
  h3Section: { title: string; content: string; bulletPoints: string[] };
  testimonial: string;
  whatItDoesFor: string;
  whereToFind: string;
  faq: { question: string; answer: string }[];
  characteristics: string[];
}

export const useProductGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductSheet | null>(null);
  const { hasValidApiKey, getConfig } = useOpenAIConfig();

  const generateProductSheet = async (productTitle: string) => {
    if (!hasValidApiKey()) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      return;
    }

    const config = getConfig();

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en marketing produit. Réponds uniquement avec du JSON valide.'
            },
            {
              role: 'user',
              content: `Génère une fiche produit complète pour "${productTitle}". 

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "${productTitle}",
  "shortDescription": "Description courte de 2 lignes maximum décrivant l'essentiel du produit de manière factuelle",
  "h2Section": {
    "title": "Présentation de ${productTitle}",
    "content": "Description longue de 200 mots décrivant objectivement le produit, ses fonctions principales et son utilisation. Inclure un lien cliquable vers une page d'information avec cette syntaxe: <a href='https://example.com/info-produit' target='_blank'>Plus d'informations techniques</a>"
  },
  "h3Section": {
    "title": "Fonctionnalités principales",
    "content": "Texte de 80 mots décrivant les fonctions concrètes du produit",
    "bulletPoints": [
      "Fonction technique précise 1",
      "Fonction technique précise 2", 
      "Fonction technique précise 3",
      "Fonction technique précise 4"
    ]
  },
  "testimonial": "Avis factuel d'un utilisateur en 2 phrases courtes avec prénom et contexte d'usage",
  "whatItDoesFor": "Explication factuelle en 2 phrases de l'utilité concrète du produit",
  "whereToFind": "Information factuelle sur les lieux de vente ou d'achat en 1-2 phrases simples",
  "faq": [
    {
      "question": "Question technique pratique sur l'utilisation ?",
      "answer": "Réponse factuelle et précise en 2 phrases"
    },
    {
      "question": "Question sur la compatibilité ou installation ?", 
      "answer": "Réponse technique claire en 2 phrases"
    },
    {
      "question": "Question sur la maintenance ou support ?", 
      "answer": "Réponse pratique en 2 phrases"
    }
  ],
  "characteristics": [
    "Donnée technique mesurable (dimensions, poids, matériau, etc.)",
    "Spécification technique précise (puissance, capacité, etc.)", 
    "Norme ou certification technique",
    "Compatibilité technique factuelle",
    "Caractéristique physique mesurable"
  ]
}

IMPORTANT:
- Description courte: EXACTEMENT 2 lignes maximum
- Description longue: 200 mots avec un lien cliquable obligatoire
- FAQ: EXACTEMENT 3 questions
- ZERO marketing, ZERO superlatifs
- Les caractéristiques doivent être UNIQUEMENT des données techniques FACTUELLES
- Contenu informatif et objectif uniquement
- Adapte les specs techniques au type de produit réel`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Pas de contenu dans la réponse');
      }

      const jsonResponse = JSON.parse(content);

      if (jsonResponse && typeof jsonResponse === 'object') {
        // Vérifier que la description longue fait bien environ 500 mots
        const wordCount = jsonResponse.longDescription.replace(/<[^>]*>/g, '').split(/\s+/).length;
        console.log(`Description générée: ${wordCount} mots`);
        
        setResult(jsonResponse);
        toast.success('Fiche produit générée avec succès!');
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération de la fiche produit');
      
      // Fallback avec données d'exemple
      setResult({
        title: productTitle,
        shortDescription: `${productTitle} est un produit conçu pour répondre à des besoins spécifiques d'utilisation.
Il intègre des composants sélectionnés pour assurer son fonctionnement selon les standards établis.`,
        h2Section: {
          title: `Présentation de ${productTitle}`,
          content: `${productTitle} est un produit conçu pour répondre à des besoins spécifiques. Il intègre des composants sélectionnés pour assurer son fonctionnement. Le produit est destiné à un usage défini et suit les standards de sa catégorie. Les matériaux utilisés respectent les normes en vigueur. Le processus de fabrication suit des procédures établies pour garantir la conformité. L'assemblage est réalisé selon des spécifications techniques précises. Le contrôle qualité vérifie le respect des critères définis. La documentation fournie détaille les conditions d'utilisation. Le produit s'intègre dans un environnement standard. <a href='https://example.com/specifications-techniques' target='_blank'>Consulter les spécifications techniques complètes</a> pour plus de détails sur les caractéristiques.`
        },
        h3Section: {
          title: `Fonctionnalités principales`,
          content: `Ce produit dispose de fonctions intégrées pour son utilisation standard. Les composants sont assemblés selon les spécifications techniques requises. Le système de contrôle intégré permet son fonctionnement normal.`,
          bulletPoints: [
            'Interface utilisateur standard',
            'Connectivité selon normes établies',
            'Mécanisme de fonctionnement adapté',
            'Système de contrôle intégré'
          ]
        },
        testimonial: `"J'utilise ${productTitle} depuis 6 mois dans mon travail quotidien. Il remplit sa fonction correctement." - Pierre, Technicien`,
        whatItDoesFor: `${productTitle} permet d'effectuer les tâches pour lesquelles il a été conçu. Il s'intègre dans un environnement de travail standard.`,
        whereToFind: `Disponible chez les distributeurs agréés et magasins spécialisés. Vente également possible en ligne sur les plateformes habituelles.`,
        faq: [
          {
            question: `Quelle est la durée de garantie de ${productTitle} ?`,
            answer: `Le produit est couvert par une garantie constructeur standard. Les conditions sont précisées dans la documentation fournie.`
          },
          {
            question: `${productTitle} nécessite-t-il une installation particulière ?`,
            answer: `L'installation suit une procédure standard. Un manuel d'utilisation détaille les étapes à suivre.`
          },
          {
            question: `Quel support technique est disponible pour ${productTitle} ?`,
            answer: `Un service technique est accessible pendant les heures ouvrables. Les coordonnées sont fournies dans la documentation produit.`
          }
        ],
        characteristics: [
          'Dimensions: selon spécifications standard',
          'Poids: conforme aux normes de transport', 
          'Matériaux: conformes aux réglementations',
          'Alimentation: selon standards électriques',
          'Température de fonctionnement: plage normale'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    generateProductSheet,
    loading,
    result
  };
};