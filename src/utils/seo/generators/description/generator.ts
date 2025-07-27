
import { detectGeographicKeyword, detectWebsiteTheme } from './detectors';

export const generateSeoDescription = (keyword: string): string => {
  if (!keyword.trim()) return '';
  
  const isGeo = detectGeographicKeyword(keyword);
  const theme = detectWebsiteTheme(keyword);
  const currentYear = new Date().getFullYear();
  
  const templates = {
    'e-commerce': [
      `Achetez ${keyword} au meilleur prix. Large sélection, livraison rapide et service client expert. Découvrez nos offres exclusives.`,
      `${keyword} : trouvez les meilleures offres et comparez les prix. Qualité garantie, expédition 24h et retours gratuits.`,
      `Boutique spécialisée ${keyword} : produits de qualité, conseils d'experts et prix compétitifs. Commandez en ligne facilement.`
    ],
    'blog': [
      `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
      `${keyword} : guide détaillé avec techniques avancées, bonnes pratiques et conseils d'experts pour optimiser vos résultats.`,
      `Maîtrisez ${keyword} grâce à notre approche step-by-step. Méthodes éprouvées, exemples concrets et astuces pour réussir rapidement.`
    ],
    'service': [
      `Services ${keyword} professionnels : expertise reconnue, devis gratuit et intervention rapide. Contactez nos spécialistes.`,
      `${keyword} : prestations sur mesure par des experts certifiés. Qualité garantie, tarifs transparents et satisfaction client.`,
      `Professionnel ${keyword} : années d'expérience, techniques avancées et résultats garantis. Demandez votre devis gratuit.`
    ],
    'local': [
      `${keyword} près de chez vous : trouvez les meilleurs professionnels locaux. Avis clients, devis gratuits et intervention rapide.`,
      `Services ${keyword} dans votre région : équipe locale, connaissance du terrain et proximité garantie. Contactez-nous.`,
      `${keyword} local : professionnels de confiance, intervention rapide et tarifs adaptés à votre région. Devis gratuit.`
    ],
    'général': [
      `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
      `${keyword} : guide détaillé avec techniques avancées, bonnes pratiques et conseils d'experts pour optimiser vos résultats.`,
      `Maîtrisez ${keyword} grâce à notre approche step-by-step. Méthodes éprouvées, exemples concrets et astuces pour réussir rapidement.`,
      `Guide complet ${keyword} : tout ce que vous devez savoir. Solutions efficaces, conseils d'experts et outils recommandés.`,
      `${keyword} expliqué simplement : guide pratique avec exemples, conseils et techniques pour obtenir des résultats concrets.`
    ]
  };
  
  const categoryTemplates = templates[theme] || templates['général'];
  const selectedTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  
  // Limiter à 155 caractères pour le SEO
  return selectedTemplate.length > 155 ? selectedTemplate.substring(0, 152) + "..." : selectedTemplate;
};

export const generateBothDescriptions = (keyword: string) => {
  const short = generateSeoDescription(keyword);
  const long = `${short} En ${new Date().getFullYear()}, ${keyword} représente un enjeu majeur. Notre expertise vous accompagne avec des solutions personnalisées, des conseils d'experts et un suivi professionnel. Que vous soyez débutant ou confirmé, bénéficiez de notre expérience pour optimiser vos résultats et atteindre vos objectifs rapidement et efficacement.`;
  
  return { short, long };
};

export const generateAIDescriptions = async (keyword: string, apiKey: string) => {
  try {
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
            content: 'Tu es un expert en rédaction SEO. Génère des descriptions optimisées et personnalisées.'
          },
          {
            role: 'user',
            content: `Génère 2 descriptions SEO pour le mot-clé "${keyword}":
            1. Une courte (150-155 caractères) pour meta description
            2. Une longue (400-500 caractères) pour introduction d'article
            
            Utilise le mot-clé naturellement et rends le contenu engageant et spécifique au sujet.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur API OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    const lines = content.split('\n').filter(line => line.trim());
    const short = lines.find(line => line.includes('1.') || line.length < 160) || generateSeoDescription(keyword);
    const long = lines.find(line => line.includes('2.') || line.length > 200) || generateBothDescriptions(keyword).long;
    
    return {
      short: short.replace(/^[12]\.\s*/, '').trim(),
      long: long.replace(/^[12]\.\s*/, '').trim()
    };
  } catch (error) {
    console.error('Erreur génération IA:', error);
    return generateBothDescriptions(keyword);
  }
};
