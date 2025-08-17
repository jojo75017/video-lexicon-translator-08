import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'promotional' | 'welcome' | 'followup';
  estimatedReadTime: string;
  cta: string;
}

export class EmailGeneratorService {
  private static generateNewsletterEmails(niche: string): EmailTemplate[] {
    const newsletters = [
      {
        id: 'newsletter-1',
        subject: `📈 [${niche}] Tendances de la semaine à ne pas manquer`,
        type: 'newsletter' as const,
        estimatedReadTime: '3 min',
        cta: 'Lire l\'article complet',
        content: `
Bonjour [PRÉNOM],

Cette semaine dans le monde du ${niche.toLowerCase()}, plusieurs tendances émergent :

🚀 **NOUVEAUTÉ #1**: Les dernières mises à jour d'algorithme
L'impact sur votre stratégie ${niche.toLowerCase()} est considérable. Voici ce qui change...

💡 **ASTUCE PRO**: La technique secrète des experts
Découvrez comment optimiser vos résultats avec cette méthode simple mais efficace.

📊 **ÉTUDE DE CAS**: +300% de trafic en 60 jours
Client anonyme, résultats réels. Découvrez la stratégie complète.

🎯 **ACTION DE LA SEMAINE**:
Implémentez cette optimisation qui prend 10 minutes mais peut doubler vos résultats.

À la semaine prochaine !
L'équipe ${niche}
        `
      },
      {
        id: 'newsletter-2',
        subject: `🔥 Les erreurs ${niche.toLowerCase()} qui coûtent cher`,
        type: 'newsletter' as const,
        estimatedReadTime: '4 min',
        cta: 'Voir les solutions',
        content: `
Salut [PRÉNOM],

J'ai analysé plus de 500 sites cette semaine, et 87% font ces erreurs critiques :

❌ **ERREUR #1**: Négliger l'optimisation mobile
Conséquence : -40% de trafic potentiel perdu

❌ **ERREUR #2**: Mots-clés mal choisis
95% choisissent des KW trop compétitifs ou pas assez recherchés

❌ **ERREUR #3**: Contenu non optimisé
Structure, balises, liens internes... tout y passe

✅ **LA SOLUTION**: Notre audit gratuit de 15 points
Identifiez VOS erreurs en moins de 30 minutes.

P.S: Réponse garantie sous 24h !
        `
      },
      {
        id: 'newsletter-3',
        subject: `💰 Comment [Concurrent] génère 50k€/mois avec ${niche}`,
        type: 'newsletter' as const,
        estimatedReadTime: '5 min',
        cta: 'Découvrir la stratégie',
        content: `
[PRÉNOM],

Étude de cas exclusive : Comment une petite entreprise B2B a explosé ses revenus.

📊 **LES CHIFFRES**:
• Chiffre d'affaires : 8k€ → 50k€/mois
• Trafic organique : 500 → 15 000 visiteurs/mois
• Taux de conversion : 1.2% → 4.8%

🎯 **LA STRATÉGIE EN 3 ÉTAPES**:

**ÉTAPE 1**: Recherche de mots-clés nichés
Ils ont trouvé des KW à faible concurrence mais forte intention d'achat

**ÉTAPE 2**: Contenu ultra-ciblé  
Chaque article répond à UN problème spécifique de leur audience

**ÉTAPE 3**: Tunnel de conversion optimisé
Du premier clic à la vente, chaque étape est mesurée et optimisée

🚀 **VOTRE PLAN D'ACTION**:
J'ai créé un guide de 37 pages qui détaille leur stratégie exacte.

Téléchargement gratuit pendant 48h seulement.
        `
      }
    ];

    return newsletters;
  }

  private static generatePromotionalEmails(niche: string): EmailTemplate[] {
    const promotionals = [
      {
        id: 'promo-1',
        subject: `🔥 [URGENT] Formation ${niche} -50% (24h restantes)`,
        type: 'promotional' as const,
        estimatedReadTime: '2 min',
        cta: 'Accéder à la formation',
        content: `
[PRÉNOM], plus que 24 heures !

⏰ **DERNIÈRE CHANCE**: Formation ${niche} Expert à -50%

🎯 **CE QUE VOUS ALLEZ APPRENDRE**:
✅ Stratégie complète de A à Z  
✅ Outils professionnels inclus
✅ Templates prêts à utiliser
✅ 3 mois de suivi personnalisé

💰 **PRIX NORMAL**: 297€
🔥 **PRIX EXCEPTIONNEL**: 148.50€ (jusqu'à minuit)

⚡ **BONUS LIMITÉ**: 
• Audit gratuit de votre site (valeur 197€)
• Accès VIP communauté privée
• 50 templates exclusifs

🏃‍♂️ **ATTENTION**: Plus que 23 places disponibles

Code promo : URGENCE50
        `
      },
      {
        id: 'promo-2',
        subject: `🎁 Cadeau surprise ${niche} (valeur 197€)`,
        type: 'promotional' as const,
        estimatedReadTime: '3 min',
        cta: 'Récupérer mon cadeau',
        content: `
Surprise [PRÉNOM] ! 🎉

Vous avez été sélectionné(e) pour recevoir notre pack ${niche} Premium GRATUITEMENT.

🎁 **CONTENU DU PACK** (valeur 197€):
• Guide complet 47 pages
• 25 templates prêts à utiliser  
• Checklist de vérification
• Vidéos de formation (2h30)
• Scripts de vente qui convertissent

🤔 **POURQUOI GRATUIT ?**
Simple : vous êtes un(e) lecteur/lectrice fidèle, et nous lançons un nouveau service.

Votre témoignage après utilisation nous aide énormément !

⏰ **CONDITION**: Récupération avant dimanche 23h59

Aucun engagement, aucun piège.
Juste notre façon de dire MERCI ! 🙏
        `
      }
    ];

    return promotionals;
  }

  private static generateWelcomeEmails(niche: string): EmailTemplate[] {
    return [
      {
        id: 'welcome-1',
        subject: `🎉 Bienvenue ! Votre parcours ${niche} commence ici`,
        type: 'welcome' as const,
        estimatedReadTime: '2 min',
        cta: 'Commencer maintenant',
        content: `
Bonjour [PRÉNOM] et bienvenue ! 🎉

Félicitations pour avoir rejoint notre communauté de passionnés ${niche.toLowerCase()}.

🚀 **VOTRE PARCOURS EN 3 ÉTAPES**:

**ÉTAPE 1** (Aujourd'hui): Découvrez vos premières optimisations
**ÉTAPE 2** (J+3): Implémentez votre stratégie personnalisée  
**ÉTAPE 3** (J+7): Mesurez et ajustez vos premiers résultats

📚 **RESSOURCES EXCLUSIVES**:
• Checklist débutant (téléchargement immédiat)
• Accès à notre groupe privé  
• Support prioritaire

💡 **PREMIER CONSEIL**: 
Commencez par auditer votre situation actuelle avec notre outil gratuit.

À très bientôt,
L'équipe ${niche}

P.S: Répondez à cet email pour me dire quel est votre plus grand défi !
        `
      }
    ];
  }

  public static generateEmailCampaign(niche: string, emailTypes: string[] = ['newsletter', 'promotional']): EmailTemplate[] {
    const allEmails: EmailTemplate[] = [];

    if (emailTypes.includes('newsletter')) {
      allEmails.push(...this.generateNewsletterEmails(niche));
    }

    if (emailTypes.includes('promotional')) {
      allEmails.push(...this.generatePromotionalEmails(niche));
    }

    if (emailTypes.includes('welcome')) {
      allEmails.push(...this.generateWelcomeEmails(niche));
    }

    // Mélanger et limiter à 4 emails maximum
    const shuffled = allEmails.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }

  public static generateSubjectLines(niche: string, count: number = 10): string[] {
    const templates = [
      `🔥 [${niche}] Secrets que 95% ignorent`,
      `⚡ [PRÉNOM], votre guide ${niche} arrive !`,
      `📈 Doublez vos résultats ${niche} en 30 jours`,
      `🚀 URGENT : ${niche} révolutionnaire dévoilé`,
      `💡 La méthode ${niche} des experts`,
      `🎯 Comment [concurrent] domine le ${niche}`,
      `📊 Vos 5 erreurs ${niche} les plus coûteuses`,
      `⭐ [PRÉNOM], votre audit ${niche} gratuit est prêt`,
      `🔑 La stratégie ${niche} secrète révélée`,
      `💰 Transformez votre ${niche} en machine à cash`,
      `🏆 [PRÉNOM], devenez leader en ${niche}`,
      `⚠️ Erreur ${niche} fatale à éviter absolument`,
      `🎁 Cadeau ${niche} exclusif (valeur 197€)`,
      `📱 ${niche} 2024: Les nouvelles règles du jeu`,
      `🔍 Analyse ${niche}: Pourquoi vous stagnez`
    ];

    return templates
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }

  public static analyzeEmailContent(content: string): {
    spamScore: number;
    issues: string[];
    recommendations: string[];
    deliverabilityScore: number;
  } {
    let spamScore = 0;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Analyse des mots spam
    const spamWords = [
      'gratuit', 'urgent', 'promotion', 'argent', 'gagner', 'rapide',
      'garantie', 'exclusif', 'limitée', 'maintenant', 'immédiat'
    ];
    
    const spamWordsFound = spamWords.filter(word => 
      content.toLowerCase().includes(word)
    );
    
    if (spamWordsFound.length > 0) {
      spamScore += spamWordsFound.length * 2;
      issues.push(`Mots déclencheurs détectés: ${spamWordsFound.join(', ')}`);
      recommendations.push('Remplacez les mots déclencheurs par des synonymes');
    }

    // Analyse des exclamations
    const exclamationCount = (content.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      spamScore += 3;
      issues.push(`Trop d'exclamations (${exclamationCount})`);
      recommendations.push('Limitez les exclamations à 2-3 maximum');
    }

    // Analyse des majuscules
    const capsCount = (content.match(/[A-Z]/g) || []).length;
    const totalChars = content.length;
    const capsRatio = capsCount / totalChars;
    
    if (capsRatio > 0.3) {
      spamScore += 4;
      issues.push('Trop de majuscules');
      recommendations.push('Équilibrez majuscules et minuscules');
    }

    // Analyse des liens
    const linkCount = (content.match(/https?:\/\/\S+/g) || []).length;
    if (linkCount > 5) {
      spamScore += 2;
      issues.push('Trop de liens');
      recommendations.push('Limitez le nombre de liens');
    }

    const deliverabilityScore = Math.max(0, 100 - (spamScore * 10));
    
    return {
      spamScore: Math.min(spamScore, 10),
      issues,
      recommendations,
      deliverabilityScore
    };
  }
}