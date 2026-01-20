import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Zap, PenTool, Workflow, Brain, Palette, 
  Upload, Megaphone, Mic, User, Route, CheckSquare 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Import des 12 images de modules
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

interface FormationModule {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  color: string;
  content: string;
}

const formationModules: FormationModule[] = [
  {
    id: 1,
    title: "Introduction & Accès",
    shortTitle: "Intro",
    description: "Bienvenue dans EbookStudio Pro ! Découvrez l'interface et les accès.",
    icon: Rocket,
    image: module01,
    color: "from-orange-500 to-amber-500",
    content: `## Bienvenue dans EbookStudio Pro !

### Ce que vous allez apprendre :
- ✅ Créer un ebook professionnel de A à Z
- ✅ Générer des couvertures qui vendent
- ✅ Optimiser pour Amazon KDP
- ✅ Utiliser l'IA pour écrire plus vite

### Comment accéder :
1. Connectez-vous sur ebookstudio.fr
2. Entrez votre code d'accès (format EBK-XXXXXX)
3. Accédez au tableau de bord`
  },
  {
    id: 2,
    title: "Générateurs Rapides",
    shortTitle: "Générateurs",
    description: "7 générateurs spécialisés : Livre Complet, BD, Coloriage, Documentaires...",
    icon: Zap,
    image: module02,
    color: "from-purple-500 to-pink-500",
    content: `## Générateurs IA Rapides

### Livre Complet IA (Le Plus Puissant)
En un clic, génère un ebook entier grâce à un workflow de 14 étapes IA.

### Autres générateurs :
- 📚 **Bandes Dessinées** : Cases et bulles générées par IA
- 🎨 **Livres de Coloriage** : Format 8.5x8.5" pour KDP
- 🎬 **Documentaires** : Structurés avec sources
- 📔 **Agendas & Journaux** : Planners personnalisés
- 📖 **Encyclopédies** : Jusqu'à 50 entrées
- 🗺️ **Atlas** : Guides géographiques`
  },
  {
    id: 3,
    title: "Création & Rédaction",
    shortTitle: "Création",
    description: "Planificateur, Assistant IA, Import URL et Word.",
    icon: PenTool,
    image: module03,
    color: "from-blue-500 to-cyan-500",
    content: `## Outils de Création

### Planificateur
Le centre de contrôle de votre ebook : titre, auteur, genre, chapitres.

### Écriture IA
L'éditeur intelligent : génération, amélioration, formatage.

### Nouveautés 2026 :
- 🔗 **Import URL** : YouTube, articles, pages web → ebook
- 📄 **Import Word/Doc** : Transformez vos documents existants`
  },
  {
    id: 4,
    title: "Workflow Pro (P1-P8)",
    shortTitle: "Workflow P1-P8",
    description: "Les 8 premiers modules du moteur éditorial professionnel.",
    icon: Workflow,
    image: module04,
    color: "from-teal-500 to-green-500",
    content: `## Workflow Pro (P1-P8)

### P1 - Directeur Éditorial
Analyse stratégique, suggestions de titres, score de performance.

### P2 - Analyse de Marché
7 mots-clés KDP, concurrence, catégories, prix optimal.

### P3 - Architecte de Contenu
Structure KDP complète avec préface, chapitres, conclusion.

### P4 à P8
- ✍️ **P4** : Rédaction Experte
- ✨ **P5** : Réécriture Naturelle
- ✅ **P6** : Qualité Éditoriale
- 📦 **P7** : Packaging Éditorial
- 🔍 **P8** : Diagnostic Final`
  },
  {
    id: 5,
    title: "Moteur IA V2 (P9-P14)",
    shortTitle: "Moteur IA V2",
    description: "Modules avancés : Mémoire, Cohérence, Auto-Critique, Verdict Ultime.",
    icon: Brain,
    image: module05,
    color: "from-violet-500 to-purple-500",
    content: `## Moteur IA V2 (P9-P14)

### Modules Avancés :
- 🧠 **P9 - Mémoire Éditoriale** : Conserve le contexte
- 🔗 **P10 - Cohérence Chapitres** : Alignement narratif
- 👁️ **P11 - Auto-Critique** : L'IA s'auto-analyse
- 🔄 **P12 - Boucle Itérative** : Amélioration continue
- 🎨 **P13 - Signature Stylistique** : Votre voix unique
- 🏆 **P14 - Verdict Ultime** : Note finale sur 10`
  },
  {
    id: 6,
    title: "Visuels & Design",
    shortTitle: "Visuels",
    description: "Générateurs de couvertures, 4ème de couverture, images IA.",
    icon: Palette,
    image: module06,
    color: "from-pink-500 to-rose-500",
    content: `## Visuels & Design

### Couverture IA
Le générateur le plus avancé : réaliste, artistique, minimaliste, 3D.

### Options :
- 17 templates de genres (Romance, Thriller, Business...)
- Formats pocket, KDP, grand format
- Position et style du nom d'auteur

### 4ème de Couverture
Résumé, biographie, code-barres automatique.

### Images de Chapitres
Illustrations cohérentes avec "visual coherence mode".`
  },
  {
    id: 7,
    title: "Publication & Export",
    shortTitle: "Publication",
    description: "Recherche KDP, Simulateur Amazon, Anti-Plagiat.",
    icon: Upload,
    image: module07,
    color: "from-green-500 to-emerald-500",
    content: `## Publication & Export

### Recherche KDP
Bestsellers, niches rentables, mots-clés optimisés.

### Simulateur Amazon
Prévisualisez votre livre sur Amazon (desktop/mobile).

### Export :
- PDF professionnel
- Google Docs avec mise en forme KDP
- Word (.docx) avec marges de reliure

### Anti-Plagiat
Vérification d'originalité avant publication.`
  },
  {
    id: 8,
    title: "Marketing & Ventes",
    shortTitle: "Marketing",
    description: "Amazon Ads, Plan de lancement, Articles SEO.",
    icon: Megaphone,
    image: module08,
    color: "from-red-500 to-orange-500",
    content: `## Marketing & Ventes

### Amazon Ads Simulator
Planificateur de budget, mots-clés, ACOS, projections ROI.

### Plan de Lancement
Stratégie pré-lancement, jour J, post-lancement.

### Articles SEO
Générateur d'articles optimisés pour le trafic organique.

### Contenu Social
Templates pour promouvoir sur les réseaux.`
  },
  {
    id: 9,
    title: "Audio & Voix",
    shortTitle: "Audio",
    description: "Audiobooks ElevenLabs et dictée vocale Whisper.",
    icon: Mic,
    image: module09,
    color: "from-cyan-500 to-blue-500",
    content: `## Audio & Voix

### Audiobook ElevenLabs
Convertissez vos chapitres en audio avec des voix IA réalistes.

### Dictaphone IA
Dictez vos idées, Whisper les transcrit en temps réel.

### Fonctionnalités :
- Choix de voix (homme/femme)
- Styles variés
- Export MP3/WAV`
  },
  {
    id: 10,
    title: "Mon Compte",
    shortTitle: "Compte",
    description: "Projets, Dashboard, Paramètres et clé API.",
    icon: User,
    image: module10,
    color: "from-slate-500 to-gray-500",
    content: `## Mon Compte

### Mes Projets
Retrouvez tous vos ebooks en cours et terminés.

### Dashboard
Vue d'ensemble de votre activité et statistiques.

### Paramètres
- Configurez votre clé OpenAI
- Gérez votre profil
- Préférences d'export`
  },
  {
    id: 11,
    title: "Workflow Recommandé",
    shortTitle: "Workflow",
    description: "Le processus optimal pour créer un ebook en moins d'1h.",
    icon: Route,
    image: module11,
    color: "from-lime-500 to-green-500",
    content: `## Workflow Recommandé

### En moins d'1 heure :

1. **Choisir** (5 min)
   - Titre et auteur
   - Genre et public cible

2. **Générer** (30 min)
   - Lancer "Livre Complet IA"
   - Attendre les 14 étapes

3. **Valider** (15 min)
   - Lire le Verdict Ultime
   - Ajuster si nécessaire

4. **Publier** (10 min)
   - Exporter en PDF/EPUB
   - Uploader sur KDP`
  },
  {
    id: 12,
    title: "Checklist de Publication",
    shortTitle: "Checklist",
    description: "Vérifications finales avant upload KDP.",
    icon: CheckSquare,
    image: module12,
    color: "from-yellow-500 to-amber-500",
    content: `## Checklist de Publication

### Avant d'uploader sur KDP :

✅ Titre optimisé (60 caractères max)
✅ Description commerciale (4000 caractères)
✅ 7 mots-clés stratégiques
✅ Catégories BISAC choisies
✅ Couverture aux bonnes dimensions
✅ Intérieur en PDF haute résolution
✅ Prix validé (royalties 35% ou 70%)
✅ Anti-plagiat passé
✅ Verdict Ultime > 7/10
✅ Relecture finale effectuée`
  }
];

const FormationModuleTabs = () => {
  const [activeModule, setActiveModule] = useState("1");

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
          <Rocket className="h-4 w-4" />
          Formation Systeme.io
          <Badge variant="secondary" className="bg-white/20 text-white text-[10px]">
            12 Modules
          </Badge>
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-pink-500 to-rose-500 bg-clip-text text-transparent">
          Formation Complète EbookStudio Pro
        </CardTitle>
        <p className="text-muted-foreground mt-2 text-lg">
          Maîtrisez chaque outil avec nos 12 modules détaillés
        </p>
      </CardHeader>
      
      <CardContent className="px-4 md:px-6 pb-8">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          {/* Onglets responsive */}
          <TabsList className="flex flex-wrap justify-center gap-1 h-auto bg-muted/50 p-2 rounded-xl mb-6">
            {formationModules.map((module) => {
              const Icon = module.icon;
              return (
                <TabsTrigger
                  key={module.id}
                  value={module.id.toString()}
                  className="flex items-center gap-1 px-3 py-2 text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white transition-all"
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline">{module.shortTitle}</span>
                  <span className="md:hidden">{module.id}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Contenu des modules */}
          <AnimatePresence mode="wait">
            {formationModules.map((module) => {
              const Icon = module.icon;
              return (
                <TabsContent key={module.id} value={module.id.toString()} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Image du module */}
                    <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
                      <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10`} />
                      <img 
                        src={module.image} 
                        alt={module.title}
                        className="w-full h-48 md:h-64 lg:h-80 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="bg-white/20 text-white mb-1">
                              Module {module.id}
                            </Badge>
                            <h3 className="text-white font-bold text-lg">{module.title}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contenu du module */}
                    <div className="bg-card rounded-xl border border-border p-6 overflow-auto max-h-80 lg:max-h-96">
                      <p className="text-muted-foreground mb-4">{module.description}</p>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{module.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              );
            })}
          </AnimatePresence>
        </Tabs>

        {/* Indicateur de progression */}
        <div className="mt-6 flex justify-center gap-1">
          {formationModules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id.toString())}
              className={`w-2 h-2 rounded-full transition-all ${
                activeModule === module.id.toString() 
                  ? 'w-6 bg-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationModuleTabs;
