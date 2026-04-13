import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, CheckCircle, Play, Clock, Award, ArrowRight, 
  Users, MapPin, Scroll, Crown, Sparkles, Target, Lightbulb,
  BookMarked, Layers, Link2, AlertTriangle, Zap, Star, Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModernSidebar } from '@/components/layout/ModernSidebar';

interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  tips: string[];
  examples: string[];
  completed: boolean;
}

const FormationSeriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string>('module-1');
  const [activeLesson, setActiveLesson] = useState<string>('lesson-1-1');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const modules: Module[] = [
    {
      id: 'module-1',
      title: 'Fondamentaux des Séries',
      duration: '45 min',
      completed: false,
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Pourquoi écrire une série ?',
          content: `Une série de livres offre des avantages uniques pour les auteurs :

**Fidélisation des lecteurs** : Les lecteurs qui aiment le premier tome reviendront naturellement pour la suite. C'est un investissement qui rapporte sur le long terme.

**Développement approfondi** : Une série permet d'explorer des personnages, des univers et des thèmes avec une profondeur impossible dans un livre unique.

**Visibilité accrue** : Sur Amazon et les plateformes, chaque nouveau tome augmente votre visibilité et crée un effet de catalogue.

**Revenus récurrents** : Un lecteur satisfait achètera tous vos tomes, multipliant vos revenus par le nombre de livres.`,
          tips: [
            'Planifiez au moins les grandes lignes des 3 premiers tomes avant de commencer',
            'Gardez des notes détaillées dès le début pour éviter les incohérences',
            'Prévoyez des éléments récurrents (lieux, personnages secondaires) qui créent de la familiarité'
          ],
          examples: [
            'Harry Potter : 7 tomes planifiés dès le départ avec une progression claire',
            'Game of Thrones : Univers complexe développé sur plusieurs livres',
            'Hunger Games : Trilogie avec arc narratif complet'
          ],
          completed: false
        },
        {
          id: 'lesson-1-2',
          title: 'Types de séries littéraires',
          content: `Il existe plusieurs formats de séries, chacun avec ses avantages :

**Série à épisodes** : Chaque tome est relativement indépendant avec un personnage récurrent (ex: Sherlock Holmes, James Bond).
- Avantage : Lecteurs peuvent commencer n'importe où
- Idéal pour : Policiers, thrillers, romances

**Série feuilleton** : Histoire continue sur plusieurs tomes, lecture séquentielle obligatoire.
- Avantage : Immersion maximale, fidélisation forte
- Idéal pour : Fantasy, SF épique, sagas familiales

**Trilogie/Duologie** : Format court avec arc défini.
- Avantage : Planification plus simple, engagement limité
- Idéal pour : Premiers auteurs, concepts ciblés

**Série ouverte** : Nombre de tomes non défini à l'avance.
- Avantage : Flexibilité selon le succès
- Risque : Difficile à maintenir cohérent`,
          tips: [
            'Choisissez le format en fonction de votre histoire, pas l\'inverse',
            'Les trilogies sont excellentes pour débuter',
            'Prévoyez toujours une "sortie de secours" si la série ne marche pas'
          ],
          examples: [
            'Série épisodes : Les enquêtes du Commissaire Maigret',
            'Feuilleton : Le Seigneur des Anneaux',
            'Trilogie : Divergente'
          ],
          completed: false
        },
        {
          id: 'lesson-1-3',
          title: 'Planifier votre arc global',
          content: `L'arc global est la colonne vertébrale de votre série :

**L'arc de transformation** : Comment votre protagoniste évolue du tome 1 au dernier ?
- Début : État initial, problème fondamental
- Milieu : Épreuves, apprentissages, doutes
- Fin : Résolution, nouvelle identité

**L'arc narratif principal** : La grande question/conflit de la série
- Quel est l'enjeu ultime ?
- Qu'est-ce qui doit être résolu à la fin ?

**Les sous-arcs par tome** : Chaque tome doit avoir :
- Son propre conflit résolu
- Une contribution à l'arc global
- Un cliffhanger ou une ouverture vers la suite

**La règle des 3 actes appliquée à la série** :
- Tome 1 = Acte 1 : Établir le monde et les enjeux
- Tomes intermédiaires = Acte 2 : Complications et développement
- Dernier tome = Acte 3 : Résolution et conclusion`,
          tips: [
            'Écrivez le résumé de votre dernier tome AVANT de commencer le premier',
            'Identifiez 3-5 moments clés répartis sur toute la série',
            'Chaque tome doit pouvoir se tenir seul tout en faisant partie du tout'
          ],
          examples: [
            'Arc de Harry : Orphelin ignorant → Héros qui accepte son destin',
            'Arc global HP : Défaire Voldemort et ses Horcruxes',
            'Sous-arc tome 1 HP : Protéger la Pierre Philosophale'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Personnages de Série',
      duration: '60 min',
      completed: false,
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Créer des personnages durables',
          content: `Les personnages d'une série doivent pouvoir évoluer sur plusieurs tomes :

**Profondeur initiale** : Dès le tome 1, vos personnages doivent avoir :
- Une blessure/faille qui les définit
- Des désirs conscients ET inconscients
- Des contradictions internes

**Potentiel d'évolution** : Prévoyez leur trajectoire :
- Où en sont-ils au début de la série ?
- Quelles épreuves les transformeront ?
- Qui seront-ils à la fin ?

**Cohérence vs Développement** : Le défi est de les faire évoluer tout en restant reconnaissables.

**La bible de personnage** doit inclure :
- Historique complet (même non révélé)
- Traits de personnalité stables
- Tics, expressions, habitudes récurrentes
- Relations avec les autres personnages`,
          tips: [
            'Créez une fiche détaillée pour chaque personnage récurrent',
            'Notez les secrets non révélés pour de futures intrigues',
            'Donnez à chaque personnage un trait distinctif mémorable'
          ],
          examples: [
            'Hermione : Intelligence + besoin de prouver sa valeur (née-moldue)',
            'Tyrion Lannister : Esprit brillant piégé dans un corps méprisé',
            'Katniss : Survivaliste qui devient symbole malgré elle'
          ],
          completed: false
        },
        {
          id: 'lesson-2-2',
          title: 'Arcs de personnages sur plusieurs tomes',
          content: `Chaque personnage important doit avoir son propre arc :

**Arc positif** : Le personnage surmonte sa faille
- Tome 1 : Introduction de la faille
- Tomes suivants : Confrontation progressive
- Dernier tome : Résolution/Guérison

**Arc négatif** : Le personnage succombe à sa faille
- Utile pour antagonistes ou personnages tragiques
- Crée du contraste avec les arcs positifs

**Arc plat** : Le personnage reste stable mais influence les autres
- Souvent pour les mentors ou figures d'autorité

**Répartition des moments clés** :
- Tome 1 : Établir qui ils sont vraiment
- Tome milieu : Le moment de doute maximal
- Avant-dernier : La décision cruciale
- Dernier : La transformation finale`,
          tips: [
            'Faites un graphique d\'évolution émotionnelle pour chaque personnage',
            'Alternez les tomes où chaque personnage est "au premier plan"',
            'Les personnages secondaires peuvent avoir des mini-arcs sur 1-2 tomes'
          ],
          examples: [
            'Arc de Neville Londubat : De garçon timide à héros (7 tomes)',
            'Arc de Jaime Lannister : De méchant à personnage nuancé',
            'Arc de Peeta : Amoureux → Torturé → Reconstruction'
          ],
          completed: false
        },
        {
          id: 'lesson-2-3',
          title: 'Gérer un casting de personnages',
          content: `Plus la série est longue, plus le casting grandit :

**Hiérarchie des personnages** :
1. **Protagoniste(s)** : Présents dans chaque tome
2. **Personnages principaux** : Arcs importants, présents souvent
3. **Secondaires récurrents** : Apparaissent régulièrement
4. **Personnages de tome** : Importants pour un tome spécifique

**Introduction progressive** : N'introduisez pas tout le monde au tome 1
- Tome 1 : Cast principal uniquement
- Tomes suivants : Nouveaux personnages avec de bonnes raisons

**Gestion des disparitions** :
- Morts doivent avoir un impact
- Personnages absents doivent être expliqués
- Possibilité de "retours" doit être préparée

**Le piège du "trop de personnages"** :
- Limitez le cast actif par tome
- Fusionnez des personnages si possible
- Donnez des rôles clairs à chacun`,
          tips: [
            'Créez un tableau de présence par tome pour chaque personnage',
            'Chaque nouveau personnage doit apporter quelque chose d\'unique',
            'N\'ayez pas peur de "tuer" des personnages pour l\'impact émotionnel'
          ],
          examples: [
            'HP : Introduction progressive (Sirius tome 3, Luna tome 5)',
            'GOT : Cast massif mais chacun a un rôle défini',
            'Hunger Games : Cast limité mais chaque mort compte'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Construire un Univers',
      duration: '50 min',
      completed: false,
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'World-building pour séries',
          content: `Un univers de série doit être extensible :

**La règle de l'iceberg** : Vous devez connaître 10x plus que ce que vous montrez
- Crée de la cohérence naturelle
- Permet d'ajouter des éléments sans contradiction
- Donne de la profondeur perçue

**Éléments à définir** :
- **Géographie** : Cartes, distances, climats
- **Histoire** : Événements passés qui influencent le présent
- **Culture** : Traditions, religions, hiérarchies sociales
- **Règles** : Magie, technologie, lois du monde
- **Économie** : Comment les gens vivent-ils ?

**Révélation progressive** :
- Tome 1 : L'essentiel pour comprendre
- Tomes suivants : Expansion et approfondissement
- Surprises : Révélations qui changent la perception`,
          tips: [
            'Créez un document "Bible de l\'univers" dès le début',
            'Dessinez une carte même approximative',
            'Définissez les règles de magie/technologie AVANT d\'écrire'
          ],
          examples: [
            'Terre du Milieu : Des millénaires d\'histoire pour 3 livres',
            'Westeros : Politique, familles, histoire détaillées',
            'Panem : Système de districts avec logique économique'
          ],
          completed: false
        },
        {
          id: 'lesson-3-2',
          title: 'Cohérence et continuité',
          content: `La cohérence est le plus grand défi des séries :

**Types d'incohérences à éviter** :
- **Factuelles** : Couleur des yeux, dates, distances
- **Caractérielles** : Personnage agit "out of character"
- **Logiques** : Règles du monde violées
- **Temporelles** : Chronologie impossible

**Outils de suivi** :
- Fiches personnages mises à jour
- Timeline visuelle
- Base de données des lieux
- Glossaire des termes inventés

**Processus de vérification** :
1. Relire les tomes précédents avant d'écrire
2. Chercher les contradictions pendant l'écriture
3. Bêta-lecteurs spécialisés dans la continuité
4. Feuille de continuité par chapitre`,
          tips: [
            'Utilisez un logiciel de notes interconnectées (Notion, Obsidian)',
            'Faites une timeline physique sur un mur',
            'Relisez TOUJOURS avant de commencer un nouveau tome'
          ],
          examples: [
            'Erreur HP : Neville voit les Sombrals alors qu\'il a vu sa mère mourir',
            'GOT : Changement de couleur des cheveux de Daario',
            'Twilight : Incohérences sur les pouvoirs des vampires'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'module-4',
      title: 'Techniques Narratives',
      duration: '55 min',
      completed: false,
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'L\'art du cliffhanger',
          content: `Le cliffhanger est l'outil de fidélisation par excellence :

**Types de cliffhangers** :
- **Action** : Danger imminent, combat interrompu
- **Révélation** : Information qui change tout
- **Décision** : Personnage face à un choix impossible
- **Mystère** : Question posée sans réponse

**Règles du bon cliffhanger** :
1. Doit être MÉRITÉ (préparé dans le tome)
2. Doit être RÉSOLVABLE (pas de triche au tome suivant)
3. Doit AVANCER l'intrigue (pas juste du suspense)
4. Doit être MÉMORABLE (le lecteur y pense)

**Erreurs à éviter** :
- Cliffhanger résolu en 2 pages au tome suivant
- Faux cliffhanger (situation moins grave qu'elle paraît)
- Cliffhanger qui annule le développement du tome`,
          tips: [
            'Planifiez vos cliffhangers en même temps que vos arcs',
            'Testez-le : le lecteur va-t-il VRAIMENT vouloir la suite ?',
            'Variez les types de cliffhangers entre les tomes'
          ],
          examples: [
            'HP tome 4 : Retour de Voldemort (révélation + danger)',
            'Empire Strikes Back : "Je suis ton père" (révélation)',
            'Hunger Games 1 : Règles changées, un seul vainqueur (décision)'
          ],
          completed: false
        },
        {
          id: 'lesson-4-2',
          title: 'Foreshadowing et payoff',
          content: `Planter et récolter sur plusieurs tomes :

**Foreshadowing** : Indices plantés pour des révélations futures
- **Subtil** : Le lecteur ne remarque qu'à la relecture
- **Moyen** : Crée du mystère conscient
- **Évident** : Promesse explicite à tenir

**Le payoff** : Moment où l'indice prend son sens
- Doit être SATISFAISANT
- Doit respecter les indices plantés
- Doit surprendre TOUT EN étant logique

**Technique du "Chekhov's Gun" étendue** :
- Si vous montrez quelque chose d'important → utilisez-le
- Plus l'élément est mis en avant → plus le payoff doit être grand
- Certains éléments peuvent traverser TOUS les tomes

**Grille de suivi** :
| Élément planté | Tome | Chapitre | Payoff prévu | Tome payoff |`,
          tips: [
            'Tenez un journal de tous les éléments plantés',
            'Certains foreshadowing peuvent être ajoutés en révision',
            'Les meilleurs payoffs récompensent les lecteurs attentifs'
          ],
          examples: [
            'HP : RAB (tome 6) → Regulus (tome 7)',
            'GOT : "L\'hiver vient" → Arrivée des Marcheurs Blancs',
            'Mistborn : Système de magie → Révélation finale sur les métaux'
          ],
          completed: false
        },
        {
          id: 'lesson-4-3',
          title: 'Équilibrer action et développement',
          content: `Chaque tome doit avoir son propre équilibre :

**Structure recommandée par tome** :
- 25% : Établissement/Rappel du contexte
- 50% : Développement de l'intrigue du tome
- 25% : Climax et transition vers la suite

**Le rythme de la série** :
- Tome 1 : Plus d'établissement, rythme progressif
- Tomes milieu : Plus d'action, moins d'exposition
- Dernier tome : Payoffs majeurs, résolutions

**Gérer les "pauses"** :
- Moments calmes nécessaires entre les crises
- Développement des relations pendant les pauses
- Indices plantés dans les moments "tranquilles"

**Le piège du "tome de transition"** :
- Chaque tome doit avoir SA propre histoire complète
- Évitez les tomes qui "préparent juste" le suivant
- Le lecteur doit être satisfait à la fin de CHAQUE tome`,
          tips: [
            'Faites un graphique de tension pour chaque tome',
            'Alternez scènes d\'action et scènes de caractère',
            'Le "milieu mou" est le plus grand danger des séries'
          ],
          examples: [
            'HP 5 : Tome le plus long mais action constante',
            'GOT : Alternance batailles et intrigues politiques',
            'Hunger Games 2 : Nouveau jeu = nouvelle tension'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'module-5',
      title: 'Publication et Marketing',
      duration: '40 min',
      completed: false,
      lessons: [
        {
          id: 'lesson-5-1',
          title: 'Stratégie de publication',
          content: `La publication d'une série demande une stratégie :

**Rythme de publication** :
- **Rapide (3-6 mois)** : Maintient l'intérêt, favorise l'algorithme
- **Annuel** : Permet plus de qualité, crée un événement
- **Variable** : Risque de perdre des lecteurs

**Stratégies recommandées** :
1. **Écrire 2-3 tomes avant de publier le premier**
   - Permet corrections de cohérence
   - Assure un rythme de publication
   - Réduit le stress

2. **Box-set après 3 tomes**
   - Nouveau produit à vendre
   - Prix attractif pour nouveaux lecteurs
   - Boost de visibilité

3. **Précommandes**
   - Fidélise les lecteurs
   - Améliore le classement au lancement`,
          tips: [
            'Annoncez la date du prochain tome dans votre livre',
            'Créez une newsletter pour votre série',
            'Préparez les couvertures en lot pour cohérence visuelle'
          ],
          examples: [
            'Stratégie rapide : Auteurs de romance (1 livre/mois)',
            'Stratégie événement : GRR Martin (attente = buzz)',
            'Stratégie mixte : Brandon Sanderson (régulier + qualité)'
          ],
          completed: false
        },
        {
          id: 'lesson-5-2',
          title: 'Marketing de série',
          content: `Le marketing d'une série a ses particularités :

**Le tome 1 est votre produit d'appel** :
- Prix bas ou gratuit périodiquement
- Maximum de reviews
- Couverture la plus travaillée

**Cross-promotion interne** :
- Extraits du tome suivant en fin de livre
- "Aussi de cet auteur" dans chaque tome
- Liens vers la série complète

**Création de communauté** :
- Groupe Facebook/Discord dédié
- Contenu exclusif entre les tomes
- Fan art, théories, discussions

**KDP et séries** :
- Catégories adaptées aux séries
- Mots-clés incluant "série", "tome 1", etc.
- Description mentionnant le nombre de tomes`,
          tips: [
            'Tome 1 gratuit = meilleure stratégie d\'acquisition',
            'Créez un "starter pack" pour nouveaux lecteurs',
            'Utilisez l\'email pour annoncer chaque nouveau tome'
          ],
          examples: [
            'Nombreux auteurs indie : Tome 1 à 0.99€ permanent',
            'Newsletters de série : 50%+ de taux d\'ouverture',
            'Box-set : Souvent meilleur vendeur que les tomes individuels'
          ],
          completed: false
        }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progress = (completedLessons.length / totalLessons) * 100;

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const goToNextLesson = () => {
    if (!currentModule || !currentLesson) return;
    
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === activeLesson);
    
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setActiveLesson(currentModule.lessons[currentLessonIndex + 1].id);
    } else {
      const currentModuleIndex = modules.findIndex(m => m.id === activeModule);
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        setActiveModule(nextModule.id);
        setActiveLesson(nextModule.lessons[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <ModernSidebar 
        activeTab="formation-series"
        onTabChange={(tab) => navigate(`/${tab}`)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Layers className="h-8 w-8 text-emerald-500" />
                Formation : Créer une Série à Succès
              </h1>
              <p className="text-muted-foreground mt-1">
                Maîtrisez l'art d'écrire des séries et sagas captivantes
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/formation-series-audio')}
                className="border-primary/20 text-emerald-600 hover:bg-emerald-500/10"
              >
                <Headphones className="h-4 w-4 mr-2" />
                Version Audio
              </Button>
              <Button variant="outline" onClick={() => navigate('/ebook-planner')}>
                Retour au planificateur
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-muted-foreground">
                  {completedLessons.length}/{totalLessons} leçons
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              {progress === 100 && (
                <div className="flex items-center gap-2 mt-3 text-emerald-600">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Félicitations ! Formation complétée !</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Modules */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="font-semibold mb-3">Modules</h3>
              {modules.map((module, index) => {
                const moduleCompleted = module.lessons.every(l => completedLessons.includes(l.id));
                const moduleLessonsCompleted = module.lessons.filter(l => completedLessons.includes(l.id)).length;
                
                return (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-all ${activeModule === module.id ? 'ring-2 ring-emerald-500' : 'hover:bg-muted/50'}`}
                    onClick={() => {
                      setActiveModule(module.id);
                      setActiveLesson(module.lessons[0].id);
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${moduleCompleted ? 'bg-emerald-500 text-white' : 'bg-muted'}`}>
                          {moduleCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{module.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{module.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {moduleLessonsCompleted}/{module.lessons.length}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4">
              {currentModule && (
                <>
                  {/* Lessons tabs */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {currentModule.lessons.map((lesson, index) => (
                          <Button
                            key={lesson.id}
                            variant={activeLesson === lesson.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveLesson(lesson.id)}
                            className="relative"
                          >
                            {completedLessons.includes(lesson.id) && (
                              <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                            )}
                            Leçon {index + 1}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lesson Content */}
                  {currentLesson && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-emerald-500" />
                          {currentLesson.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Main content */}
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {currentLesson.content.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="whitespace-pre-line">{paragraph}</p>
                          ))}
                        </div>

                        {/* Tips */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            Conseils pratiques
                          </h4>
                          <ul className="space-y-2">
                            {currentLesson.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Examples */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <Star className="h-4 w-4 text-blue-500" />
                            Exemples célèbres
                          </h4>
                          <ul className="space-y-2">
                            {currentLesson.examples.map((example, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <BookMarked className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => markLessonComplete(currentLesson.id)}
                            disabled={completedLessons.includes(currentLesson.id)}
                          >
                            {completedLessons.includes(currentLesson.id) ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                Complétée
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marquer comme lue
                              </>
                            )}
                          </Button>
                          <Button onClick={goToNextLesson}>
                            Leçon suivante
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationSeriesPage;
