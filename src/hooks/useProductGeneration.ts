import { useState } from 'react';
import { useOpenAIConfig } from './useOpenAIConfig';
import { toast } from 'sonner';

interface ProductSheet {
  title: string;
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
  "h2Section": {
    "title": "Découvrez ${productTitle}",
    "content": "Texte d'introduction de 150 mots environ présentant le produit de manière engageante"
  },
  "h3Section": {
    "title": "Pourquoi choisir ${productTitle} ?",
    "content": "Texte explicatif de 100 mots environ",
    "bulletPoints": [
      "Point clé 1 avec bénéfice concret",
      "Point clé 2 avec avantage pratique", 
      "Point clé 3 avec valeur ajoutée",
      "Point clé 4 avec différenciation"
    ]
  },
  "testimonial": "Témoignage réaliste d'un client satisfait de 2-3 phrases avec son prénom et profession",
  "whatItDoesFor": "Explication claire de ce que ce produit apporte concrètement à l'utilisateur en 2-3 phrases",
  "whereToFind": "Indications sur où acheter ou se procurer ce produit en 1-2 phrases",
  "faq": [
    {
      "question": "Question fréquente pertinente sur le produit ?",
      "answer": "Réponse claire et utile de 2-3 phrases"
    },
    {
      "question": "Autre question importante que se posent les clients ?", 
      "answer": "Réponse détaillée et rassurante de 2-3 phrases"
    }
  ],
  "characteristics": [
    "Caractéristique technique précise 1",
    "Caractéristique technique précise 2", 
    "Caractéristique technique précise 3",
    "Caractéristique technique précise 4",
    "Caractéristique technique précise 5"
  ]
}

Important:
- Le contenu doit être professionnel et crédible
- Les caractéristiques doivent être techniques et spécifiques au produit
- Le témoignage doit sembler authentique
- Adapte le contenu au type de produit (technologie, mode, maison, etc.)
- Évite les superlatifs excessifs`
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
        h2Section: {
          title: `Découvrez ${productTitle}`,
          content: `${productTitle} représente l'innovation dans sa catégorie. Ce produit combine qualité et performance pour offrir une expérience utilisateur exceptionnelle. Conçu avec les dernières technologies, il répond aux besoins les plus exigeants du marché moderne.`
        },
        h3Section: {
          title: `Pourquoi choisir ${productTitle} ?`,
          content: `Ce produit se distingue par sa conception soignée et ses fonctionnalités avancées qui garantissent une utilisation optimale au quotidien.`,
          bulletPoints: [
            'Design ergonomique pour un confort optimal',
            'Technologie de pointe intégrée',
            'Facilité d\'utilisation maximale',
            'Durabilité et fiabilité exceptionnelles'
          ]
        },
        testimonial: `"${productTitle} a vraiment changé ma façon de travailler. La qualité est au rendez-vous !" - Marie, Consultante`,
        whatItDoesFor: `${productTitle} améliore votre productivité au quotidien grâce à ses fonctionnalités avancées et son design pensé pour l'utilisateur. Il vous fait gagner du temps tout en offrant une qualité exceptionnelle.`,
        whereToFind: `Disponible chez les revendeurs agréés et sur les plateformes de vente en ligne spécialisées. Livraison rapide partout en France.`,
        faq: [
          {
            question: `Quelle est la garantie pour ${productTitle} ?`,
            answer: `Le produit bénéficie d'une garantie constructeur de 2 ans couvrant tous les défauts de fabrication. Un service client dédié est disponible pour vous accompagner.`
          },
          {
            question: `${productTitle} est-il facile à utiliser ?`,
            answer: `Absolument ! Le produit a été conçu pour être intuitif dès la première utilisation. Un guide de démarrage rapide est inclus pour vous aider.`
          }
        ],
        characteristics: [
          'Matériaux de qualité premium',
          'Design moderne et élégant', 
          'Performance optimisée',
          'Installation simple et rapide',
          'Compatible avec tous les standards'
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