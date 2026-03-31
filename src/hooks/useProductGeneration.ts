import { useState } from 'react';
import { useOpenAIConfig } from './useOpenAIConfig';
import { toast } from 'sonner';
import { callGemini, callGeminiJSON } from '@/services/geminiService';

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
      toast.error('Veuillez configurer votre clé API Gemini');
      return;
    }

    const config = getConfig();

    setLoading(true);
    try {
      const jsonResponse = await callGeminiJSON<ProductSheet>(config.apiKey,
        `Génère une fiche produit complète pour "${productTitle}". 

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "${productTitle}",
  "shortDescription": "Description courte de 2 lignes maximum",
  "h2Section": {
    "title": "Présentation de ${productTitle}",
    "content": "Description longue de 200 mots avec un lien: <a href='https://example.com/info-produit' target='_blank'>Plus d'informations techniques</a>"
  },
  "h3Section": {
    "title": "Fonctionnalités principales",
    "content": "Texte de 80 mots décrivant les fonctions concrètes",
    "bulletPoints": ["Fonction 1", "Fonction 2", "Fonction 3", "Fonction 4"]
  },
  "testimonial": "Avis factuel d'un utilisateur en 2 phrases",
  "whatItDoesFor": "Explication en 2 phrases de l'utilité concrète",
  "whereToFind": "Information sur les lieux de vente en 1-2 phrases",
  "faq": [
    {"question": "Question ?", "answer": "Réponse en 2 phrases"},
    {"question": "Question ?", "answer": "Réponse en 2 phrases"},
    {"question": "Question ?", "answer": "Réponse en 2 phrases"}
  ],
  "characteristics": ["Spec 1", "Spec 2", "Spec 3", "Spec 4", "Spec 5"]
}

IMPORTANT: ZERO marketing, ZERO superlatifs. Contenu informatif et objectif uniquement.`,
        {
          systemPrompt: 'Tu es un expert en marketing produit. Réponds uniquement avec du JSON valide.',
          temperature: 0.7,
          maxTokens: 2000
        }
      );

      setResult(jsonResponse);
      toast.success('Fiche produit générée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération de la fiche produit');
      
      // Fallback
      setResult({
        title: productTitle,
        shortDescription: `${productTitle} est un produit conçu pour répondre à des besoins spécifiques d'utilisation.\nIl intègre des composants sélectionnés pour assurer son fonctionnement selon les standards établis.`,
        h2Section: {
          title: `Présentation de ${productTitle}`,
          content: `${productTitle} est un produit conçu pour répondre à des besoins spécifiques. Il intègre des composants sélectionnés pour assurer son fonctionnement. <a href='https://example.com/specifications-techniques' target='_blank'>Consulter les spécifications techniques complètes</a>`
        },
        h3Section: {
          title: `Fonctionnalités principales`,
          content: `Ce produit dispose de fonctions intégrées pour son utilisation standard.`,
          bulletPoints: ['Interface utilisateur standard', 'Connectivité selon normes établies', 'Mécanisme de fonctionnement adapté', 'Système de contrôle intégré']
        },
        testimonial: `"J'utilise ${productTitle} depuis 6 mois. Il remplit sa fonction correctement." - Pierre, Technicien`,
        whatItDoesFor: `${productTitle} permet d'effectuer les tâches pour lesquelles il a été conçu.`,
        whereToFind: `Disponible chez les distributeurs agréés et en ligne.`,
        faq: [
          { question: `Quelle est la durée de garantie ?`, answer: `Garantie constructeur standard. Conditions dans la documentation.` },
          { question: `Installation particulière nécessaire ?`, answer: `Installation standard. Manuel d'utilisation fourni.` },
          { question: `Support technique disponible ?`, answer: `Service technique accessible pendant les heures ouvrables.` }
        ],
        characteristics: ['Dimensions: selon spécifications standard', 'Poids: conforme aux normes', 'Matériaux: conformes aux réglementations', 'Alimentation: standards électriques', 'Température: plage normale']
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
