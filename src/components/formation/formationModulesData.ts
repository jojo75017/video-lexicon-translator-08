import { 
  Rocket, Zap, PenTool, Workflow, Brain, Palette, 
  Upload, Megaphone, Mic, User, Route, CheckSquare,
  ChefHat, Map, FileText, BookOpen, Sparkles, Image
} from 'lucide-react';

// Import des 12 images de modules existantes
import module01 from '@/assets/formation/module-01-introduction.jpg';
import module02 from '@/assets/formation/module-02-generators.jpg';
import module03 from '@/assets/formation/module-03-creation.jpg';
import module04 from '@/assets/formation/module-04-workflow.jpg';
import module05 from '@/assets/formation/module-05-moteur-ia.jpg';
import module06 from '@/assets/formation/module-06-visuels.jpg';
import module07 from '@/assets/formation/module-07-publication.jpg';
import module08 from '@/assets/formation/module-08-marketing.jpg';
import module09 from '@/assets/formation/module-09-audio.jpg';
import module10 from '@/assets/formation/module-10-compte.jpg';
import module11 from '@/assets/formation/module-11-workflow-recommande.jpg';
import module12 from '@/assets/formation/module-12-checklist.jpg';

export interface FormationModule {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  color: string;
  content: string;
  isNew?: boolean;
  category?: 'core' | 'specialized' | 'advanced';
}

export const formationModules: FormationModule[] = [
  // ===== MODULES PRINCIPAUX (1-12) =====
  {
    id: 1,
    title: "Introduction & Premiers Pas",
    shortTitle: "Intro",
    description: "Configurez votre espace de travail, comprenez l'architecture et lancez votre premier projet.",
    icon: Rocket,
    image: module01,
    color: "from-orange-500 to-amber-500",
    category: 'core',
    content: `## Bienvenue dans EbookStudio Pro 2026

### Ce que cette formation va vous apporter

EbookStudio Pro est un atelier de création littéraire complet propulsé par **Gemini 3 Flash**, le modèle d'IA de Google. En 18 modules, vous allez maîtriser chaque outil pour produire, publier et vendre des ebooks professionnels.

### Votre premier objectif : tout configurer en 10 minutes

**Étape 1 — Créer votre compte**
Rendez-vous sur ebookstudio.fr et entrez votre code d'accès EBK-XXXXXX reçu par email. Votre espace de travail se crée automatiquement avec tous les outils déverrouillés.

**Étape 2 — Configurer votre clé API Gemini**
L'intelligence artificielle fonctionne avec votre propre clé Gemini 3 Flash (gratuite jusqu'à 1500 requêtes/jour) :
1. Ouvrez **aistudio.google.com** et connectez-vous avec votre compte Google
2. Cliquez sur **"Get API Key"** → **"Create API Key"**
3. Copiez la clé et collez-la dans **Mon Compte → Paramètres → Clé API Gemini**
4. Cliquez sur "Tester la clé" pour vérifier — un message vert confirme la connexion

> 💡 **Coût réel** : environ 0,15€ à 0,40€ par ebook complet. La clé gratuite couvre largement vos premiers livres.

**Étape 3 — Découvrir l'interface**
- **Sidebar gauche** : 14 catégories d'outils organisées par couleur
- **Zone centrale** : votre espace de travail principal
- **Barre supérieure** : progression du workflow, notifications, mode sombre

### Les 5 piliers de la plateforme

| Pilier | Description | Modules |
|--------|-------------|---------|
| 📝 Rédaction | Écriture assistée par IA, brouillon rapide, éditeur enrichi | 2, 3 |
| 🤖 Workflow IA | Moteur éditorial en 14 étapes automatisées | 4, 5 |
| 🎨 Design | Couvertures, illustrations, 4ème de couverture | 6 |
| 📦 Publication | Export PDF/EPUB/Word, anti-plagiat, Amazon KDP | 7 |
| 📣 Marketing | Ads, SEO, réseaux sociaux, plan de lancement | 8 |

### Offre Pro Lifetime
- 🎯 **Accès Pro à 67€** — Paiement unique, accès à vie
- 📈 Tarif de lancement limité (ensuite 197€)
- 🚀 Toutes les mises à jour futures incluses gratuitement
- 💬 Support prioritaire par email 7j/7`
  },
  {
    id: 2,
    title: "Générateurs Rapides IA",
    shortTitle: "Générateurs",
    description: "Maîtrisez les 10+ générateurs spécialisés pour produire n'importe quel type de livre.",
    icon: Zap,
    image: module02,
    color: "from-purple-500 to-pink-500",
    category: 'core',
    content: `## Les Générateurs IA Rapides

### Le concept : un livre en quelques clics

Chaque générateur est un workflow spécialisé qui produit un type de livre précis. Vous renseignez quelques paramètres (thème, ton, public) et l'IA fait le reste.

### 🚀 Livre Complet IA — Le Générateur Principal

C'est l'outil le plus puissant de la plateforme. Il enchaîne automatiquement les 14 étapes du workflow éditorial pour produire un ebook complet :

1. Vous entrez un titre et un genre
2. Le moteur lance P1 (analyse) → P2 (marché) → P3 (structure) → ... → P14 (verdict)
3. En 20 à 40 minutes, vous obtenez un manuscrit complet avec préface, chapitres et conclusion

> ⏱️ **Temps moyen** : 25 minutes pour un livre de 10 chapitres. Coût : ~0,30€ en tokens Gemini.

### Générateurs Spécialisés 2026

**🍳 Livres de Recettes**
- 40 recettes générées avec photos réalistes (Imagen 3)
- Accords vins automatiques pour chaque plat
- 125+ cuisines du monde disponibles
- Export PDF magazine professionnel

**🗺️ Guides de Voyage**
- 40 destinations illustrées par pays
- Photos de lieux générées par IA
- Conseils pratiques, budget, meilleure saison
- Format guide touristique prêt à vendre

**📋 Fiches Pratiques Bien-être**
- Collections thématiques : sommeil, stress, nutrition, énergie
- Illustrations aquarelle cohérentes
- Format A4 imprimable

**📚 Bandes Dessinées**
- Styles : Manga, Comics US, Franco-Belge
- Cohérence des personnages entre les cases
- Bulles de dialogue auto-générées
- Layouts 4, 6 ou 9 cases par page

**Autres générateurs** : Coloriages, Documentaires, Agendas, Encyclopédies, Atlas géographiques

### Conseil d'expert
Commencez par le **Livre Complet IA** pour votre premier projet. Une fois familiarisé avec le workflow, explorez les générateurs spécialisés pour diversifier votre catalogue.`
  },
  {
    id: 3,
    title: "Outils de Création & Rédaction",
    shortTitle: "Création",
    description: "Planificateur, Assistant IA, Import URL/YouTube/Word, Dictée vocale et Éditeur enrichi.",
    icon: PenTool,
    image: module03,
    color: "from-blue-500 to-cyan-500",
    category: 'core',
    content: `## Création & Rédaction Assistée

### Le Planificateur Avancé — Votre Centre de Commande

Avant d'écrire un seul mot, le Planificateur vous aide à structurer votre projet :
- **Titre & sous-titre** : suggestions IA basées sur les tendances KDP
- **Auteur** : nom de plume avec générateur de pseudonymes
- **Genre & sous-genre** : 50+ catégories avec conseils de positionnement
- **Public cible** : profil lecteur détaillé (âge, centres d'intérêt, niveau)
- **Nombre de chapitres** : recommandation basée sur le genre
- **Personnages** : fiches avec traits physiques, psychologiques, arcs narratifs

### L'Éditeur Enrichi (WYSIWYG)

Un véritable traitement de texte intégré avec :
- Mise en forme riche : gras, italique, titres H1-H4, listes
- Support Markdown natif (tapez \`## Titre\` pour un H2)
- Compteur de mots/caractères en temps réel
- Mode Focus : masque tout sauf le texte pour une concentration maximale
- Sauvegarde automatique toutes les 30 secondes

### L'Assistant IA Contextuel

Sélectionnez n'importe quel passage et l'assistant propose :
- **Développer** : enrichit le paragraphe avec des détails
- **Résumer** : condense un texte long
- **Reformuler** : propose 3 alternatives de style
- **Traduire** : 12 langues supportées
- **Corriger** : grammaire, orthographe, ponctuation

### Import Multi-Sources

| Source | Ce qui se passe |
|--------|----------------|
| 🔗 URL web | L'article est extrait, nettoyé et structuré en chapitres |
| 🎥 YouTube | La transcription est récupérée et convertie en ebook |
| 📄 Word/Doc | Le document est importé avec sa mise en forme |
| 🎙️ Dictée vocale | Whisper transcrit votre voix en temps réel |

### Mode Brouillon Rapide

Pour ceux qui veulent aller vite : entrez un titre et un genre, cliquez sur "Générer", et obtenez un brouillon complet en un clic. Vous pourrez l'affiner ensuite avec l'éditeur.

> 🎯 **Astuce Pro** : Utilisez le Planificateur pour définir votre vision, puis le Mode Brouillon pour la première version. Affinez ensuite avec l'Éditeur Enrichi.`
  },
  {
    id: 4,
    title: "Workflow Éditorial (P1-P8)",
    shortTitle: "Workflow P1-P8",
    description: "Les 8 premières étapes du moteur éditorial professionnel propulsé par Gemini 3 Flash.",
    icon: Workflow,
    image: module04,
    color: "from-teal-500 to-green-500",
    category: 'advanced',
    content: `## Le Workflow Éditorial Professionnel — Partie 1

### Architecture du moteur

Le workflow éditorial est le cœur d'EbookStudio. Il s'inspire des processus d'une maison d'édition professionnelle, automatisés grâce à Gemini 3 Flash. Chaque étape (P1 à P14) traite un aspect précis de la production éditoriale.

### P1 — Directeur Éditorial 🎯

Le Directeur analyse votre concept et produit :
- **Score de potentiel commercial** (0-100) basé sur la demande KDP
- **3 suggestions de titres** optimisés pour le référencement Amazon
- **Analyse du positionnement** : niche, concurrence, prix recommandé
- **Profil lecteur** : qui va acheter ce livre et pourquoi

> 💡 Ne lancez jamais un projet avec un score inférieur à 60. Ajustez le titre ou le genre et relancez P1.

### P2 — Analyste de Marché 📊

Génère une fiche marché complète :
- 7 mots-clés KDP optimisés (volume de recherche estimé)
- 2 catégories BISAC recommandées
- Analyse des 5 premiers concurrents
- Prix optimal avec simulation des royalties (35% vs 70%)
- Fenêtre de publication idéale

### P3 — Architecte de Contenu 🏗️

Crée la structure complète du manuscrit :
- Préface calibrée (500-800 mots)
- Plan détaillé : titre + synopsis de chaque chapitre
- Objectif de mots par chapitre
- Fils rouges narratifs et transitions
- Conclusion avec appel à l'action

### P4 — Rédacteur Expert ✍️

Génère le contenu chapitre par chapitre en respectant :
- Le plan de P3
- Le ton défini (académique, conversationnel, narratif...)
- La longueur cible par chapitre
- Les personnages et leur voix propre (fiction)

### P5 — Réécriture Naturelle 🔄

Humanise le texte pour le rendre indétectable par les outils anti-IA :
- Variation de la longueur des phrases
- Insertion d'expressions idiomatiques
- Diversification du vocabulaire
- Ajout de tournures personnelles

### P6 — Éditeur Qualité ✅

Vérifie et corrige :
- Grammaire et orthographe avancée
- Cohérence des noms, lieux, dates
- Répétitions et tics de langage
- Lisibilité (score Flesch-Kincaid)
- Équilibre des chapitres en longueur

### P7 — Packaging Éditorial 📦

Prépare les éléments commerciaux :
- Description Amazon (4000 caractères, formatée HTML)
- Biographie d'auteur professionnelle
- Argumentaire de vente en 3 points
- Accroche de couverture

### P8 — Diagnostic Pré-Publication 🔍

Rapport complet avant publication :
- Checklist de conformité KDP
- Points forts et axes d'amélioration
- Recommandations finales
- Estimation du potentiel de vente

> ⚡ **En pratique** : le "Livre Complet IA" enchaîne P1 à P8 automatiquement. Vous pouvez aussi lancer chaque étape individuellement pour plus de contrôle.`
  },
  {
    id: 5,
    title: "Moteur IA Avancé (P9-P14)",
    shortTitle: "Moteur IA V2",
    description: "Mémoire éditoriale, cohérence narrative, auto-critique et verdict final de qualité.",
    icon: Brain,
    image: module05,
    color: "from-violet-500 to-purple-500",
    category: 'advanced',
    content: `## Le Moteur IA Avancé — Partie 2

### Pourquoi ces 6 étapes supplémentaires ?

Les étapes P1-P8 produisent un manuscrit solide. Les étapes P9-P14 le transforment en livre de qualité professionnelle grâce à des mécanismes d'auto-amélioration.

### P9 — Mémoire Éditoriale 🧠

Le système conserve le contexte complet du projet entre les sessions :
- Résumé de chaque chapitre généré
- Profil des personnages et leurs interactions
- Fils narratifs en cours et résolus
- Ton et style définis

**Pourquoi c'est important** : sans mémoire, chaque génération repartait de zéro et pouvait contredire les chapitres précédents. P9 élimine ce problème.

### P10 — Cohérence Inter-Chapitres 🔗

Analyse croisée de tous les chapitres pour détecter :
- Contradictions factuelles (un personnage blond au ch.2 devenu brun au ch.7)
- Incohérences temporelles (dates, saisons, âges)
- Ruptures de ton (passage brutal du formel à l'informel)
- Arcs narratifs inachevés

Le système produit un rapport et corrige automatiquement les incohérences détectées.

### P11 — Auto-Critique IA 🔎

L'IA adopte le rôle d'un lecteur critique exigeant :
- Évalue la tension narrative par chapitre (graphique)
- Identifie les passages faibles ou redondants
- Propose des améliorations concrètes avec exemples
- Note chaque chapitre individuellement

### P12 — Boucle Itérative 🔁

Applique les corrections de P11 automatiquement :
- Réécrit les passages identifiés comme faibles
- Renforce les transitions entre chapitres
- Enrichit les descriptions et dialogues
- Peut tourner 2-3 fois jusqu'à atteindre le seuil de qualité

### P13 — Signature Stylistique ✨

Définit et maintient votre voix d'auteur :
- Analyse votre style à partir de vos textes existants
- Crée un profil stylistique (longueur de phrases, vocabulaire, rythme)
- Applique ce profil à tout le manuscrit
- Garantit une cohérence de voix sur plusieurs livres

### P14 — Verdict Ultime 📊

Rapport final de qualité avec note globale sur 10 :
- Score de lisibilité (Flesch-Kincaid adapté au français)
- Score de cohérence narrative
- Score de potentiel commercial
- Score d'originalité
- Recommandation : publier / réviser / restructurer

> 🎯 **Objectif** : un Verdict Ultime ≥ 7/10 avant publication. En dessous, relancez P12 pour une itération supplémentaire.`
  },
  {
    id: 6,
    title: "Visuels & Design de Couverture",
    shortTitle: "Visuels",
    description: "Couvertures IA, 4ème de couverture, illustrations de chapitres et images réalistes.",
    icon: Palette,
    image: module06,
    color: "from-pink-500 to-rose-500",
    category: 'core',
    content: `## Visuels & Design

### Le Générateur de Couvertures IA

La couverture est le premier contact avec votre lecteur. Le générateur produit des visuels professionnels en quelques secondes grâce à **Imagen 3** (le modèle de génération d'images de Google).

**Styles disponibles** :
- 📸 Réaliste (photographies composites)
- 🎨 Artistique (peinture, aquarelle, digital art)
- ✏️ Minimaliste (typographie + formes géométriques)
- 🖼️ 3D (mockup livre avec reflets et ombres)

**17 Templates par Genre** :
Romance, Thriller, Business, Développement Personnel, Cuisine, Voyage, Science-Fiction, Fantasy, Jeunesse, Horreur, Historique, Poésie, Humour, Santé, Finance, Technologie, Spiritualité.

Chaque template pré-configure la mise en page, la palette de couleurs et la typographie optimales pour le genre.

### Formats Supportés

| Format | Dimensions | Usage |
|--------|-----------|-------|
| Pocket | 4.25 × 6.875" | Romans, nouvelles |
| KDP Standard | 6 × 9" | Non-fiction, guides |
| Grand Format | 8.5 × 11" | Cuisine, voyage, BD |
| Carré | 8.5 × 8.5" | Coloriages, enfants |

### La 4ème de Couverture

Générée automatiquement avec :
- Résumé accrocheur (format Amazon)
- Biographie auteur avec photo placeholder
- Code-barres ISBN (si renseigné)
- Témoignage fictif de lecteur

### Illustrations de Chapitres

Pour enrichir vos livres avec des images :
- **Mode Cohérence Visuelle** : les personnages gardent la même apparence sur toutes les illustrations
- **Photos réalistes** : idéal pour livres de recettes et guides de voyage
- **Illustrations artistiques** : aquarelle, pastel, ligne claire
- Résolution 300 DPI pour impression professionnelle

> 🎨 **Astuce** : Générez 3-4 variantes de couverture et testez-les sur les réseaux sociaux avant de choisir la version finale.`
  },
  {
    id: 7,
    title: "Publication & Export",
    shortTitle: "Publication",
    description: "Export multi-format, recherche KDP, simulateur Amazon, anti-plagiat et guide de conformité.",
    icon: Upload,
    image: module07,
    color: "from-green-500 to-emerald-500",
    category: 'core',
    content: `## Publication & Export

### Exporter votre manuscrit

EbookStudio produit des fichiers prêts à uploader directement sur Amazon KDP sans retouche.

**Formats disponibles** :

| Format | Caractéristiques | Idéal pour |
|--------|-----------------|------------|
| 📄 PDF Pro | Marges KDP, 300 DPI, polices embarquées | Impression KDP |
| 📝 Google Docs | Mise en forme KDP automatique, partage facile | Collaboration |
| 📋 Word (.docx) | Marges de reliure, styles pré-configurés | Édition avancée |
| 📱 EPUB | Compatible liseuses Kindle, Kobo, etc. | Ebook numérique |

### Recherche KDP Intégrée

Sans quitter EbookStudio, explorez le marché Amazon :
- **Bestsellers** par catégorie avec BSR (Best Seller Rank)
- **Niches rentables** : catégories avec forte demande et faible concurrence
- **Mots-clés** : volume de recherche estimé, difficulté, CPC
- **Tendances** : évolution des ventes sur 30/90/365 jours

### Simulateur Amazon

Prévisualisez votre livre exactement comme il apparaîtra sur Amazon :
- Vue desktop et mobile
- Couverture + "Look Inside" simulé
- Description formatée en HTML
- Position dans les résultats de recherche

### Anti-Plagiat

Avant de publier, vérifiez l'originalité de votre contenu :
- Scan de l'ensemble du manuscrit
- Détection de similarités avec des sources existantes
- Rapport détaillé avec pourcentage d'originalité
- Suggestions de réécriture pour les passages trop similaires

> ✅ **Objectif** : un score d'originalité ≥ 95% avant publication. Le workflow P5 (Réécriture Naturelle) vous aide à y parvenir.

### Guide de Conformité KDP

Checklist automatique vérifiant :
- Dimensions et marges conformes aux specs Amazon
- Résolution d'image suffisante (couverture ≥ 300 DPI)
- Table des matières cliquable (pour EPUB)
- Métadonnées complètes (titre, auteur, ISBN, catégories)`
  },
  {
    id: 8,
    title: "Marketing & Stratégie de Vente",
    shortTitle: "Marketing",
    description: "Amazon Ads, plan de lancement 30 jours, articles SEO et contenu réseaux sociaux.",
    icon: Megaphone,
    image: module08,
    color: "from-red-500 to-orange-500",
    category: 'core',
    content: `## Marketing & Ventes

### Pourquoi le marketing est essentiel

Un excellent livre sans marketing, c'est un livre invisible. EbookStudio intègre une suite complète d'outils pour maximiser vos ventes dès le premier jour.

### Amazon Ads Simulator

Planifiez vos campagnes publicitaires avant de dépenser un centime :
- **Budget quotidien** : simulation de 1€ à 50€/jour
- **Mots-clés cibles** : suggestions basées sur votre genre et vos concurrents
- **Projection ACOS** : coût publicitaire estimé par vente
- **Simulation de ROI** : revenus projetés sur 30/60/90 jours
- **Stratégie d'enchères** : recommandations automatiques vs manuelles

### Plan de Lancement 30 Jours

Un calendrier détaillé jour par jour :

**Semaine 1 — Pré-lancement**
- Créer une page auteur Amazon
- Constituer une liste d'emails (ARC readers)
- Préparer les visuels pour les réseaux sociaux
- Solliciter 5-10 lecteurs beta pour des avis

**Semaine 2 — Jour J**
- Publier sur KDP (prix promotionnel 0,99€ les 3 premiers jours)
- Lancer la campagne Amazon Ads
- Poster sur Instagram, Facebook, TikTok
- Envoyer un email à votre liste

**Semaines 3-4 — Post-lancement**
- Suivre le BSR et ajuster le prix
- Optimiser les mots-clés Ads en fonction des données
- Relancer les lecteurs pour des avis
- Planifier le livre suivant

### Articles SEO

Générateur d'articles de blog optimisés pour le référencement :
- 3 articles de 800-1200 mots liés à votre thématique
- Mots-clés longue traîne intégrés naturellement
- Structure H1/H2/H3 optimisée
- Call-to-action vers votre livre Amazon

### Contenu Réseaux Sociaux

Templates prêts à poster :
- **Instagram** : carrousels, stories, reels scripts
- **Facebook** : posts engageants, événements de lancement
- **TikTok** : scripts vidéo courtes "Behind the book"
- **LinkedIn** : articles d'autorité pour la non-fiction

> 📣 **Stratégie recommandée** : combinez Amazon Ads (trafic payant) + SEO (trafic organique) + réseaux sociaux (notoriété) pour un lancement optimal.`
  },
  {
    id: 9,
    title: "Audio & Narration Vocale",
    shortTitle: "Audio",
    description: "Créez des audiobooks avec Azure Neural Speech et utilisez la dictée vocale Whisper.",
    icon: Mic,
    image: module09,
    color: "from-cyan-500 to-blue-500",
    category: 'core',
    content: `## Audio & Voix

### Créer un Audiobook avec Azure Neural Speech

EbookStudio convertit vos chapitres en audio professionnel grâce à la technologie **Azure Neural Speech** (Microsoft), reconnue comme la synthèse vocale la plus naturelle du marché.

### Voix Disponibles

**Voix françaises** :
| Nom | Type | Style | Idéal pour |
|-----|------|-------|------------|
| Brigitte | Féminine | Chaleureuse, narrative | Romans, contes |
| Denise | Féminine | Professionnelle | Non-fiction, guides |
| Sylvie | Féminine | Dynamique | Jeunesse, aventure |
| Henri | Masculin | Posé, grave | Thrillers, histoire |
| Antoine | Masculin | Conversationnel | Dev. perso, business |
| Claude | Masculin | Narrateur classique | Documentaires |

**Langues additionnelles** : anglais (US/UK), espagnol, allemand, italien, portugais — idéal pour des éditions multilingues.

### Processus de Création

1. **Sélectionnez** les chapitres à convertir (ou le livre entier)
2. **Choisissez** une voix dans le menu déroulant
3. **Prévisualisez** un extrait de 30 secondes
4. **Générez** l'audio complet (5-15 minutes selon la longueur)
5. **Téléchargez** en MP3 (320kbps) ou WAV (qualité studio)

### Dictaphone IA Whisper

Pour ceux qui préfèrent dicter plutôt qu'écrire :
- Transcription en temps réel avec ponctuation automatique
- Support du français, anglais et espagnol
- Commandes vocales : "nouveau paragraphe", "point", "virgule"
- Intégration directe dans l'éditeur

### Hébergement & Distribution

Une fois votre audiobook prêt, EbookStudio vous permet de :
- **Publier** une page de vente avec lecteur intégré
- **Partager** via un lien unique ou un code embed
- **Vendre** directement avec intégration Stripe/PayPal
- **Suivre** les statistiques d'écoute en temps réel

> 🎙️ **Conseil** : testez 2-3 voix sur le premier chapitre avant de générer l'audiobook complet. La voix doit correspondre au ton de votre livre.`
  },
  {
    id: 10,
    title: "Gestion de Compte & Paramètres",
    shortTitle: "Compte",
    description: "Projets sauvegardés, dashboard personnel, quotas d'utilisation et configuration API.",
    icon: User,
    image: module10,
    color: "from-slate-500 to-gray-500",
    category: 'core',
    content: `## Mon Compte & Paramètres

### Tableau de Bord Personnel

Votre hub central affiche :
- **Projets récents** : accès rapide à vos ebooks en cours
- **Statistiques** : nombre de livres créés, chapitres générés, couvertures produites
- **Quotas** : utilisation de vos crédits API et limites restantes
- **Notifications** : mises à jour de la plateforme, nouveaux outils

### Gestion des Projets

- **Sauvegarde automatique** : chaque modification est enregistrée en temps réel dans le cloud
- **Historique des versions** : revenez à n'importe quelle version précédente
- **Duplication** : clonez un projet pour créer une variante
- **Archivage** : rangez les projets terminés sans les supprimer

### Configuration de la Clé API Gemini

Votre clé API personnelle vous donne le contrôle total sur les coûts :

1. Rendez-vous sur **aistudio.google.com**
2. Créez une clé API (bouton "Get API Key")
3. Collez-la dans **Paramètres → Clé API Gemini**
4. Testez la connexion avec le bouton "Vérifier"

**Coûts estimés par opération** :
| Opération | Coût approximatif |
|-----------|-------------------|
| Plan d'ebook complet | 0,02€ |
| Chapitre (1500 mots) | 0,03€ |
| Ebook entier (10 chapitres) | 0,30€ |
| Couverture IA | 0,01€ |
| Audiobook (1 chapitre) | Variable (Azure) |

### Paramètres de Profil

- **Profil auteur** : nom de plume par défaut, biographie
- **Préférences d'export** : format par défaut (PDF/Word/EPUB)
- **Notifications** : alertes email, notifications in-app
- **Thème** : mode sombre / mode clair
- **Langue** : français, anglais

### Votre Abonnement

| Plan | Prix | Inclus |
|------|------|--------|
| **Pro Lifetime** | 67€ (unique) | Tous les outils, mises à jour à vie, support 7j/7 |
| Tarif futur | 197€ | Même contenu, prix normal après le lancement |

> 💰 L'abonnement couvre l'accès à la plateforme. Les coûts API Gemini sont à votre charge mais restent très faibles (~0,30€/ebook).`
  },
  {
    id: 11,
    title: "Workflow Recommandé",
    shortTitle: "Workflow",
    description: "Le processus optimal étape par étape pour créer un ebook professionnel en moins d'1 heure.",
    icon: Route,
    image: module11,
    color: "from-lime-500 to-green-500",
    category: 'core',
    content: `## Le Workflow Recommandé

### Créer un Ebook Pro en 1 Heure

Ce module vous guide pas à pas à travers le processus optimal. Suivez ces 5 phases et vous aurez un ebook prêt à publier en 60 minutes.

### Phase 1 — Définir (5 min)

**Objectif** : poser les fondations de votre projet.

1. Ouvrez le **Planificateur** dans la sidebar
2. Entrez votre titre de travail (vous pourrez l'optimiser ensuite)
3. Sélectionnez le genre et le sous-genre
4. Définissez votre public cible en une phrase
5. Choisissez le nombre de chapitres (8-12 pour un premier livre)

> 💡 Pas d'idée de titre ? Utilisez les **Templates par Niche** — plus de 12 structures prêtes à l'emploi.

### Phase 2 — Analyser (5 min)

**Objectif** : valider le potentiel commercial.

1. Lancez **P1 — Directeur Éditorial**
2. Consultez le score de potentiel (objectif : ≥ 60/100)
3. Adoptez les suggestions de titre si le score est meilleur
4. Lancez **P2 — Analyse de Marché** pour les mots-clés KDP

### Phase 3 — Générer (30 min)

**Objectif** : produire le manuscrit complet.

**Option A — Automatique (recommandé)** :
1. Cliquez sur **"Livre Complet IA"** dans les Générateurs
2. Confirmez les paramètres
3. Attendez que les 14 étapes s'exécutent (barre de progression visible)
4. Prenez un café ☕

**Option B — Manuel** :
1. Lancez P3 (structure) puis validez le plan
2. Lancez P4 (rédaction) chapitre par chapitre
3. Lancez P5-P6 (réécriture + qualité)
4. Lancez P7-P8 (packaging + diagnostic)

### Phase 4 — Valider (10 min)

**Objectif** : s'assurer de la qualité.

1. Consultez le **Verdict Ultime** (P14) — objectif : ≥ 7/10
2. Si < 7/10 : relancez P12 (boucle itérative) pour une amélioration
3. Relisez le premier et le dernier chapitre manuellement
4. Vérifiez la couverture générée

### Phase 5 — Publier (10 min)

**Objectif** : mettre en vente sur Amazon KDP.

1. Exportez en **PDF** (pour livre broché) et/ou **EPUB** (pour Kindle)
2. Lancez l'**Anti-Plagiat** — objectif : ≥ 95% d'originalité
3. Suivez la **Checklist de Publication** (Module 12)
4. Uploadez sur **kdp.amazon.com**
5. Lancez votre **Plan Marketing** (Module 8)

### Alternative Express — 15 minutes

Pour les générateurs spécialisés (Recettes, Voyages, Fiches) :
1. Sélectionnez le générateur → renseignez le pays/thème → Générer
2. Attendez la génération (5-10 min)
3. Exportez en PDF → Uploadez sur KDP

C'est tout. 🚀`
  },
  {
    id: 12,
    title: "Checklist de Publication KDP",
    shortTitle: "Checklist",
    description: "La vérification finale complète avant de publier sur Amazon — rien ne doit être oublié.",
    icon: CheckSquare,
    image: module12,
    color: "from-yellow-500 to-amber-500",
    category: 'core',
    content: `## Checklist de Publication KDP

### Avant d'uploader sur Amazon : tout vérifier

Cette checklist couvre les 4 domaines critiques pour une publication réussie. Cochez chaque point avant de cliquer sur "Publier" dans KDP.

### ✅ Métadonnées (ce que voit Amazon)

- [ ] **Titre** optimisé : ≤ 60 caractères, mot-clé principal inclus
- [ ] **Sous-titre** : ≤ 200 caractères, mots-clés secondaires
- [ ] **Description** : 4000 caractères max, formatée en HTML (gras, listes)
- [ ] **7 mots-clés** : issus de l'analyse P2, sans répéter le titre
- [ ] **2 catégories BISAC** : choisies parmi les suggestions de P2
- [ ] **Nom d'auteur** : cohérent avec vos autres publications
- [ ] **Langue** : correctement définie

### ✅ Contenu (ce que lit le lecteur)

- [ ] **Couverture** : dimensions conformes au format choisi
  - Broché : hauteur × largeur + tranche (calculée automatiquement)
  - Kindle : 2560 × 1600 pixels minimum
- [ ] **Intérieur** : PDF haute résolution 300 DPI
- [ ] **Table des matières** : cliquable (EPUB) ou paginée (PDF)
- [ ] **Numérotation** : pages correctement numérotées
- [ ] **Marges** : conformes aux spécifications KDP du format
- [ ] **Polices** : embarquées dans le PDF (pas de substitution)

### ✅ Qualité (ce qui fait la différence)

- [ ] **Anti-plagiat** : score ≥ 95% d'originalité
- [ ] **Verdict Ultime** : note ≥ 7/10
- [ ] **Relecture finale** : premier et dernier chapitre relus manuellement
- [ ] **Liens** : tous les liens internes fonctionnent
- [ ] **Illustrations** : résolution suffisante, pas de pixelisation
- [ ] **Cohérence** : noms, dates, lieux vérifiés (rapport P10)

### ✅ Commercial (ce qui génère les ventes)

- [ ] **Prix** validé :
  - 0,99€ - 2,99€ → royalties 35%
  - 2,99€ - 9,99€ → royalties 70% (recommandé)
  - > 9,99€ → royalties 35%
- [ ] **Plan de lancement** préparé (Module 8)
- [ ] **Amazon Ads** : campagne configurée
- [ ] **Réseaux sociaux** : posts programmés
- [ ] **Page auteur** Amazon créée

### Après publication

- [ ] Vérifier l'aperçu en ligne après validation (24-72h)
- [ ] Commander un exemplaire auteur (broché)
- [ ] Configurer les promotions (prix barré)
- [ ] Planifier le livre suivant !

> 📋 Cette checklist est aussi disponible en version imprimable depuis le bouton "Exporter Checklist" dans l'outil.`
  },

  // ===== NOUVEAUX MODULES SPÉCIALISÉS 2026 =====
  {
    id: 13,
    title: "Générateur de Livres de Recettes",
    shortTitle: "Recettes",
    description: "Créez des livres de cuisine complets avec recettes, photos réalistes et accords vins.",
    icon: ChefHat,
    image: module02,
    color: "from-amber-500 to-orange-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Livres de Recettes

### Un livre de cuisine professionnel en 15 minutes

Ce générateur spécialisé produit des livres de recettes visuellement riches, prêts à vendre sur Amazon KDP.

### Ce qui est généré automatiquement

**40 recettes** organisées en 20 pages (2 par page), chacune comprenant :
- Nom du plat avec sous-titre évocateur
- Liste d'ingrédients avec quantités précises
- Instructions étape par étape (5-8 étapes)
- Temps de préparation et cuisson
- Nombre de portions
- Niveau de difficulté (facile / moyen / avancé)
- **Photo réaliste** générée par Imagen 3
- **Accord vin** suggéré avec explication

### Comment l'utiliser

1. **Choisissez un pays** parmi 125+ options (ou "Tour du monde" pour un mix)
2. **Définissez le thème** :
   - Gastronomique (plats élaborés, présentation soignée)
   - Familial (recettes simples, ingrédients courants)
   - Rapide (moins de 30 minutes)
   - Végétarien / Vegan
3. **Sélectionnez le style photo** :
   - Gourmet (fond sombre, éclairage dramatique)
   - Rustique (bois, tissus, ambiance chaleureuse)
   - Moderne (minimaliste, fond blanc)
4. **Générez** et attendez 10-15 minutes

### Structure du Livre Final

| Section | Contenu |
|---------|---------|
| Couverture | Photo d'un plat signature + titre |
| Introduction | Présentation de la cuisine du pays |
| Recettes 1-40 | 2 par page avec photos |
| Glossaire | Termes culinaires expliqués |
| Index | Par ingrédient principal |

### Onglets de l'Interface

- 🍳 **Recettes** : liste complète, éditable individuellement
- 🛒 **Liste de courses** : ingrédients consolidés et triés
- 🍷 **Accords Vins** : tableau récapitulatif
- 📊 **Statistiques** : métriques du livre (mots, pages, images)

### Export

- PDF Magazine (mise en page pro, 2 recettes/page)
- Word modifiable (pour personnalisation avancée)
- Sauvegarde projet (pour modifications ultérieures)

> 🍳 **Niche rentable** : les livres de recettes par pays se vendent très bien sur KDP. Ciblez des pays sous-exploités pour maximiser vos ventes.`
  },
  {
    id: 14,
    title: "Générateur de Guides de Voyage",
    shortTitle: "Voyages",
    description: "Créez des guides touristiques illustrés avec 40 destinations par pays.",
    icon: Map,
    image: module02,
    color: "from-blue-500 to-indigo-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Guides de Voyage

### Un guide touristique professionnel en 15 minutes

Produisez des guides de voyage illustrés avec des photos réalistes de chaque destination, prêts à vendre sur Amazon KDP.

### Ce qui est généré automatiquement

**40 destinations** en 20 pages (2 par page), chacune comprenant :
- Nom du lieu avec titre accrocheur
- Description détaillée (histoire, culture, ambiance)
- **Photo réaliste** du lieu générée par Imagen 3
- Activités incontournables (top 3)
- Meilleure période pour visiter
- Budget estimé (€/€€/€€€)
- Conseil insider

### Comment l'utiliser

1. **Sélectionnez un pays** parmi 125+ options
   - Par continent : Europe, Asie, Amériques, Afrique, Océanie
   - Option "Multi-pays" pour les guides régionaux
2. **Choisissez le type de guide** :
   - Culturel (musées, monuments, histoire)
   - Aventure (randonnée, plongée, sports)
   - Gastronomique (marchés, restaurants, spécialités)
   - Tout-en-un (mix de tout)
3. **Générez** et attendez 10-15 minutes

### Structure du Guide

- **Couverture** avec mockup 3D professionnel
- **Carte du pays** avec les destinations numérotées
- **Introduction** : géographie, culture, infos pratiques
- **40 destinations** avec photos et descriptions
- **Conseils pratiques** : visa, monnaie, transport, sécurité
- **Index** alphabétique

### Idées de Niches Rentables

| Niche | Exemple | Potentiel |
|-------|---------|-----------|
| Pays peu couverts | Guide du Monténégro | ⭐⭐⭐⭐⭐ |
| Thématiques | "50 plages secrètes d'Europe" | ⭐⭐⭐⭐ |
| Séries | Un guide par pays d'Asie (20 livres) | ⭐⭐⭐⭐⭐ |
| Régions | "Guide de la Provence secrète" | ⭐⭐⭐⭐ |

> 🗺️ **Stratégie recommandée** : créez une série de 10-20 guides par continent. L'effet catalogue booste les ventes croisées sur Amazon.`
  },
  {
    id: 15,
    title: "Générateur de Fiches Pratiques",
    shortTitle: "Fiches",
    description: "Collections de fiches bien-être illustrées : sommeil, stress, nutrition, énergie.",
    icon: FileText,
    image: module02,
    color: "from-emerald-500 to-teal-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Fiches Pratiques

### Des collections bien-être prêtes à imprimer

Ce générateur produit des collections de fiches thématiques avec illustrations cohérentes, idéales pour le marché du développement personnel sur KDP.

### Thèmes Disponibles

**😴 Sommeil & Repos**
Routines du soir, techniques de relaxation progressive, aménagement de la chambre, gestion des écrans, cycles de sommeil expliqués.

**🧘 Gestion du Stress**
Méditation guidée, exercices de respiration (4-7-8, cohérence cardiaque), journaling, gestion des pensées négatives, micro-pauses.

**🥗 Nutrition & Alimentation**
Principes d'équilibre alimentaire, recettes santé rapides, superaliments, hydratation, planning de repas hebdomadaire.

**💪 Énergie & Vitalité**
Routine matinale, exercices de 10 minutes, gestion de l'énergie par cycles, alimentation énergisante, power naps.

### Structure de Chaque Fiche

Chaque fiche suit un format éprouvé en 5 parties :
1. **Titre apaisant** et accrocheur
2. **Explication** courte et accessible (5-7 phrases)
3. **Encadré "À retenir"** : le point clé en une phrase
4. **Exercice pratique** : action concrète à faire immédiatement
5. **Conclusion** douce et motivante

### Styles d'Illustration

| Style | Ambiance | Idéal pour |
|-------|----------|------------|
| 🎨 Aquarelle | Douce, organique | Sommeil, relaxation |
| 🌸 Pastel | Légère, apaisante | Bien-être général |
| ✏️ Minimaliste | Épuré, moderne | Productivité, énergie |

Le système maintient une **cohérence visuelle** complète : même palette, même style, mêmes proportions sur toutes les fiches d'une collection.

### Export

- **PDF A4** imprimable (idéal pour KDP grand format 8.5×11")
- **Word** modifiable
- **Images HD** individuelles (300 DPI)

> 🧘 **Marché porteur** : le bien-être est l'une des catégories les plus vendues sur KDP. Les fiches pratiques avec illustrations se démarquent de la concurrence textuelle.`
  },
  {
    id: 16,
    title: "Générateur de Bandes Dessinées",
    shortTitle: "BD",
    description: "Créez des BD avec personnages cohérents, bulles de dialogue et layouts variés.",
    icon: BookOpen,
    image: module02,
    color: "from-rose-500 to-pink-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Bandes Dessinées

### Des BD complètes avec personnages cohérents

Le générateur de BD résout le plus grand défi de la création de bandes dessinées par IA : maintenir l'apparence des personnages identique d'une case à l'autre.

### Styles Artistiques

| Style | Caractéristiques | Public |
|-------|-----------------|--------|
| 🇯🇵 Manga | Grands yeux, expressions exagérées, trames | Ados, jeunes adultes |
| 🇺🇸 Comics US | Couleurs vives, ombres dynamiques, action | Tout public |
| 🇫🇷 Franco-Belge | Ligne claire, couleurs plates, humour | Enfants, famille |
| 🎨 Réaliste | Détails poussés, proportions réelles | Adultes |

### Processus de Création

**Étape 1 — Définir le personnage principal**
Décrivez physiquement votre héros : taille, cheveux, yeux, vêtements, signes distinctifs. Le système crée un "profil visuel" qui sera transmis à chaque génération.

**Étape 2 — Choisir le genre**
Aventure, Humour, Science-Fiction, Fantasy, Policier, Slice-of-Life, Horreur, Romance.

**Étape 3 — Générer le scénario**
L'IA crée un script case par case avec :
- Description de la scène (angle, décor, action)
- Dialogue de chaque personnage
- Indications d'émotion et de mouvement

**Étape 4 — Générer les images**
Chaque case est générée avec le profil visuel du personnage, garantissant la cohérence.

### Layouts de Pages

- **4 cases** : rythme lent, descriptions détaillées
- **6 cases** : format classique BD, bon équilibre
- **9 cases** : rythme rapide, idéal pour l'action
- **Splash page** : une seule image pleine page pour les moments forts

### Formats d'Export

- **BD classique A4** (210 × 297 mm)
- **Comic US** (170 × 260 mm)
- **Manga** (130 × 180 mm)
- **Carré Instagram** (1080 × 1080 px)

> 📚 **Conseil** : commencez par une BD courte (8-12 pages) pour tester le style et la cohérence des personnages avant de vous lancer dans un projet plus ambitieux.`
  },
  {
    id: 17,
    title: "Humaniseur IA Anti-Détection",
    shortTitle: "Humaniseur",
    description: "Rendez vos textes IA naturels et indétectables avec notre outil de réécriture avancé.",
    icon: Sparkles,
    image: module02,
    color: "from-purple-500 to-violet-500",
    category: 'advanced',
    isNew: true,
    content: `## Humaniseur IA Anti-Détection

### Pourquoi humaniser vos textes ?

Les détecteurs d'IA (GPTZero, Originality.ai, Turnitin) peuvent identifier le contenu généré par des modèles comme Gemini ou GPT. Pour Amazon KDP, un contenu perçu comme "100% IA" peut nuire à votre crédibilité et à vos ventes.

L'Humaniseur transforme vos textes pour les rendre **naturels, fluides et indétectables**.

### Comment ça fonctionne

L'outil applique 7 techniques de transformation :

1. **Variation syntaxique** : alterne phrases courtes et longues, simples et composées
2. **Expressions idiomatiques** : insère des tournures naturelles du français courant
3. **Imperfections contrôlées** : ajoute de légères asymétries (comme un humain qui écrit)
4. **Diversification lexicale** : remplace les mots trop "IA" par des synonymes naturels
5. **Rythme narratif** : crée des accélérations et des pauses dans le texte
6. **Voix personnelle** : injecte des opinions, hésitations, parenthèses
7. **Références culturelles** : ajoute des allusions contextuelles appropriées

### Niveaux d'Humanisation

| Niveau | Modifications | Score anti-IA typique | Usage |
|--------|--------------|----------------------|-------|
| 🟢 Léger | 15-20% du texte modifié | 70-80% humain | Retouche rapide |
| 🟡 Moyen | 35-45% du texte modifié | 85-92% humain | Recommandé |
| 🔴 Fort | 60-75% du texte modifié | 95-99% humain | Maximum |

### Comment l'utiliser

1. **Collez** votre texte (ou sélectionnez un chapitre)
2. **Choisissez** le niveau d'humanisation
3. **Lancez** la transformation (30 secondes à 2 minutes)
4. **Comparez** l'original et la version humanisée côte à côte
5. **Validez** ou ajustez manuellement

### Intégration dans le Workflow

L'Humaniseur est automatiquement intégré dans **P5 — Réécriture Naturelle** du workflow éditorial. Si vous utilisez le "Livre Complet IA", l'humanisation est déjà incluse.

### Bonnes Pratiques

- Humanisez **chapitre par chapitre** pour un meilleur contrôle
- Relisez toujours le résultat (l'IA peut parfois modifier le sens)
- Ajoutez vos propres anecdotes et réflexions personnelles
- Utilisez le niveau "Moyen" par défaut — le niveau "Fort" peut altérer le style

> ⚠️ **Important** : l'Humaniseur est un outil d'amélioration stylistique. Le meilleur contenu reste celui auquel vous ajoutez votre touche personnelle.`
  },
  {
    id: 18,
    title: "Génération d'Images IA Pro",
    shortTitle: "Images IA",
    description: "Maîtrisez la génération de couvertures, illustrations et photos réalistes avec Imagen 3.",
    icon: Image,
    image: module06,
    color: "from-fuchsia-500 to-pink-500",
    category: 'advanced',
    isNew: true,
    content: `## Génération d'Images IA Pro

### Le système visuel d'EbookStudio

Toutes les images de la plateforme sont générées par **Imagen 3** (Google), le modèle de génération d'images le plus récent, capable de produire des visuels photoréalistes et artistiques de haute qualité.

### Types d'Images Générables

**📕 Couvertures de Livres**
- 17 templates par genre avec composition optimisée
- Typographie intégrée (titre, sous-titre, nom d'auteur)
- 4 styles : réaliste, artistique, minimaliste, 3D
- Toutes les dimensions KDP supportées

**📖 Illustrations de Chapitres**
- Images narratives liées au contenu du chapitre
- Mode "Cohérence Visuelle" pour les personnages récurrents
- Styles : réaliste, aquarelle, ligne claire, digital painting

**📸 Photos Réalistes**
- Plats cuisinés (livres de recettes)
- Destinations touristiques (guides de voyage)
- Objets et produits
- Portraits contextuels

**🎨 Illustrations Artistiques**
- Aquarelle douce (fiches bien-être)
- Pastel (livres enfants)
- Ligne claire (BD)
- Minimaliste (business, tech)

### Le Mode Cohérence Visuelle

C'est la fonctionnalité la plus avancée du système. Pour les livres avec des personnages récurrents (romans illustrés, BD, livres enfants) :

1. Vous décrivez le personnage en détail (physique, vêtements, expression)
2. Le système crée un **profil visuel** stocké
3. À chaque génération d'image contenant ce personnage, le profil est injecté dans le prompt
4. Résultat : le personnage garde la même apparence sur toutes les illustrations

### Formats et Résolutions

| Usage | Résolution | Ratio |
|-------|-----------|-------|
| Couverture KDP | 300 DPI | Variable |
| Illustration intérieure | 300 DPI | Variable |
| Image web | 150 DPI | 16:9 ou 1:1 |
| Réseaux sociaux | 72 DPI | 1:1 ou 9:16 |

### Optimisation des Prompts

Pour obtenir les meilleurs résultats :
- Soyez **spécifique** : "un chat roux assis sur un livre ancien" > "un chat"
- Précisez le **style** : "style aquarelle douce, couleurs pastels"
- Indiquez l'**ambiance** : "éclairage chaud du coucher de soleil"
- Ajoutez des **détails techniques** : "vue en plongée, profondeur de champ"

> 🎨 **Astuce avancée** : générez toujours 3-4 variantes et choisissez la meilleure. L'IA produit des résultats légèrement différents à chaque fois.`
  }
];

// Catégories pour filtrage
export const moduleCategories = {
  core: { label: 'Modules Principaux', color: 'from-blue-500 to-cyan-500' },
  specialized: { label: 'Générateurs Spécialisés', color: 'from-amber-500 to-orange-500' },
  advanced: { label: 'Outils Avancés', color: 'from-purple-500 to-violet-500' }
};
