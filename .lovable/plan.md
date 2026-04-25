## Plan Marketing EbookStudio — Tunnel + Contenus pour Systeme.io

**Objectif unique** : Vendre l'abonnement EbookStudio à 67€/an
**Format livrable** : Textes structurés bloc par bloc (compatibles éditeur Systeme.io) + maquettes HTML d'aperçu visuel + emails en HTML prêt à coller.

Aucune modification de l'app. Tout est livré dans `/mnt/documents/marketing-systemeio/`.

---

### 📦 Comment chaque livrable s'utilise dans Systeme.io

**Pour les pages du tunnel** :
- Tu ouvres la maquette HTML dans ton navigateur → tu vois le rendu cible
- Tu ouvres le fichier `.md` correspondant qui liste, bloc par bloc :
  ```
  BLOC 1 — Bandeau urgence
  Texte : ⚡ Offre fondateur — 67€/an au lieu de 147€
  
  BLOC 2 — Titre principal (H1)
  Texte : Publiez votre ebook sur Amazon KDP ce soir
  Sous-titre : Sans écrire une seule ligne — l'IA s'en charge
  
  BLOC 3 — Bouton CTA
  Texte bouton : 🚀 Démarrer mes 7 jours gratuits
  Couleur : Orange #F59E0B
  Lien : /checkout
  
  BLOC 4 — Image
  Suggestion : Capture d'écran du workflow 15 agents
  ```
- Tu reproduis dans l'éditeur drag & drop Systeme.io en suivant cet ordre

**Pour les emails** :
- Chaque email livré en 2 versions : texte simple ET HTML complet
- Tu colles directement dans le mode "HTML" de Systeme.io (objet + preview + corps)

**Pour les réseaux sociaux** :
- Texte brut prêt à publier avec hashtags + CTA + suggestions visuelles

---

### 📁 Structure complète du dossier

```text
/mnt/documents/marketing-systemeio/
│
├── 00-DEMARRAGE-RAPIDE.md          ← Comment utiliser ce dossier (10 min de lecture)
├── 00-CARTE-DU-TUNNEL.md           ← Schéma + KPIs + planning de mise en place
│
├── 01-TUNNEL-VENTE/
│   ├── page-1-capture/
│   │   ├── structure-blocs.md      ← Liste bloc par bloc pour Systeme.io
│   │   └── apercu.html             ← Maquette visuelle à ouvrir dans navigateur
│   ├── page-2-vente-principale/    ← (pareil : structure + apercu)
│   ├── page-3-checkout/
│   ├── page-4-upsell/
│   ├── page-5-downsell/
│   ├── page-6-thank-you/
│   └── lead-magnet-pdf/
│       └── contenu-pdf.md          ← Contenu du PDF "10 niches KDP 2026"
│
├── 02-EMAILS-AUTOMATISES/
│   ├── README-comment-installer.md
│   ├── sequence-bienvenue-7j/
│   │   ├── email-1-jour-0.html     ← HTML prêt à coller
│   │   ├── email-1-jour-0.txt      ← Version texte
│   │   ├── email-2-jour-1.html
│   │   └── ... (7 emails)
│   ├── sequence-vente-5j/          ← 5 emails
│   ├── sequence-onboarding-14j/    ← 14 emails post-achat
│   ├── sequence-relance-panier/    ← 3 emails abandon
│   └── sequence-reactivation/      ← 4 emails inactifs
│
├── 03-RESEAUX-SOCIAUX/
│   ├── instagram-30-posts.md       ← 30 posts (carrousels, reels, stories)
│   ├── tiktok-30-scripts.md        ← 30 scripts vidéos courtes
│   ├── linkedin-20-posts.md        ← 20 posts B2B
│   ├── pinterest-50-pins.md        ← 50 idées de pins SEO
│   └── calendrier-90-jours.md      ← Planning jour par jour
│
├── 04-PUBLICITES/
│   ├── meta-ads-10-creatives.md    ← 10 angles testables
│   └── google-ads.md               ← Mots-clés + annonces
│
├── 05-COPYWRITING-ASSETS/
│   ├── 50-headlines.md
│   ├── 30-bullets-benefices.md
│   ├── 15-objections-reponses.md
│   ├── temoignages-templates.md
│   └── 40-ctas.md
│
└── marketing-systemeio.zip         ← Tout zippé pour téléchargement
```

---

### 🎯 Architecture du tunnel

```text
TRAFIC (réseaux sociaux, ads, SEO)
        ↓
[Page 1] CAPTURE EMAIL — lead magnet PDF gratuit
        ↓ → Email livraison + Séquence Bienvenue 7j
        ↓
[Page 2] PAGE DE VENTE — 67€/an, garantie 7j
        ↓
[Page 3] CHECKOUT — formulaire commande Systeme.io
        ↓
[Page 4] UPSELL +47€ ─── refus ─→ [Page 5] DOWNSELL -50%
        ↓                                ↓
[Page 6] THANK YOU + accès EbookStudio + Onboarding 14j

Si pas d'achat après bienvenue → Séquence Vente 5j
Si abandon checkout → Séquence Relance Panier (1h, 24h, 72h)
Si inactif 30j+ → Séquence Réactivation
```

---

### 📝 Ce que contiendra chaque page (exemple page de vente)

12 sections détaillées bloc par bloc :
1. Bandeau urgence
2. Headline + sous-headline + vidéo
3. Pitch en 1 phrase
4. Problème (5 douleurs auteurs KDP)
5. Solution (présentation EbookStudio)
6. "Ce que vous obtenez" (44 outils)
7. Démo en 4 étapes (Préparer → Écrire → Publier → Vendre)
8. Témoignages (5 modèles)
9. Comparatif Avant/Après
10. Tarif 67€/an + bonus
11. Garantie 7 jours
12. FAQ (12 objections) + CTA final

---

### 📧 Détail des séquences emails

**Bienvenue 7j** (post-inscription gratuite) :
- J0 livraison lead magnet · J1 histoire fondateur · J2 étude de cas · J3 démo workflow · J4 réponse objection · J5 comparatif vs concurrents · J6 témoignages · J7 offre 67€

**Vente 5j** (déclenchée si pas d'achat) :
- E1 storytelling · E2 ROI · E3 objections · E4 urgence · E5 dernière chance

**Onboarding 14j** (post-achat, rétention) :
- Quick wins, tutos outils-clés, success stories, parrainage, demande d'avis

**Relance panier 3 emails** : 1h, 24h, 72h après abandon

**Réactivation 4 emails** : pour inactifs 30+ jours

---

### 🎨 Cohérence avec ta marque

Tous les textes respectent :
- **Ton** : Direct, concret, orienté résultat (style FunnelStepsBar/TonightOutcomes déjà sur ton site)
- **Promesse** : "Publiez votre ebook sur Amazon KDP ce soir, sans écrire une ligne"
- **Prix** : 67€/an (tarif lancement, mémoire `subscription-model-2026`)
- **Garantie** : 7 jours d'essai gratuit
- **Preuves** : Workflow 15 agents, Imagen 3, +5000 auteurs
- **Fondateur** : Georges (boubetgeorges@gmail.com)
- **Couleurs maquettes** : Orange #F59E0B / amber 600, accent KDP (charte existante)

---

### 📊 Volume estimé

- 6 pages de tunnel (structure blocs + maquettes HTML)
- 33 emails complets (HTML + texte)
- 130+ posts/scripts réseaux sociaux
- Calendrier éditorial 90 jours
- 10 angles publicitaires + mots-clés Google
- 150+ assets copywriting

**~80 000 mots de contenu prêt à publier.**

---

### ✅ Ce que tu auras à faire dans Systeme.io

1. **Pages** : Créer 6 pages → reproduire bloc par bloc dans l'éditeur (max 30 min/page en suivant le `.md`)
2. **Emails** : Créer 5 séquences → coller chaque email en mode HTML (5 min/email)
3. **Automatisations** : Brancher les déclencheurs (inscription → bienvenue, achat → onboarding, abandon → relance)
4. **Réseaux sociaux** : Suivre le calendrier 90 jours

---

Approuve ce plan et je génère immédiatement tous les fichiers + le ZIP final téléchargeable.