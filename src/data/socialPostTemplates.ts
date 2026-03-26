export const LINKEDIN_PROFILE = 'https://www.linkedin.com/in/consultantwebmaster/';
export const FACEBOOK_PAGE = 'https://www.facebook.com/formationenaffiliation/';
export const DEMO_LINK = 'https://ebookstudio.fr/demo';
export const OFFRES_LINK = 'https://ebookstudio.fr/offres';
export const AMAZON_PROFILE = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';

export type SocialPlatform = 'facebook' | 'linkedin' | 'tiktok' | 'pinterest' | 'x';

export interface SocialPostTemplate {
  id: string;
  platform: SocialPlatform;
  type: string;
  content: string;
  hashtags: string[];
  hook?: string;
  visualDescription?: string;
}

export const PLATFORM_CONFIG: Record<SocialPlatform, { label: string; color: string; icon: string; bestTimes: string[] }> = {
  facebook: { label: 'Facebook', color: 'bg-blue-600 text-white', icon: 'facebook', bestTimes: ['09:00', '12:00', '19:00'] },
  linkedin: { label: 'LinkedIn', color: 'bg-blue-700 text-white', icon: 'linkedin', bestTimes: ['08:00', '10:00', '17:00'] },
  tiktok: { label: 'TikTok', color: 'bg-black text-white', icon: 'tiktok', bestTimes: ['07:00', '12:00', '19:00', '22:00'] },
  pinterest: { label: 'Pinterest', color: 'bg-red-600 text-white', icon: 'pinterest', bestTimes: ['14:00', '20:00', '21:00'] },
  x: { label: 'X (Twitter)', color: 'bg-zinc-900 text-white', icon: 'x', bestTimes: ['08:00', '12:00', '17:00'] },
};

export const ALL_TEMPLATES: SocialPostTemplate[] = [
  // === FACEBOOK ===
  {
    id: 'fb-1', platform: 'facebook', type: 'Post groupe "Revenus Passifs"',
    visualDescription: 'Screenshot du dashboard EbookStudio avec compteur de livres publiés. Overlay doré avec chiffres clés.',
    content: `📖 [RETOUR D'EXPÉRIENCE] Comment je publie 3 ebooks/semaine sur Amazon KDP

Salut le groupe 👋

En 2023, je galérais à sortir UN livre en 3 semaines.
Aujourd'hui ? 35+ livres sur Amazon, 2-3 par semaine.

Mon secret ? Un générateur d'ebooks propulsé par l'IA (Gemini 3 Flash).

→ Plan structuré en 30 sec
→ Chapitres rédigés dans MON style
→ Couverture pro générée
→ Mots-clés Amazon optimisés
→ Export PDF/EPUB prêt pour KDP

Coût par ebook : ~0,30€

🆓 Démo gratuite : ${DEMO_LINK}
💰 Offre Fondateur 67€ : ${OFFRES_LINK}
📌 Ma page : ${FACEBOOK_PAGE}

Questions en commentaire ! 👇`,
    hashtags: ['revenuspassifs', 'kdp', 'amazon', 'ebook', 'ia', 'autoedition']
  },
  {
    id: 'fb-2', platform: 'facebook', type: 'Post témoignage avant/après',
    visualDescription: 'Infographie split en deux : gauche (rouge/négatif) = ancienne méthode, droite (vert/positif) = avec EbookStudio.',
    content: `🔥 J'aurais aimé avoir cet outil il y a 2 ans...

AVANT :
❌ 3 semaines pour UN livre
❌ 500€ de ghostwriter
❌ Des couvertures amateurs
❌ 0 vente pendant 3 mois

APRÈS EbookStudio Pro :
✅ 47 min pour un ebook complet
✅ 0,30€ de coût de production
✅ Couvertures professionnelles en 1 clic
✅ Optimisation Amazon intégrée

35 livres publiés. Vérifiable sur Amazon.

Testez gratuitement : ${DEMO_LINK}
Aucune CB requise. 🙌`,
    hashtags: ['kdp', 'amazon', 'ebook', 'selfpublishing', 'ia', 'business']
  },
  {
    id: 'fb-3', platform: 'facebook', type: 'Post question/engagement',
    visualDescription: 'Visuel sondage avec les 3 options A/B/C en gros, couleurs vives, logo EbookStudio en watermark.',
    content: `💬 Sondage rapide :

Si vous pouviez publier un livre sur Amazon en MOINS d'une heure...
Le feriez-vous ?

🅰️ Oui, direct !
🅱️ J'y pense depuis longtemps
🅾️ Trop beau pour être vrai

35+ livres publiés. 47 min en moyenne. Coût : 0,30€/livre.

Mon profil Amazon est public : ${AMAZON_PROFILE}

Démo gratuite : ${DEMO_LINK}

Répondez avec votre lettre ! 👇`,
    hashtags: ['sondage', 'entrepreneur', 'kdp', 'amazon', 'ia']
  },
  {
    id: 'fb-4', platform: 'facebook', type: 'Post valeur/niches',
    visualDescription: 'Top 5 liste visuelle avec icônes par niche, fond sombre, texte doré pour les chiffres.',
    content: `📊 Les 5 niches KDP les plus rentables en 2026 :

1️⃣ Développement personnel — Demande massive
2️⃣ Low-content (carnets, planners) — Volume = revenus
3️⃣ Cuisine/Recettes — Evergreen, excellent BSR
4️⃣ Livres enfants illustrés — Marges élevées
5️⃣ Business/Finance perso — Audience qui achète

💡 L'astuce : 3-5 titres par niche pour dominer Amazon.

Avec EbookStudio Pro, un ebook par niche en ~47 min.

🎁 Commentez "NICHES" → je vous envoie mon guide gratuit en MP !`,
    hashtags: ['kdp', 'niches', 'amazon', 'revenuspassifs', 'ebook', 'business2026']
  },
  {
    id: 'fb-5', platform: 'facebook', type: 'Post urgence/FOMO',
    visualDescription: 'Bandeau rouge "DERNIÈRE SEMAINE", prix barré 197€ → 67€, timer visuel.',
    content: `⏰ [DERNIÈRE SEMAINE] Offre Fondateur EbookStudio Pro

66% de réduction. Après ? 197€.

Pour 67€ (valeur 749€) :
🔥 Générateur IA illimité
🎨 Créateur de couvertures pro
🔊 Convertisseur livre audio
📊 Dashboard marketing complet

+ BONUS : Pack 300+ idées, Guide niches, Groupe privé, MAJ à vie

💳 Paiement en 3x23€ ou 5x14€

👉 ${OFFRES_LINK}
🆓 Tester d'abord : ${DEMO_LINK}`,
    hashtags: ['offrelimitee', 'ebookstudio', 'kdp', 'amazon', 'fondateur']
  },

  // === LINKEDIN ===
  {
    id: 'li-1', platform: 'linkedin', type: 'Post storytelling',
    visualDescription: 'Photo pro de Georges avec overlay texte "De 0 à 35 livres". Style LinkedIn natif.',
    content: `Il y a 2 ans, j'avais une idée de livre.

Comme tout le monde, je me suis dit "un jour, j'écrirai".

Ce "un jour" a duré des mois.

Puis j'ai découvert l'IA générative.

Résultat en 2026 :
→ 35+ livres publiés sur Amazon
→ Un générateur d'ebooks complet
→ Coût de production : 0,30€/livre

Pas pour remplacer les auteurs.
Pour leur donner un avantage injuste.

Si vous êtes entrepreneur, freelance, coach ou expert...
Vous avez un livre en vous.

🔗 Tester gratuitement : ${DEMO_LINK}
👤 ${LINKEDIN_PROFILE}`,
    hashtags: ['IA', 'KDP', 'Amazon', 'Entrepreneuriat', 'SelfPublishing', 'Innovation']
  },
  {
    id: 'li-2', platform: 'linkedin', type: 'Post chiffres',
    visualDescription: 'Infographie LinkedIn avec icônes et chiffres clés en gras. Palette bleue professionnelle.',
    content: `📊 Le business model le plus sous-estimé de 2026 :

Publier des ebooks sur Amazon KDP.

💰 Investissement : 67€ + ~0,30€/livre
📈 Potentiel : 500€ à 5000€/mois passifs
⏱️ Temps/livre : 47 minutes
📚 Pas de stock, pas de SAV

Le calcul :
→ 1 ebook/semaine = 52 livres/an
→ 50€/mois/livre = 2600€/mois passifs

35+ livres publiés. Profil Amazon public.

Commentez "EBOOK" → lien de la démo gratuite.`,
    hashtags: ['RevenusPassifs', 'KDP', 'Amazon', 'Business', 'IA', 'Entrepreneuriat']
  },
  {
    id: 'li-3', platform: 'linkedin', type: 'Post leçon apprise',
    visualDescription: 'Texte "18 échecs → 35 succès" sur fond gradient. Minimaliste, pro.',
    content: `J'ai échoué 18 fois avant de réussir sur Amazon KDP.

Mes 18 premiers livres ? Écrits à la main. Des semaines de travail.

Puis j'ai compris 3 choses :
1. La VITESSE compte plus que la perfection
2. Le VOLUME multiplie les chances
3. L'OPTIMISATION fait 80% du travail

Alors j'ai automatisé tout le processus.

Aujourd'hui : 35+ livres, 47 min/livre, 0,30€ par titre.

La leçon ? Publiez beaucoup, apprenez vite, optimisez toujours.

Lien de la démo en commentaire 👇`,
    hashtags: ['Échec', 'Apprentissage', 'KDP', 'Amazon', 'Entrepreneur', 'Mindset']
  },
  {
    id: 'li-4', platform: 'linkedin', type: 'Post éducatif',
    visualDescription: 'Carrousel 6 slides avec les 6 étapes numérotées. Design épuré LinkedIn.',
    content: `Vous voulez publier un livre mais vous ne savez pas écrire ?

En 2026, ce n'est plus un obstacle.

Mon processus pour 3 ebooks/semaine :

𝟏. Choisir une niche (300+ idées incluses)
𝟐. Générer le plan en 30 secondes
𝟑. Rédiger les chapitres (IA personnalisée)
𝟒. Créer la couverture pro (1 clic)
𝟓. Optimiser titre + mots-clés Amazon
𝟔. Exporter PDF/EPUB → publier sur KDP

Temps : ~47 min | Coût : ~0,30€

Qui veut tester ? Commentez "DEMO" 👇`,
    hashtags: ['EdTech', 'IA', 'Publication', 'KDP', 'Amazon', 'Productivite']
  },
  {
    id: 'li-5', platform: 'linkedin', type: 'Post controversé',
    visualDescription: 'Fond rouge avec texte blanc provocateur. Style "opinion impopulaire".',
    content: `Opinion impopulaire : Passer 6 mois à écrire un livre est une perte de temps.

Je parle de livres pratiques, guides, manuels. PAS de littérature.

Amazon KDP récompense :
→ La fréquence de publication
→ L'optimisation des mots-clés
→ La qualité "suffisante"

Un livre bien optimisé à 47 min > Un chef-d'œuvre invisible à 6 mois.

35+ livres publiés. Production en 47 min.

Le perfectionnisme est l'ennemi de la rentabilité.

D'accord ? Pas d'accord ? 👇`,
    hashtags: ['Controverse', 'KDP', 'Productivite', 'IA', 'Business', 'Amazon']
  },

  // === TIKTOK ===
  {
    id: 'tk-1', platform: 'tiktok', type: 'Hook viral',
    hook: '0-3s: Montrer le chrono à 47min avec un ebook fini à l\'écran',
    visualDescription: 'Screenrecording accéléré de la génération d\'un ebook. Timer en overlay. Musique trending.',
    content: `🤯 J'ai généré un ebook COMPLET en 47 minutes.

150 pages. Structurées. Illustrées. Prêtes pour Amazon.

✅ Plan en 30 secondes
✅ 12 chapitres rédigés
✅ Couverture pro générée
✅ Optimisation KDP automatique

Coût total ? 0,30€. TRENTE CENTIMES.

Pendant que certains passent 3 mois sur un livre...
Moi j'en publie 3 par semaine. 📚

🔗 Lien en bio pour tester GRATUITEMENT`,
    hashtags: ['ebookstudio', 'kdp', 'amazon', 'ia', 'revenuspassifs', 'autoedition', 'selfpublishing', 'business', 'sideproject', 'booktok']
  },
  {
    id: 'tk-2', platform: 'tiktok', type: 'Avant/Après',
    hook: '0-3s: Split screen — galère vs facilité',
    visualDescription: 'Split screen vertical: gauche = personne stressée qui écrit, droite = clic et ebook prêt. Transition satisfaisante.',
    content: `AVANT EbookStudio :
😩 3 semaines pour UN livre
😩 500€ de ghostwriter
😩 0 vente car mauvais mots-clés

APRÈS EbookStudio :
🚀 47 min pour un livre complet
🚀 0,30€ de coût
🚀 Couverture pro incluse
🚀 Optimisation Amazon intégrée

35 livres publiés. Preuve sur Amazon.

📖 Tester gratuitement → lien en bio`,
    hashtags: ['avantapres', 'kdp', 'amazon', 'ebook', 'ia', 'transformation', 'booktok', 'business2026']
  },
  {
    id: 'tk-3', platform: 'tiktok', type: 'Tutoriel rapide',
    hook: '0-3s: "Je vais publier un livre en LIVE en 47 min"',
    visualDescription: 'Screenrecording étape par étape avec annotations et flèches. Format tutoriel TikTok.',
    content: `📱 TUTO : Publier un livre Amazon en 47 min

ÉTAPE 1 → Choisir une niche rentable (30 sec)
ÉTAPE 2 → Générer le plan complet (30 sec)
ÉTAPE 3 → Laisser l'IA rédiger les chapitres (20 min)
ÉTAPE 4 → Créer la couverture pro (2 min)
ÉTAPE 5 → Optimiser titre + mots-clés (5 min)
ÉTAPE 6 → Export PDF + upload KDP (10 min)

Total : 47 minutes. Coût : 0,30€.

L'outil ? EbookStudio Pro.
Lien en bio pour tester gratuitement 🆓`,
    hashtags: ['tuto', 'tutoriel', 'kdp', 'amazon', 'ebook', 'ia', 'howto', 'learnontiktok']
  },

  // === PINTEREST ===
  {
    id: 'pin-1', platform: 'pinterest', type: 'Épingle de vente',
    visualDescription: 'Épingle verticale 1000x1500px. Titre en gros "CRÉEZ VOTRE EBOOK EN 47 MIN". Fond doré/noir. Bullet points avec icônes.',
    content: `📖 CRÉEZ VOTRE EBOOK EN 47 MINUTES

L'IA qui transforme vos idées en livres Amazon KDP

✨ Plan complet automatique
✨ 12+ chapitres structurés
✨ Couverture professionnelle
✨ Mots-clés Amazon optimisés
✨ Export PDF/EPUB

💰 Coût par ebook : 0,30€
📚 35+ livres publiés par le créateur

🆓 Démo gratuite sur ebookstudio.fr

📌 Enregistrez pour ne pas oublier !`,
    hashtags: ['ebook', 'kdp', 'amazon', 'autoedition', 'ia', 'revenuspassifs', 'ecriture', 'selfpublishing', 'businessenligne', 'sidehustle']
  },
  {
    id: 'pin-2', platform: 'pinterest', type: 'Épingle éducative',
    visualDescription: 'Infographie verticale "5 NICHES KDP RENTABLES 2026" avec icônes colorées par niche. Style clean Pinterest.',
    content: `📊 5 NICHES KDP LES PLUS RENTABLES EN 2026

1️⃣ Développement personnel
2️⃣ Carnets & Planners (Low-content)
3️⃣ Livres de recettes
4️⃣ Livres pour enfants illustrés
5️⃣ Business & Finance personnelle

💡 Astuce : Publiez 3-5 titres par niche
⏱️ Temps de création : 47 min/livre
💰 Coût : 0,30€ par ebook

Outil utilisé : EbookStudio Pro
📌 Enregistrez + visitez ebookstudio.fr`,
    hashtags: ['kdp', 'niches', 'amazon', 'revenus', 'ebook', 'business', 'sidehustle', 'passiveincome', 'entrepreneuriat']
  },
  {
    id: 'pin-3', platform: 'pinterest', type: 'Épingle résultats',
    visualDescription: 'Épingle "MES RÉSULTATS AMAZON KDP" avec screenshot flou des ventes. Chiffres en gros. Fond blanc.',
    content: `📈 MES RÉSULTATS AMAZON KDP

• 2023 : 0 livre publié
• 2024 : 18 livres (méthode manuelle)
• 2025-2026 : 35+ livres (avec EbookStudio)

⏱️ Temps moyen : 47 min/livre
💰 Coût moyen : 0,30€/livre
📊 Revenus : passifs et croissants

L'outil est maintenant public.
Testez gratuitement → ebookstudio.fr

📌 Enregistrez cette épingle !`,
    hashtags: ['resultats', 'kdp', 'amazon', 'revenuspassifs', 'ebook', 'ia', 'motivation', 'sidehustle']
  },

  // === X (TWITTER) ===
  {
    id: 'x-1', platform: 'x', type: 'Thread viral',
    visualDescription: 'Pas de visuel nécessaire — thread texte pur. Optionnel : screenshot profil Amazon.',
    content: `🧵 J'ai publié 35 livres sur Amazon sans écrire une seule ligne.

Voici comment (thread) ↓

1/ Le problème : écrire un livre prend des semaines.
La solution : l'IA le fait en 47 minutes.

2/ Mon outil : EbookStudio Pro
- Plan structuré en 30 sec
- Chapitres rédigés par IA (Gemini 3 Flash)
- Couverture pro en 1 clic
- Export KDP automatique

3/ Le coût ? ~0,30€ par livre.
Oui, trente centimes.

4/ Le calcul :
52 livres/an × 50€/mois = 2600€/mois en revenus passifs.

5/ Mes résultats sont publics :
amazon.fr/Mr-Georges-Boubet

6/ L'outil est maintenant accessible à tous.
Démo gratuite (sans CB) : ebookstudio.fr/demo

RT si vous connaissez quelqu'un qui rêve de publier un livre 📖`,
    hashtags: ['KDP', 'Amazon', 'IA', 'RevenusPassifs', 'SelfPublishing', 'Business']
  },
  {
    id: 'x-2', platform: 'x', type: 'Tweet unique percutant',
    visualDescription: 'Pas de visuel — tweet texte seul.',
    content: `En 2023 j'écrivais un livre en 3 semaines.

En 2026 j'en publie 3 par semaine.

Ce qui a changé ? Un outil à 0,30€/livre.

35 livres sur Amazon. Profil public.

La démo est gratuite : ebookstudio.fr/demo`,
    hashtags: ['KDP', 'IA', 'Amazon', 'Business']
  },
  {
    id: 'x-3', platform: 'x', type: 'Tweet question',
    visualDescription: 'Optionnel : meme "waiting skeleton" avec texte "me waiting to finish my book".',
    content: `Sondage honnête :

Qui a une idée de livre depuis +6 mois mais n'a jamais commencé ? 🙋

(J'avais le même problème. Puis j'ai créé un outil qui fait le travail en 47 min pour 0,30€.)

RT pour voir combien on est 😅`,
    hashtags: ['écriture', 'livre', 'KDP', 'procrastination']
  },
];
