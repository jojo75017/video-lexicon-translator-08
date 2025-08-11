import { useState } from 'react';
import { useOpenAIConfig } from './useOpenAIConfig';
import { toast } from 'sonner';

interface ProductSheet {
  title: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: { name: string; value: string }[];
  benefits: string[];
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
              content: (() => {
                // Extraire le mot-clé principal du titre (généralement les 2-3 premiers mots)
                const mainKeyword = productTitle.split(' ').slice(0, 3).join(' ');
                
                return `Génère une fiche produit complète pour "${productTitle}". 

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "${productTitle}",
  "shortDescription": "Description courte en 2 lignes maximum avec le mot-clé principal '${mainKeyword}' en gras UNE SEULE FOIS (utilise <strong></strong>)",
  "longDescription": "Description longue de 500 mots exactement, optimisée SEO, avec le mot-clé principal '${mainKeyword}' en gras 2-3 fois maximum, réparties naturellement dans le texte (utilise <strong></strong>)",
  "features": ["caractéristique 1", "caractéristique 2", "caractéristique 3", "caractéristique 4", "caractéristique 5"],
  "specifications": [
    {"name": "Nom technique précis", "value": "Valeur mesurable avec unité"},
    {"name": "Autre donnée technique", "value": "Valeur chiffrée précise"},
    {"name": "Critère technique", "value": "Spécification quantifiée"},
    {"name": "Donnée technique", "value": "Mesure ou norme technique"},
    {"name": "Spécification technique", "value": "Valeur technique concrète"}
  ],
  "benefits": ["Bénéfice client clair et direct", "Avantage pratique concret pour l'utilisateur", "Bénéfice économique ou gain de temps", "Avantage qualité ou sécurité"]
}

Important:
- La description longue doit faire EXACTEMENT 500 mots
- Le mot-clé principal "${mainKeyword}" en gras maximum 2-3 fois dans la description longue
- Les spécifications doivent être TECHNIQUES et MESURABLES : dimensions exactes, poids, matériaux, performances chiffrées, certifications, normes, etc.
- Les avantages doivent être CONCRETS et ORIENTÉS CLIENT : économies réelles, gain de temps précis, sécurité renforcée, facilité d'usage, etc.
- Sois créatif et pertinent selon le type de produit`;
              })()
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
        shortDescription: `<strong>${productTitle}</strong> - Un produit innovant qui révolutionne votre expérience utilisateur. Découvrez une qualité exceptionnelle et des performances inégalées.`,
        longDescription: `<strong>${productTitle}</strong> représente l'excellence dans sa catégorie. Ce produit révolutionnaire combine innovation, qualité et performance pour offrir une expérience utilisateur exceptionnelle. Avec <strong>${productTitle}</strong>, vous investissez dans un produit conçu avec les dernières technologies et les matériaux les plus nobles. L'attention portée aux détails et la finition soignée font de <strong>${productTitle}</strong> un choix de premier plan pour les consommateurs exigeants. Les fonctionnalités avancées intégrées dans <strong>${productTitle}</strong> permettent une utilisation intuitive et efficace au quotidien. La robustesse et la fiabilité de <strong>${productTitle}</strong> garantissent une durée de vie exceptionnelle et un retour sur investissement optimal. L'équipe de développement a travaillé sans relâche pour que <strong>${productTitle}</strong> réponde aux besoins les plus exigeants du marché moderne. Les tests rigoureux effectués sur <strong>${productTitle}</strong> confirment sa supériorité technique et sa facilité d'utilisation. En choisissant <strong>${productTitle}</strong>, vous optez pour un produit qui allie esthétique moderne et fonctionnalité pratique. La garantie étendue accompagnant <strong>${productTitle}</strong> témoigne de la confiance du fabricant dans la qualité de son produit. Service client dédié et support technique expert complètent l'offre <strong>${productTitle}</strong> pour une satisfaction client maximale. Rejoignez les milliers d'utilisateurs satisfaits qui ont fait confiance à <strong>${productTitle}</strong> pour transformer leur quotidien. Innovation, qualité, performance : <strong>${productTitle}</strong> incarne ces valeurs dans chaque détail de sa conception et de sa réalisation.`,
        features: [
          'Design moderne et élégant',
          'Technologie de pointe intégrée',
          'Facilité d\'utilisation optimale',
          'Matériaux de qualité supérieure',
          'Performance exceptionnelle'
        ],
        specifications: [
          { name: 'Dimensions', value: 'Standard' },
          { name: 'Poids', value: 'Optimisé' },
          { name: 'Matériau', value: 'Premium' },
          { name: 'Garantie', value: '2 ans' },
          { name: 'Origine', value: 'Qualité contrôlée' }
        ],
        benefits: [
          'Améliore votre productivité au quotidien',
          'Design ergonomique pour un confort optimal',
          'Économies à long terme grâce à sa durabilité',
          'Support client expert disponible 7j/7'
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