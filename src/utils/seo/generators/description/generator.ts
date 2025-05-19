
import { detectGeographicKeyword } from '../titleGenerator';

/**
 * Génère une description SEO optimisée à partir d'un mot-clé
 * @param keyword Le mot-clé principal
 * @returns Une description SEO optimisée
 */
export const generateSeoDescription = (keyword: string): string => {
  // Détecter si c'est un mot-clé géographique
  const geoLocation = detectGeographicKeyword(keyword);
  
  // Déterminer le thème du site
  const theme = detectWebsiteTheme(keyword);
  
  // Générer une description axée sur le voyage
  if (geoLocation) {
    return `Découvrez ${geoLocation}, ses attractions incontournables et ses expériences uniques. Guide complet pour planifier votre voyage à ${geoLocation} avec conseils pratiques, bonnes adresses et itinéraires personnalisés. Tout ce que vous devez savoir pour un séjour inoubliable.`;
  }
  
  // Description générale pour les mots-clés liés au voyage
  return `Planifiez votre voyage ${keyword} avec nos conseils experts et recommandations. Guide complet avec informations pratiques, itinéraires suggérés, budget estimatif et expériences incontournables. Tout ce que vous devez savoir pour une aventure réussie.`;
};

/**
 * Détecte le thème d'un site web à partir d'un mot-clé
 * @param keyword Le mot-clé à analyser
 * @returns Le thème détecté
 */
export const detectWebsiteTheme = (keyword: string): string => {
  keyword = keyword.toLowerCase();
  
  // Thèmes de voyage - toujours prioritaire pour notre générateur
  if (/voyage|destination|visite|tourisme|séjour|vacances|circuit|excursion|visiter|digital nomad|road trip|backpack/i.test(keyword)) {
    return 'travel';
  }
  
  // Thèmes de restaurants
  if (/restaurant|manger|cuisine|gastronomie|food|bistro|café|pizzeria|sushi|menu/i.test(keyword)) {
    return 'restaurant';
  }
  
  // Thèmes d'hébergement
  if (/hotel|hébergement|chambre|logement|auberge|gîte|villa|appartement|location|airbnb/i.test(keyword)) {
    return 'hotel';
  }
  
  // Par défaut, on considère que c'est un thème de voyage général
  return 'travel';
};

/**
 * Génère des descriptions SEO pour différentes longueurs
 * @param keyword Le mot-clé principal
 * @returns Un objet contenant des descriptions courtes et longues
 */
export const generateBothDescriptions = (keyword: string): { short: string; long: string } => {
  const geoLocation = detectGeographicKeyword(keyword);
  
  // Générer une description courte adaptée au voyage
  let short = generateSeoDescription(keyword);
  
  // Limiter la description courte à 155 caractères
  if (short.length > 155) {
    short = short.substring(0, 152) + '...';
  }
  
  // Générer une description longue plus détaillée orientée voyage
  let long = '';
  
  if (geoLocation) {
    long = `Planifiez votre voyage idéal à ${geoLocation}. Découvrez les meilleures destinations, activités incontournables, conseils d'hébergement et astuces pour optimiser votre budget. Notre guide complet vous propose des itinéraires personnalisés, une sélection d'expériences authentiques et des recommandations pour chaque saison. Profitez d'informations pratiques sur les transports, la gastronomie locale et les événements culturels. ${geoLocation} n'aura plus de secrets pour vous! Consultez également nos avis de voyageurs et préparez sereinement votre prochain séjour.`;
  } else {
    long = `Guide complet pour planifier votre voyage ${keyword}. Découvrez nos conseils d'experts pour optimiser votre itinéraire, trouver les meilleures offres d'hébergement et vivre des expériences authentiques. Nous partageons avec vous les astuces des voyageurs expérimentés : meilleures périodes pour partir, budget à prévoir, documents nécessaires et précautions sanitaires. Notre article vous propose également une sélection d'activités incontournables, de spécialités culinaires à découvrir et de souvenirs à rapporter. Que vous soyez voyageur indépendant ou adepte des circuits organisés, vous trouverez toutes les informations essentielles pour un séjour réussi.`;
  }
  
  // Limiter la description longue à 500 caractères
  if (long.length > 500) {
    long = long.substring(0, 497) + '...';
  }
  
  return { short, long };
};

// Fonction pour générer des descriptions via l'API (gardée pour compatibilité)
export const generateAIDescriptions = async (keyword: string, apiKey: string): Promise<{ short: string, long: string }> => {
  try {
    // Si pas de clé API, utiliser le générateur local
    if (!apiKey) {
      return generateBothDescriptions(keyword);
    }
    
    // Construire le prompt pour l'API orienté voyage
    const prompt = `Génère deux descriptions SEO optimisées pour le mot-clé "${keyword}" dans le domaine du VOYAGE et du TOURISME:
1. Une description courte de 150-155 caractères maximum pour les résultats Google
2. Une description longue de 450-500 caractères pour les partages sociaux et les produits

Les descriptions doivent:
- Être naturelles et convaincantes (pas de style marketing exagéré)
- Inclure le mot-clé principal sans suroptimisation
- Être axées sur le voyage, le tourisme et les destinations
- Aborder les aspects pratiques du voyage (itinéraires, conseils, expériences)

Format de réponse:
{
  "short": "Description courte ici...",
  "long": "Description longue ici..."
}`;

    // Appeler l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    
    // Vérifier les erreurs
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message || "Erreur API OpenAI");
    }
    
    // Extraire le contenu JSON de la réponse
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Réponse API vide");
    }
    
    try {
      // Analyser le JSON renvoyé par l'API
      const result = JSON.parse(content);
      
      // Vérifier que les champs requis sont présents
      if (!result.short || !result.long) {
        throw new Error("Format de réponse invalide");
      }
      
      return {
        short: result.short.substring(0, 155), // Tronquer si nécessaire
        long: result.long.substring(0, 500)    // Tronquer si nécessaire
      };
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError);
      // Fallback: utiliser le générateur local
      return generateBothDescriptions(keyword);
    }
  } catch (error) {
    console.error("Erreur generateAIDescriptions:", error);
    // En cas d'erreur, utiliser le générateur local
    return generateBothDescriptions(keyword);
  }
};
