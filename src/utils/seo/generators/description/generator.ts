
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
  
  // Générer une description adaptée au thème et au lieu
  if (geoLocation) {
    switch(theme) {
      case 'travel':
        return `Découvrez ${geoLocation}, ses attraits touristiques et ses activités. Guide complet pour planifier votre voyage à ${geoLocation} avec des conseils pratiques, bonnes adresses et itinéraires.`;
      case 'restaurant':
        return `Meilleurs restaurants à ${geoLocation}. Découvrez notre sélection d'établissements, leurs spécialités culinaires et réservez une table. Avis clients et recommandations pour bien manger à ${geoLocation}.`;
      case 'hotel':
        return `Trouvez les meilleurs hôtels à ${geoLocation}. Comparez les prix, les avis et les emplacements pour un séjour parfait. Réservation en ligne sécurisée et garantie du meilleur prix à ${geoLocation}.`;
      default:
        return `Tout ce que vous devez savoir sur ${keyword}. Guide complet avec informations pratiques, conseils d'experts et recommandations pour ${geoLocation}. Découvrez nos ressources mises à jour régulièrement.`;
    }
  }
  
  // Descriptions générales par thème
  switch(theme) {
    case 'travel':
      return `Planifiez votre voyage idéal avec nos conseils experts sur ${keyword}. Destinations, itinéraires, budgets et astuces pratiques pour des vacances réussies. Guide complet pour découvrir ${keyword} dans les meilleures conditions.`;
    case 'restaurant':
      return `Découvrez notre sélection de ${keyword}, avec les meilleurs établissements, leurs spécialités et leurs tarifs. Avis clients, photos et recommandations pour une expérience culinaire inoubliable autour de ${keyword}.`;
    case 'hotel':
      return `Trouvez l'hébergement idéal parmi notre sélection de ${keyword}. Comparez les prix, équipements et emplacements pour un séjour parfait. Réservation en ligne sécurisée et garantie de satisfaction.`;
    case 'ecommerce':
      return `Achetez ${keyword} au meilleur prix sur notre boutique en ligne. Large sélection de produits de qualité, livraison rapide et service client réactif. Découvrez nos offres spéciales et promotions exclusives.`;
    case 'aquarium':
      return `Tout savoir sur ${keyword} pour votre aquarium. Conseils d'entretien, alimentation, reproduction et cohabitation avec d'autres espèces. Guide complet pour aquariophiles débutants et expérimentés.`;
    default:
      return `Découvrez tout ce que vous devez savoir sur ${keyword}. Guide complet avec explications détaillées, conseils pratiques et recommandations d'experts. Ressources mises à jour régulièrement pour vous aider avec ${keyword}.`;
  }
};

/**
 * Détecte le thème d'un site web à partir d'un mot-clé
 * @param keyword Le mot-clé à analyser
 * @returns Le thème détecté
 */
export const detectWebsiteTheme = (keyword: string): string => {
  keyword = keyword.toLowerCase();
  
  // Thèmes de voyage
  if (/voyage|destination|visite|tourisme|séjour|vacances|circuit|excursion|visiter/i.test(keyword)) {
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
  
  // Thèmes d'e-commerce
  if (/acheter|boutique|magasin|prix|promo|solde|vente|produit|marque|collection/i.test(keyword)) {
    return 'ecommerce';
  }
  
  // Thèmes d'aquariophilie
  if (/poisson|aquarium|aquariophilie|récif|eau douce|corail|plante|betta|discus|cichlidé|guppy|tetra/i.test(keyword)) {
    return 'aquarium';
  }
  
  // Par défaut
  return 'general';
};

/**
 * Génère des descriptions SEO pour différentes longueurs
 * @param keyword Le mot-clé principal
 * @returns Un objet contenant des descriptions courtes et longues
 */
export const generateBothDescriptions = (keyword: string): { short: string; long: string } => {
  const theme = detectWebsiteTheme(keyword);
  const geo = detectGeographicKeyword(keyword);
  
  let short = generateSeoDescription(keyword);
  
  // Limiter la description courte à 155 caractères
  if (short.length > 155) {
    short = short.substring(0, 152) + '...';
  }
  
  // Générer une description longue plus détaillée
  let long = '';
  
  if (theme === 'travel') {
    long = `Planifiez votre voyage idéal ${geo ? `à ${geo}` : `avec ${keyword}`}. Découvrez les meilleures destinations, activités incontournables, conseils d'hébergement et astuces pour optimiser votre budget. Notre guide complet vous propose des itinéraires personnalisés, une sélection d'expériences authentiques et des recommandations pour chaque saison. Profitez d'informations pratiques sur les transports, la gastronomie locale et les événements culturels. ${geo ? `${geo} n'aura plus de secrets pour vous!` : `Tout ce que vous devez savoir sur ${keyword} pour des vacances réussies.`} Consultez également nos avis de voyageurs et préparez sereinement votre prochain séjour.`;
  } else if (theme === 'restaurant') {
    long = `Découvrez notre sélection des meilleurs restaurants ${geo ? `à ${geo}` : `pour ${keyword}`}. Explorez une variété d'établissements allant de la cuisine gastronomique aux adresses familiales authentiques. Nous partageons avec vous les spécialités culinaires à ne pas manquer, les plats signatures des chefs et les meilleurs rapports qualité-prix. Réservez facilement une table et consultez les avis détaillés de notre communauté. Nos critiques prennent en compte l'ambiance, le service et bien sûr la qualité des mets proposés. Guide mis à jour régulièrement pour vous garantir une expérience culinaire mémorable ${geo ? `lors de votre séjour à ${geo}` : `autour de ${keyword}`}.`;
  } else if (theme === 'hotel') {
    long = `Trouvez l'hébergement parfait ${geo ? `à ${geo}` : `pour ${keyword}`} grâce à notre sélection complète d'hôtels, résidences et locations saisonnières. Comparez facilement les tarifs, les équipements et les emplacements pour choisir le logement idéal selon votre budget et vos préférences. Nous détaillons pour chaque établissement les services disponibles, la proximité des attractions touristiques et les moyens de transport accessibles. Consultez les avis vérifiés de voyageurs et profitez de nos conseils pour obtenir le meilleur rapport qualité-prix. Réservation en ligne sécurisée avec garantie du meilleur tarif et options d'annulation flexibles.`;
  } else if (theme === 'ecommerce') {
    long = `Achetez ${keyword} au meilleur prix sur notre boutique en ligne spécialisée. Notre catalogue propose une large sélection de produits de qualité avec des descriptions détaillées, comparatifs et avis clients pour vous aider à faire le bon choix. Bénéficiez de la livraison rapide, d'un service client réactif et de notre garantie satisfaction. Explorez nos différentes gammes, des options économiques aux modèles premium, et profitez régulièrement de promotions exclusives et offres spéciales. Paiement sécurisé, suivi de commande en temps réel et retours simplifiés pour un shopping en ligne en toute confiance.`;
  } else if (theme === 'aquarium') {
    long = `Tout savoir sur ${keyword} pour réussir votre aquarium. Notre guide complet vous accompagne de l'installation à l'entretien avec des conseils experts pour les aquariophiles débutants comme expérimentés. Découvrez les meilleures pratiques pour l'alimentation, la reproduction et la cohabitation avec d'autres espèces. Nous abordons également les questions de qualité d'eau, filtration, éclairage et traitements des maladies courantes. Consultez nos fiches détaillées sur les espèces compatibles, les plantes recommandées et les équipements nécessaires. Rejoignez notre communauté passionnée et partagez votre expérience pour un écosystème aquatique sain et équilibré.`;
  } else {
    long = `Découvrez notre guide complet sur ${keyword} avec toutes les informations essentielles et conseils pratiques dont vous avez besoin. Cet article détaillé vous présente les aspects fondamentaux, les meilleures pratiques et les erreurs à éviter concernant ${keyword}. Nos experts partagent leurs connaissances approfondies et leur expérience pour vous aider à mieux comprendre ce sujet. Vous trouverez également des réponses aux questions fréquemment posées, des ressources complémentaires et des recommandations personnalisées. Que vous soyez débutant ou que vous souhaitiez approfondir vos connaissances, ce guide exhaustif vous accompagnera étape par étape. Contenu régulièrement mis à jour pour vous garantir des informations fiables et pertinentes sur ${keyword}.`;
  }
  
  // Limiter la description longue à 500 caractères
  if (long.length > 500) {
    long = long.substring(0, 497) + '...';
  }
  
  return { short, long };
};

export const generateAIDescriptions = async (keyword: string, apiKey: string): Promise<{ short: string, long: string }> => {
  try {
    // Si pas de clé API, utiliser le générateur local
    if (!apiKey) {
      return generateBothDescriptions(keyword);
    }
    
    // Construire le prompt pour l'API
    const prompt = `Génère deux descriptions SEO optimisées pour le mot-clé "${keyword}":
1. Une description courte de 150-155 caractères maximum pour les résultats Google
2. Une description longue de 450-500 caractères pour les partages sociaux et les produits

Les descriptions doivent:
- Être naturelles et convaincantes (pas de style marketing exagéré)
- Inclure le mot-clé principal sans suroptimisation
- Répondre à l'intention de recherche derrière le mot-clé
- Être adaptées au thème détecté (voyage, restaurant, hôtel, e-commerce, aquarium, etc.)

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
      // Fallback: tenter d'extraire manuellement les descriptions
      const shortMatch = content.match(/["']short["']\s*:\s*["']([^"']*)["']/);
      const longMatch = content.match(/["']long["']\s*:\s*["']([^"']*)["']/);
      
      if (shortMatch && longMatch) {
        return {
          short: shortMatch[1].substring(0, 155),
          long: longMatch[1].substring(0, 500)
        };
      }
      
      throw new Error("Impossible d'extraire les descriptions");
    }
  } catch (error) {
    console.error("Erreur generateAIDescriptions:", error);
    // En cas d'erreur, utiliser le générateur local
    return generateBothDescriptions(keyword);
  }
};
