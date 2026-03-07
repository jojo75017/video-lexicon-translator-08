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
    title: "Introduction & Accès",
    shortTitle: "Intro",
    description: "Bienvenue dans EbookStudio Pro 2026 ! Découvrez l'interface et vos accès.",
    icon: Rocket,
    image: module01,
    color: "from-orange-500 to-amber-500",
    category: 'core',
    content: `## Bienvenue dans EbookStudio Pro 2026 !

### Ce que vous allez maîtriser :
- ✅ Créer un ebook professionnel de A à Z avec l'IA
- ✅ Générer des couvertures qui convertissent
- ✅ Optimiser vos livres pour Amazon KDP
- ✅ Utiliser les 14 étapes du workflow éditorial IA
- ✅ Créer des livres spécialisés (recettes, voyages, BD...)

### Comment accéder :
1. Connectez-vous sur ebookstudio.fr
2. Entrez votre code d'accès (format EBK-XXXXXX)
3. Accédez au tableau de bord principal

### 🔑 Configuration de votre Clé API OpenAI :
L'outil utilise votre propre clé API Gemini 3 Flash (gratuite) pour la génération.
1. Créez un compte sur **aistudio.google.com**
2. Générez une clé API en cliquant sur "Get API Key"
3. Ajoutez-la dans **Mon Compte → Paramètres → Clés API**
4. Coût estimé : **0,20€ à 0,50€ par ebook complet**

### 💰 Offre Pro Lifetime :
- 🎯 **Accès Pro à 97€** — Accès à vie
- ⏳ Prix de lancement limité
- 📈 Ensuite : 197€ (réduction 50€ sur 247€)

### Nouveautés 2026 :
- 🍳 Générateur de livres de recettes avec accords vins
- 🗺️ Générateur de guides de voyage illustrés
- 📋 Générateur de fiches pratiques bien-être
- 🤖 Moteur IA V2 avec mémoire éditoriale
- 🎨 18 modules de formation complets`
  },
  {
    id: 2,
    title: "Générateurs Rapides",
    shortTitle: "Générateurs",
    description: "10+ générateurs spécialisés : Recettes, Voyages, BD, Coloriage, Documentaires...",
    icon: Zap,
    image: module02,
    color: "from-purple-500 to-pink-500",
    category: 'core',
    content: `## Générateurs IA Rapides

### Livre Complet IA (Le Plus Puissant)
En un clic, génère un ebook entier grâce au workflow de 14 étapes IA.

### Nouveaux Générateurs 2026 :
- 🍳 **Livres de Recettes** : 40 recettes avec photos et accords vins
- 🗺️ **Guides de Voyage** : 40 destinations illustrées par pays
- 📋 **Fiches Pratiques** : Bien-être, sommeil, nutrition...

### Générateurs Classiques :
- 📚 **Bandes Dessinées** : Cases et bulles générées par IA
- 🎨 **Livres de Coloriage** : Format 8.5x8.5" pour KDP
- 🎬 **Documentaires** : Structurés avec sources
- 📔 **Agendas & Journaux** : Planners personnalisés
- 📖 **Encyclopédies** : Jusqu'à 50 entrées thématiques
- 🗺️ **Atlas** : Guides géographiques complets`
  },
  {
    id: 3,
    title: "Création & Rédaction",
    shortTitle: "Création",
    description: "Planificateur avancé, Assistant IA, Import URL/YouTube et Word.",
    icon: PenTool,
    image: module03,
    color: "from-blue-500 to-cyan-500",
    category: 'core',
    content: `## Outils de Création

### Planificateur Avancé
Le centre de contrôle de votre ebook : titre, auteur, genre, chapitres, personnages.

### Écriture IA Intelligente
L'éditeur qui comprend votre vision : génération, amélioration, formatage automatique.

### Import Multi-Sources 2026 :
- 🔗 **Import URL** : YouTube, articles, pages web → ebook structuré
- 📄 **Import Word/Doc** : Transformez vos documents existants
- 🎙️ **Dictée Vocale** : Whisper transcrit vos idées en temps réel

### Conseils Pro :
- Définissez d'abord votre public cible
- Utilisez le Directeur Éditorial (P1) avant de rédiger
- Laissez l'IA structurer, vous guidez l'intention`
  },
  {
    id: 4,
    title: "Workflow Pro (P1-P8)",
    shortTitle: "Workflow P1-P8",
    description: "Les 8 premiers modules du moteur éditorial professionnel.",
    icon: Workflow,
    image: module04,
    color: "from-teal-500 to-green-500",
    category: 'advanced',
    content: `## Workflow Pro (P1-P8)

### P1 - Directeur Éditorial
Analyse stratégique complète, suggestions de titres vendeurs, score de performance.

### P2 - Analyse de Marché
7 mots-clés KDP optimisés, analyse concurrence, catégories, prix optimal.

### P3 - Architecte de Contenu
Structure KDP complète : préface, chapitres numérotés, conclusion professionnelle.

### P4 - Rédaction Experte
Génération de contenu chapitre par chapitre avec ton adapté.

### P5 - Réécriture Naturelle
Humanisation du texte pour éviter la détection IA.

### P6 - Qualité Éditoriale
Vérification grammaire, style, cohérence narrative.

### P7 - Packaging Éditorial
Description commerciale, biographie auteur, argumentaire.

### P8 - Diagnostic Final
Analyse complète avant publication avec recommandations.`
  },
  {
    id: 5,
    title: "Moteur IA V2 (P9-P14)",
    shortTitle: "Moteur IA V2",
    description: "Modules avancés : Mémoire, Cohérence, Auto-Critique, Verdict Ultime.",
    icon: Brain,
    image: module05,
    color: "from-violet-500 to-purple-500",
    category: 'advanced',
    content: `## Moteur IA V2 (P9-P14)

### P9 - Mémoire Éditoriale
Conserve le contexte entre les sessions pour une cohérence parfaite.

### P10 - Cohérence Chapitres
Vérifie l'alignement narratif entre tous les chapitres.

### P11 - Auto-Critique
L'IA analyse ses propres productions et suggère des améliorations.

### P12 - Boucle Itérative
Amélioration continue jusqu'à satisfaction complète.

### P13 - Signature Stylistique
Définit et maintient votre voix d'auteur unique.

### P14 - Verdict Ultime
Note finale sur 10 avec rapport détaillé de qualité.

### Avantages V2 :
- 🧠 Contexte persistant entre sessions
- 🔄 Amélioration automatique
- ✨ Voix d'auteur cohérente
- 📊 Métriques de qualité précises`
  },
  {
    id: 6,
    title: "Visuels & Design",
    shortTitle: "Visuels",
    description: "Générateurs de couvertures, 4ème de couverture, images IA réalistes.",
    icon: Palette,
    image: module06,
    color: "from-pink-500 to-rose-500",
    category: 'core',
    content: `## Visuels & Design

### Couverture IA Pro
Le générateur le plus avancé : styles réaliste, artistique, minimaliste, 3D.

### 17 Templates de Genres :
Romance, Thriller, Business, Développement Personnel, Cuisine, Voyage...

### Formats Supportés :
- Pocket (4.25 x 6.875")
- KDP Standard (6 x 9")
- Grand Format (8.5 x 11")

### 4ème de Couverture
Résumé accrocheur, biographie auteur, code-barres automatique.

### Images de Chapitres
Illustrations cohérentes avec mode "visual coherence" pour personnages récurrents.

### Nouveau 2026 :
- 📸 Photos réalistes pour livres de recettes
- 🏞️ Images de destinations pour guides de voyage
- 🎨 Illustrations aquarelle pour fiches pratiques`
  },
  {
    id: 7,
    title: "Publication & Export",
    shortTitle: "Publication",
    description: "Recherche KDP, Simulateur Amazon, Anti-Plagiat, Exports Pro.",
    icon: Upload,
    image: module07,
    color: "from-green-500 to-emerald-500",
    category: 'core',
    content: `## Publication & Export

### Recherche KDP
Bestsellers actuels, niches rentables, mots-clés optimisés par catégorie.

### Simulateur Amazon
Prévisualisez votre livre exactement comme sur Amazon (desktop/mobile).

### Formats d'Export 2026 :
- 📄 **PDF Professionnel** : Marges KDP, haute résolution
- 📝 **Google Docs** : Mise en forme KDP automatique
- 📋 **Word (.docx)** : Marges de reliure, prêt à imprimer
- 📱 **EPUB** : Compatible liseuses

### Anti-Plagiat
Vérification d'originalité avant publication avec rapport détaillé.

### Guide Export Intégré
Recommandations typographie, tailles de police, structure professionnelle.`
  },
  {
    id: 8,
    title: "Marketing & Ventes",
    shortTitle: "Marketing",
    description: "Amazon Ads, Plan de lancement, Articles SEO, Contenu Social.",
    icon: Megaphone,
    image: module08,
    color: "from-red-500 to-orange-500",
    category: 'core',
    content: `## Marketing & Ventes

### Amazon Ads Simulator
Planificateur de budget publicitaire, mots-clés cibles, ACOS, projections ROI.

### Plan de Lancement 30 Jours
- **Pré-lancement** : Liste emails, ARC readers, teasing
- **Jour J** : Promotions, reviews, réseaux sociaux
- **Post-lancement** : Suivi BSR, ajustements, ads

### Articles SEO
Générateur d'articles optimisés pour le trafic organique vers vos livres.

### Contenu Social
Templates prêts à poster pour promouvoir sur Instagram, Facebook, TikTok.

### Système ARC 2026
Recrutez des lecteurs beta, distribuez vos livres, collectez des avis.`
  },
  {
    id: 9,
    title: "Audio & Voix",
    shortTitle: "Audio",
    description: "Audiobooks ElevenLabs et dictée vocale Whisper.",
    icon: Mic,
    image: module09,
    color: "from-cyan-500 to-blue-500",
    category: 'core',
    content: `## Audio & Voix

### Audiobook ElevenLabs
Convertissez vos chapitres en audio avec des voix IA ultra-réalistes.

### Voix Disponibles :
- 👨 Voix masculines (6 options)
- 👩 Voix féminines (6 options)
- 🎭 Styles variés : narrateur, dynamique, intime

### Dictaphone IA Whisper
Dictez vos idées, Whisper les transcrit en temps réel avec ponctuation.

### Formats Audio :
- MP3 (standard, compatible partout)
- WAV (haute qualité studio)
- M4A (optimisé streaming)

### Conseils :
- Divisez par chapitres pour faciliter l'édition
- Vérifiez la prononciation des noms propres
- Ajustez la vitesse selon le genre (plus lent pour suspense)`
  },
  {
    id: 10,
    title: "Mon Compte",
    shortTitle: "Compte",
    description: "Projets sauvegardés, Dashboard, Paramètres et clé API.",
    icon: User,
    image: module10,
    color: "from-slate-500 to-gray-500",
    category: 'core',
    content: `## Mon Compte

### Mes Projets
Retrouvez tous vos ebooks en cours et terminés, classés par date.

### Dashboard
Vue d'ensemble : statistiques d'utilisation, projets récents, quotas.

### 🔑 Configuration Clé API OpenAI :
Votre clé API personnelle vous permet de contrôler vos coûts.
1. Allez sur **platform.openai.com** → API Keys
2. Créez une nouvelle clé (commence par "sk-...")
3. Collez-la dans **Paramètres → Clé API**
4. 💡 Coût moyen : **0,30€ à 0,80€ par ebook**
5. Vous gardez le contrôle total de votre budget

### Paramètres :
- 🔑 Configurez votre clé OpenAI (obligatoire pour générer)
- 👤 Gérez votre profil auteur
- 📤 Préférences d'export par défaut
- 🔔 Notifications et alertes

### Sauvegarde Automatique
Vos projets sont sauvegardés en temps réel dans le cloud.

### Votre Abonnement :
- 🎯 **Pro Lifetime (97€)** : Accès à vie — Toutes les fonctionnalités
- 📈 Après lancement : 197€ (réduction 50€ sur 247€)
- 🚀 Mises à jour gratuites à vie + support inclus`
  },
  {
    id: 11,
    title: "Workflow Recommandé",
    shortTitle: "Workflow",
    description: "Le processus optimal pour créer un ebook en moins d'1h.",
    icon: Route,
    image: module11,
    color: "from-lime-500 to-green-500",
    category: 'core',
    content: `## Workflow Recommandé

### Créez un Ebook Pro en 1 Heure :

**1. Choisir (5 min)**
- Titre accrocheur et nom d'auteur
- Genre et public cible précis

**2. Analyser (5 min)**
- Lancez P1 - Directeur Éditorial
- Validez le score de potentiel

**3. Générer (30 min)**
- Lancez "Livre Complet IA"
- Les 14 étapes s'enchaînent automatiquement

**4. Valider (10 min)**
- Consultez P14 - Verdict Ultime
- Note minimum recommandée : 7/10

**5. Publier (10 min)**
- Exportez en PDF/EPUB
- Uploadez sur Amazon KDP

### Alternative Rapide :
Utilisez les générateurs spécialisés (Recettes, Voyages) pour un livre prêt en 15 minutes !`
  },
  {
    id: 12,
    title: "Checklist Publication",
    shortTitle: "Checklist",
    description: "Vérifications finales avant upload KDP.",
    icon: CheckSquare,
    image: module12,
    color: "from-yellow-500 to-amber-500",
    category: 'core',
    content: `## Checklist de Publication KDP

### Avant d'uploader sur Amazon :

**Métadonnées :**
✅ Titre optimisé (60 caractères max)
✅ Sous-titre avec mots-clés
✅ Description commerciale (4000 caractères)
✅ 7 mots-clés stratégiques
✅ 2 catégories BISAC pertinentes

**Contenu :**
✅ Couverture aux bonnes dimensions
✅ Intérieur en PDF haute résolution (300 DPI)
✅ Table des matières cliquable
✅ Numérotation des pages correcte

**Qualité :**
✅ Anti-plagiat passé (>95% original)
✅ Verdict Ultime > 7/10
✅ Relecture finale effectuée
✅ Liens fonctionnels vérifiés

**Commercial :**
✅ Prix validé (royalties 35% ou 70%)
✅ Plan de lancement préparé`
  },

  // ===== NOUVEAUX MODULES SPÉCIALISÉS 2026 =====
  {
    id: 13,
    title: "Livres de Recettes",
    shortTitle: "Recettes",
    description: "Créez des livres de cuisine avec 40 recettes, photos et accords vins.",
    icon: ChefHat,
    image: module02, // Réutilise une image existante
    color: "from-amber-500 to-orange-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Livres de Recettes 2026

### Caractéristiques :
- 📖 **40 recettes** organisées en 20 pages (2 par page)
- 📸 **Photos réalistes** générées par IA pour chaque plat
- 🍷 **Accords vins** suggérés pour chaque recette
- 🌍 **125+ pays** disponibles pour cuisines du monde

### Comment l'utiliser :
1. Choisissez un pays ou "Tour du monde"
2. Définissez le thème (gastronomique, familial, rapide...)
3. Sélectionnez le style photo (gourmet, rustique, moderne)
4. Générez et exportez en PDF professionnel

### Formats d'Export :
- PDF Magazine (2 recettes/page avec photos)
- Word modifiable
- Sauvegarde projet

### Onglets Disponibles :
- 🍳 Recettes : Liste complète avec ingrédients
- 🛒 Liste de courses : Ingrédients consolidés
- 🍷 Accords Vins : Suggestions par recette
- 📊 Statistiques : Métriques du livre`
  },
  {
    id: 14,
    title: "Guides de Voyage",
    shortTitle: "Voyages",
    description: "Créez des guides touristiques illustrés avec 40 destinations.",
    icon: Map,
    image: module02,
    color: "from-blue-500 to-indigo-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Guides de Voyage 2026

### Caractéristiques :
- 🗺️ **40 destinations** en 20 pages (2 par page)
- 🏞️ **Photos réalistes** de chaque lieu
- 📍 **125+ pays** avec sélection par continent
- 📖 **Descriptions détaillées** : histoire, conseils, activités

### Comment l'utiliser :
1. Sélectionnez un pays dans la liste
2. L'IA génère 40 destinations incontournables
3. Chaque destination reçoit une photo réaliste
4. Exportez en PDF avec couverture professionnelle

### Structure du Guide :
- Couverture avec mockup 3D
- Table des matières
- 20 pages de destinations (2/page)
- Conseils pratiques

### Idéal Pour :
- Guides touristiques à vendre sur KDP
- Livres souvenirs personnalisés
- Contenus blogs voyage
- Cadeaux personnalisés`
  },
  {
    id: 15,
    title: "Fiches Pratiques",
    shortTitle: "Fiches",
    description: "Créez des collections de fiches bien-être avec illustrations.",
    icon: FileText,
    image: module02,
    color: "from-emerald-500 to-teal-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Fiches Pratiques 2026

### Thèmes Disponibles :
- 😴 **Sommeil** : Routines, techniques de relaxation
- 🧘 **Stress** : Gestion, méditation, respiration
- 🥗 **Nutrition** : Conseils alimentaires, recettes santé
- 💪 **Énergie** : Boost quotidien, habitudes

### Structure de Chaque Fiche :
1. Titre apaisant et accrocheur
2. Explication courte (5-7 phrases)
3. Encadré "À retenir" 
4. Exercice pratique concret
5. Conclusion douce et motivante

### Styles d'Illustration :
- 🎨 Aquarelle douce
- 🌸 Pastel relaxant
- ✨ Minimaliste épuré

### Cohérence Visuelle :
Le système maintient un style graphique uniforme sur toutes les fiches de la collection.

### Export :
- PDF imprimable A4
- Word modifiable
- Images haute résolution`
  },
  {
    id: 16,
    title: "Bandes Dessinées",
    shortTitle: "BD",
    description: "Créez des BD avec personnages cohérents et bulles de dialogue.",
    icon: BookOpen,
    image: module02,
    color: "from-rose-500 to-pink-500",
    category: 'specialized',
    isNew: true,
    content: `## Générateur de Bandes Dessinées 2026

### Caractéristiques :
- 🎨 **Styles artistiques** : Manga, Comics US, Franco-Belge
- 👤 **Cohérence personnages** : Même apparence sur toutes les cases
- 💬 **Bulles de dialogue** générées automatiquement
- 📐 **Layouts variés** : 4, 6, 9 cases par page

### Processus de Création :
1. Définissez votre personnage principal (description physique)
2. Choisissez le genre (aventure, humour, SF...)
3. L'IA génère le scénario case par case
4. Les images maintiennent la cohérence visuelle

### Mode Cohérence Visuelle :
Le système transmet la description du personnage à chaque génération d'image pour garantir son apparence constante.

### Formats :
- Format BD classique (A4)
- Format Comic US
- Format Manga
- Carré Instagram`
  },
  {
    id: 17,
    title: "Humaniseur IA",
    shortTitle: "Humaniseur",
    description: "Rendez vos textes IA indétectables avec notre outil anti-détection.",
    icon: Sparkles,
    image: module02,
    color: "from-purple-500 to-violet-500",
    category: 'advanced',
    isNew: true,
    content: `## Humaniseur IA Anti-Détection 2026

### Pourquoi l'utiliser ?
Les détecteurs IA (GPTZero, Originality.ai) peuvent identifier le contenu généré. L'humaniseur transforme vos textes pour les rendre naturels.

### Techniques Utilisées :
- 🔄 Variation de la longueur des phrases
- 📝 Ajout d'expressions idiomatiques
- 🎯 Insertion de tournures personnelles
- ✨ Diversification du vocabulaire

### Comment l'utiliser :
1. Collez votre texte généré par IA
2. Choisissez le niveau d'humanisation (léger/moyen/fort)
3. L'IA réécrit en conservant le sens
4. Vérifiez avec un détecteur externe

### Intégration Workflow :
L'humaniseur est intégré dans P5 (Réécriture Naturelle) du workflow éditorial.

### Conseils :
- Humanisez chapitre par chapitre
- Relisez pour vérifier la fluidité
- Ajoutez vos propres touches personnelles`
  },
  {
    id: 18,
    title: "Images IA Pro",
    shortTitle: "Images IA",
    description: "Générez des images cohérentes pour vos chapitres et couvertures.",
    icon: Image,
    image: module06,
    color: "from-fuchsia-500 to-pink-500",
    category: 'advanced',
    isNew: true,
    content: `## Génération d'Images IA Pro 2026

### Types d'Images :
- 📕 **Couvertures** : 17 templates de genres
- 📖 **Illustrations chapitres** : Cohérence narrative
- 📸 **Photos réalistes** : Recettes, destinations
- 🎨 **Illustrations artistiques** : Aquarelle, pastel

### Mode Cohérence Visuelle :
Pour les personnages récurrents, le système maintient :
- Traits physiques constants
- Style vestimentaire cohérent
- Palette de couleurs uniforme

### Formats Générés :
- Couvertures KDP (toutes tailles)
- Images carrées (réseaux sociaux)
- Paysage (headers, bannières)
- Portrait (illustrations livres)

### Optimisation :
- Résolution 300 DPI pour impression
- Formats web optimisés
- Métadonnées intégrées`
  }
];

// Catégories pour filtrage
export const moduleCategories = {
  core: { label: 'Modules Principaux', color: 'from-blue-500 to-cyan-500' },
  specialized: { label: 'Générateurs Spécialisés', color: 'from-amber-500 to-orange-500' },
  advanced: { label: 'Outils Avancés', color: 'from-purple-500 to-violet-500' }
};
