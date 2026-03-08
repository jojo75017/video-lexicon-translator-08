
export interface SalesEmail {
  id: string;
  day: string;
  subject: string;
  preheader: string;
  strategy: string;
  body: string;
}

export interface SocialPost {
  id: string;
  platform: 'tiktok' | 'facebook' | 'linkedin' | 'pinterest' | 'instagram';
  type: string;
  content: string;
  hashtags: string[];
  hook?: string;
}

export const salesEmailSequence: SalesEmail[] = [
  {
    id: 'email-1-curiosite',
    day: 'J+0 (Immédiat)',
    subject: '📖 J\'ai généré 150 pages en 47 minutes... voici comment',
    preheader: 'Le secret des auteurs qui publient un livre par semaine sur Amazon',
    strategy: 'CURIOSITÉ — Révéler un résultat choquant pour captiver immédiatement',
    body: `Bonjour [PRÉNOM],

Je vais être direct avec vous.

La semaine dernière, j'ai publié mon 36ème livre sur Amazon.
Pas en 3 mois. Pas en 3 semaines.

**En 47 minutes.**

150 pages. Structurées. Illustrées. Prêtes pour KDP.

Quand j'ai commencé sur Amazon il y a 2 ans, un seul livre me prenait 3 semaines.
Aujourd'hui ? Je peux en sortir un par jour si je le veux.

**Ce qui a changé ?**

J'ai construit un outil. Un vrai générateur d'ebooks propulsé par l'IA la plus avancée du marché (Gemini 3 Flash).

Et aujourd'hui, je vous ouvre les portes.

🔥 **EbookStudio Pro 2026** — L'usine à ebooks que j'utilise personnellement :

→ 300+ idées de titres par niche rentable
→ Plan complet généré en 30 secondes
→ Chapitres rédigés avec votre ton et votre style
→ Couvertures professionnelles en 1 clic
→ Export direct PDF/EPUB prêt pour Amazon KDP
→ Coût par ebook : environ 0,30€ (oui, trente centimes)

Je ne vous demande pas de me croire sur parole.

👉 **Testez gratuitement la démo** : [LIEN DEMO]

Vous verrez un plan complet généré sous vos yeux en temps réel. Pas de carte bancaire, pas d'engagement.

Et si ça vous plaît (spoiler : ça va vous plaire), l'offre Fondateur à **97€** ne durera pas éternellement.

À vous de jouer,
**Georges**

P.S: Mon profil Amazon avec mes 35+ livres publiés : https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7
La preuve que ça marche, c'est sous vos yeux.`
  },
  {
    id: 'email-2-douleur',
    day: 'J+2',
    subject: '⚠️ Les 3 erreurs qui tuent 90% des auteurs KDP',
    preheader: 'Erreur #2 est celle que TOUT LE MONDE fait...',
    strategy: 'DOULEUR + SOLUTION — Identifier les frustrations et positionner l\'outil comme remède',
    body: `[PRÉNOM],

Savez-vous pourquoi 90% des gens qui veulent publier sur Amazon... n'y arrivent jamais ?

Ce n'est pas le talent. Ce n'est pas l'argent. Ce n'est pas la chance.

Ce sont ces 3 erreurs fatales :

❌ **ERREUR #1 : Écrire sans plan**
Ils commencent à écrire la page 1... et abandonnent à la page 12.
Sans structure, pas de livre. C'est mathématique.

❌ **ERREUR #2 : Passer 3 semaines sur un seul livre**
Pendant qu'ils peaufinent leur premier chapitre, d'autres publient leur 5ème ebook.
Sur KDP, la quantité ET la qualité gagnent.

❌ **ERREUR #3 : Négliger la couverture et les mots-clés**
Un excellent livre avec une mauvaise couverture = 0 vente.
Un bon livre avec les mauvais mots-clés = invisible sur Amazon.

**La bonne nouvelle ?**

EbookStudio Pro résout ces 3 problèmes en même temps :

✅ Plan structuré automatiquement → Plus d'abandon
✅ Génération en 47 min → Production rapide
✅ Couvertures pro + optimisation KDP intégrée → Visibilité maximale

Et le tout pour un coût de production ridicule : ~0,30€ par livre.

Comparez avec un ghostwriter à 500€... ou un designer à 150€ la couverture.

📊 **Le calcul est simple** :
- 1 ebook/semaine × 52 semaines = 52 livres par an
- Coût total : ~15€ de production
- Revenus potentiels : les auteurs KDP actifs gagnent entre 500€ et 5000€/mois

👉 **Découvrir EbookStudio Pro** : [LIEN OFFRES]

L'offre Fondateur à 97€ (au lieu de 297€) est disponible quelques jours encore.

Georges

P.S: Si vous hésitez, commencez par la démo gratuite. Zéro risque : [LIEN DEMO]`
  },
  {
    id: 'email-3-preuve-sociale',
    day: 'J+4',
    subject: '💰 De 0 à 35 livres Amazon — Mon parcours transparent',
    preheader: 'Chiffres réels, résultats réels, outil réel.',
    strategy: 'PREUVE SOCIALE — Démontrer la crédibilité avec des résultats concrets',
    body: `[PRÉNOM],

Aujourd'hui, pas de pitch. Juste des faits.

📊 **Mon parcours Amazon KDP en chiffres** :

• 2023 : 0 livre publié
• 2024 : 18 livres publiés (méthode manuelle, 2-3 semaines par livre)
• 2025-2026 : 35+ livres publiés (avec EbookStudio, 1-2 jours par livre)

**Ce qui a fait la différence ?**

Quand j'ai automatisé le processus, tout a changé :
- Le plan se génère en 30 secondes
- Les chapitres s'écrivent en quelques minutes
- La couverture est prête instantanément
- L'optimisation KDP (mots-clés, catégories, description) est intégrée

🎯 **Le résultat** : Je suis passé de "auteur amateur frustré" à "éditeur prolifique" en quelques mois.

Et je n'ai pas gardé cet outil pour moi. Je l'ai transformé en plateforme complète pour que VOUS puissiez faire pareil.

**EbookStudio Pro 2026 inclut** :
📝 Générateur IA (Gemini 3 Flash — le plus performant)
🎨 Créateur de couvertures pro
🔊 Convertisseur en livre audio (Azure Neural)
📊 Dashboard marketing complet
📌 Outils Pinterest, LinkedIn, Quora intégrés
📧 Système email marketing inclus

**Le tout à 97€** (paiement unique, pas d'abonnement).

Ou en facilités : 3×35€ ou 5×22€.

👉 **Accéder à l'offre Fondateur** : [LIEN OFFRES]

Vérifiez par vous-même : mes livres sont sur Amazon, mon nom est public, mes résultats sont transparents.

Cordialement,
**Georges Boubet**
Auteur Amazon & Créateur d'EbookStudio
https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`
  },
  {
    id: 'email-4-urgence',
    day: 'J+6',
    subject: '⏰ [Dernière chance] L\'offre Fondateur disparaît dans 48h',
    preheader: 'Après ça, le prix passe à 297€. Point final.',
    strategy: 'URGENCE + FOMO — Créer un sentiment d\'urgence légitime',
    body: `[PRÉNOM],

Je serai bref.

L'offre **Fondateur EbookStudio Pro** à 97€ se termine dans **48 heures**.

Après ? Le prix passe à **297€**. Et ce n'est pas du marketing. C'est la valeur réelle de l'outil.

🧮 **Faisons les comptes ensemble** :

| Ce que vous obtenez | Valeur marché |
|---|---|
| Générateur IA illimité | 197€ |
| Créateur de couvertures | 97€ |
| Convertisseur livre audio | 147€ |
| Dashboard marketing | 97€ |
| Outils réseaux sociaux | 67€ |
| Templates email marketing | 47€ |
| Optimisateur KDP complet | 97€ |
| **TOTAL** | **749€** |

**Votre prix aujourd'hui : 97€** (soit -87%)

Et si 97€ d'un coup c'est trop :
💳 3 × 35€ ou 5 × 22€

🎁 **BONUS inclus (valeur 394€)** :
• Pack 300+ idées de titres rentables
• Guide "10 Niches KDP Rentables 2026"
• Accès au groupe privé
• Mises à jour à vie
• Support par visioconférence Zoom

⚡ **Rappel** : Le coût par ebook généré est d'environ 0,30€.
Votre investissement de 97€ est rentabilisé dès votre premier livre vendu.

👉 **J'accède à l'offre Fondateur** : [LIEN OFFRES]

Ou testez d'abord gratuitement : [LIEN DEMO]

Après vendredi, cette page n'existera plus à ce prix.

Georges

P.S: Je ne relancerai pas après cet email. La décision vous appartient.`
  },
  {
    id: 'email-5-dernier-appel',
    day: 'J+7',
    subject: '🔒 C\'est terminé ce soir à minuit',
    preheader: 'Votre dernière chance de rejoindre les fondateurs.',
    strategy: 'DERNIER APPEL — Émotion + vision du futur + fermeture',
    body: `[PRÉNOM],

Dernier email. Dernier appel.

Ce soir à minuit, l'offre Fondateur EbookStudio Pro à 97€ se ferme définitivement.

Je ne vais pas vous resservir les arguments. Vous les connaissez.

À la place, laissez-moi vous poser une question :

**Où serez-vous dans 90 jours ?**

📍 **Scénario A** : Vous n'avez rien changé.
Toujours cette idée de livre dans un coin de votre tête.
Toujours "je le ferai quand j'aurai le temps".
Le temps ne vient jamais.

📍 **Scénario B** : Vous avez agi aujourd'hui.
Vous avez 10, 15, peut-être 20 ebooks sur Amazon.
Vos premiers revenus passifs tombent.
Vous avez une vraie activité d'éditeur numérique.

La seule différence entre A et B ?

**Un clic. Aujourd'hui.**

👉 **Rejoindre les Fondateurs** : [LIEN OFFRES]

Merci d'avoir lu mes emails cette semaine, [PRÉNOM].

Quoi que vous décidiez, je vous souhaite le meilleur dans vos projets.

Mais si une petite voix vous dit "et si ça marchait pour moi ?"...

Écoutez-la. Juste cette fois.

À bientôt de l'autre côté,
**Georges**

---
📖 35+ livres publiés sur Amazon
🛠️ Créateur d'EbookStudio Pro
🔗 amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7`
  }
];

export const socialMediaPosts: SocialPost[] = [
  // TikTok / Reels
  {
    id: 'tiktok-1',
    platform: 'tiktok',
    type: 'Hook viral',
    hook: '0-3s: Montrer le chrono à 47min avec un ebook fini à l\'écran',
    content: `🤯 J'ai généré un ebook COMPLET en 47 minutes.

150 pages. Structurées. Illustrées. Prêtes pour Amazon.

Voici ce que l'IA a fait pour moi :
✅ Plan en 30 secondes
✅ 12 chapitres rédigés
✅ Couverture pro générée
✅ Optimisation KDP automatique

Coût total ? 0,30€. Oui, TRENTE CENTIMES.

Pendant que certains passent 3 mois sur un livre...
Moi j'en publie 3 par semaine. 📚

🔗 Lien en bio pour tester GRATUITEMENT
#ebookstudio #kdp #amazon #ia #revenus`,
    hashtags: ['ebookstudio', 'kdp', 'amazon', 'ia', 'revenuspassifs', 'autoedition', 'selfpublishing', 'ebook', 'business', 'sideproject']
  },
  {
    id: 'tiktok-2',
    platform: 'tiktok',
    type: 'Avant/Après',
    hook: '0-3s: Split screen — galère vs facilité',
    content: `AVANT EbookStudio :
😩 3 semaines pour UN livre
😩 500€ de ghostwriter
😩 150€ pour la couverture
😩 0 vente car mauvais mots-clés

APRÈS EbookStudio :
🚀 47 min pour un livre complet
🚀 0,30€ de coût
🚀 Couverture pro incluse
🚀 Optimisation Amazon intégrée

35 livres publiés. Les résultats sont sur Amazon. Mon nom est public.

📖 La preuve → amazon.fr (lien en bio)
🆓 Tester gratuitement → ebookstudio.fr`,
    hashtags: ['avantapres', 'kdp', 'amazon', 'ebook', 'ia', 'ebookstudio', 'transformation', 'auteur', 'business2026']
  },
  // Facebook
  {
    id: 'fb-1',
    platform: 'facebook',
    type: 'Post groupe "Revenus Passifs"',
    content: `📖 [RETOUR D'EXPÉRIENCE] Comment je publie 3 ebooks/semaine sur Amazon KDP

Salut le groupe 👋

Je partage rarement mes résultats, mais là c'est trop gros pour garder ça pour moi.

En 2023, je galérais à sortir UN livre en 3 semaines.
Aujourd'hui ? J'ai 35+ livres sur Amazon, et j'en sors 2-3 par semaine.

Mon secret ? J'ai développé un générateur d'ebooks propulsé par l'IA (Gemini 3 Flash).

Ce que l'outil fait concrètement :
→ Il génère un plan structuré en 30 sec
→ Il rédige les chapitres avec MON style
→ Il crée la couverture professionnelle
→ Il optimise les mots-clés Amazon
→ Il exporte en PDF/EPUB prêt pour KDP

Coût par ebook : ~0,30€ (le prix de l'API)

J'ai ouvert l'accès au public pour la première fois.

Si ça intéresse quelqu'un :
🆓 Démo gratuite (sans CB) : [LIEN]
💰 Offre Fondateur à 97€ (au lieu de 297€) : [LIEN]

Posez vos questions en commentaire, je réponds à tout ! 👇`,
    hashtags: ['revenus passifs', 'kdp', 'amazon', 'ebook', 'ia', 'autoedition']
  },
  {
    id: 'fb-2',
    platform: 'facebook',
    type: 'Publicité Facebook Ads',
    content: `🚀 Créez votre premier ebook en 47 minutes grâce à l'IA

Vous rêvez de publier un livre sur Amazon mais vous n'avez pas le temps ?

EbookStudio Pro génère votre ebook de A à Z :
📝 Plan → Chapitres → Couverture → Export KDP

✅ 35+ livres publiés par le créateur
✅ Coût par ebook : 0,30€
✅ Aucune compétence technique requise

🎁 Démo 100% gratuite — sans carte bancaire

[BOUTON : Essayer gratuitement]`,
    hashtags: ['ebookstudio', 'kdp', 'amazon', 'ebook', 'ia']
  },
  // LinkedIn
  {
    id: 'li-1',
    platform: 'linkedin',
    type: 'Post storytelling',
    content: `Il y a 2 ans, j'avais une idée de livre.

Comme tout le monde, je me suis dit "un jour, j'écrirai".

Ce "un jour" a duré des mois.

Puis j'ai découvert l'IA générative. Et j'ai eu une autre idée :

"Et si je construisais un outil qui écrit mieux et plus vite que moi ?"

Résultat en 2026 :
→ 35+ livres publiés sur Amazon
→ Un générateur d'ebooks complet (EbookStudio Pro)
→ Technologie Gemini 3 Flash + Azure Neural
→ Coût de production par livre : 0,30€

Aujourd'hui, je rends cet outil accessible.

Pas pour remplacer les auteurs. Pour leur donner un avantage injuste.

Un plan structuré en 30 secondes.
Des chapitres rédigés dans votre style.
Des couvertures professionnelles en 1 clic.
Un export KDP prêt à publier.

Si vous êtes entrepreneur, freelance, coach, ou expert...
Vous avez un livre en vous. Cet outil le fait sortir.

🔗 Lien en commentaire pour tester gratuitement.

---
#IA #KDP #Amazon #Entrepreneuriat #SelfPublishing #EdTech #Innovation`,
    hashtags: ['IA', 'KDP', 'Amazon', 'Entrepreneuriat', 'SelfPublishing', 'EdTech', 'Innovation', 'EbookStudio']
  },
  {
    id: 'li-2',
    platform: 'linkedin',
    type: 'Post chiffres',
    content: `📊 Le business model le plus sous-estimé de 2026 :

Publier des ebooks sur Amazon KDP.

Voici pourquoi (avec des vrais chiffres) :

💰 Investissement initial : 97€ (outil) + ~0,30€/livre (API)
📈 Potentiel : 500€ à 5000€/mois en revenus passifs
⏱️ Temps par livre : 47 minutes
📚 Pas de stock, pas de logistique, pas de SAV

Le calcul est simple :
→ 1 ebook/semaine = 52 livres/an
→ Si chaque livre rapporte 50€/mois = 2600€/mois de revenus passifs

Ce n'est pas de la théorie. J'ai 35+ livres publiés.
Mon profil Amazon est public.

L'outil que j'utilise ? Je l'ai construit moi-même et je l'ouvre au public.

Commentez "EBOOK" et je vous envoie le lien de la démo gratuite.

#RevenusPassifs #KDP #Amazon #Business #IA #Entrepreneuriat`,
    hashtags: ['RevenusPassifs', 'KDP', 'Amazon', 'Business', 'IA', 'Entrepreneuriat']
  },
  // Pinterest
  {
    id: 'pin-vente-1',
    platform: 'pinterest',
    type: 'Épingle de vente',
    content: `📖 CRÉEZ VOTRE EBOOK EN 47 MINUTES

L'IA qui transforme vos idées en livres prêts pour Amazon KDP

✨ Ce que fait EbookStudio Pro :
→ Génère le plan complet automatiquement
→ Rédige 12+ chapitres structurés
→ Crée une couverture professionnelle
→ Optimise les mots-clés Amazon
→ Exporte en PDF/EPUB

💰 Coût par ebook : 0,30€
📚 35+ livres publiés par le créateur

🆓 Démo gratuite sur ebookstudio.fr

📌 Enregistrez pour ne pas oublier !`,
    hashtags: ['ebook', 'kdp', 'amazon', 'autoedition', 'ia', 'ebookstudio', 'revenuspassifs', 'ecriture', 'auteur', 'selfpublishing']
  },
  // Instagram
  {
    id: 'ig-1',
    platform: 'instagram',
    type: 'Carrousel éducatif',
    content: `📖 Comment j'ai publié 35 livres sur Amazon grâce à l'IA

SLIDE 1 : "35 livres publiés. Temps moyen : 47 min/livre."

SLIDE 2 : "❌ L'ancienne méthode : 3 semaines, 500€+ de ghostwriter"

SLIDE 3 : "✅ Ma méthode : EbookStudio Pro — plan en 30s, chapitres en minutes"

SLIDE 4 : "Le coût ? 0,30€ par ebook. Oui, trente centimes."

SLIDE 5 : "Ce que l'outil génère : plan + chapitres + couverture + optimisation KDP"

SLIDE 6 : "Résultats visibles sur Amazon — profil public en bio"

SLIDE 7 : "🆓 Testez gratuitement → ebookstudio.fr (lien en bio)"

---
Légende : J'ai passé 2 ans à perfectionner cet outil. Aujourd'hui, je le partage.

Si vous avez un livre en vous mais pas le temps de l'écrire... c'est fait pour vous.

Lien en bio 👆`,
    hashtags: ['ebookstudio', 'kdp', 'amazon', 'ebook', 'ia', 'selfpublishing', 'autoedition', 'revenuspassifs', 'auteur', 'business2026']
  }
];
