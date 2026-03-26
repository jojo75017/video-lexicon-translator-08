import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Loader2, Layers, Users, MapPin, BookMarked, Sparkles,
  CheckCircle, Clock, Headphones
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AudioLesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
}

interface AudioModule {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  lessons: AudioLesson[];
}

const seriesAudioModules: AudioModule[] = [
  {
    id: 'module-1',
    title: 'Fondamentaux des Séries',
    icon: Layers,
    color: 'from-emerald-500 to-teal-500',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Pourquoi écrire une série ?',
        content: `Bienvenue dans cette formation sur la création de séries littéraires. 
        
Une série de livres offre des avantages uniques pour les auteurs. Premièrement, la fidélisation des lecteurs : ceux qui aiment le premier tome reviendront naturellement pour la suite. C'est un investissement qui rapporte sur le long terme.

Deuxièmement, le développement approfondi : une série permet d'explorer des personnages, des univers et des thèmes avec une profondeur impossible dans un livre unique.

Troisièmement, la visibilité accrue : sur Amazon et les plateformes, chaque nouveau tome augmente votre visibilité et crée un effet de catalogue.

Enfin, les revenus récurrents : un lecteur satisfait achètera tous vos tomes, multipliant vos revenus par le nombre de livres.

Conseil pratique : planifiez au moins les grandes lignes des 3 premiers tomes avant de commencer. Gardez des notes détaillées dès le début pour éviter les incohérences.`,
        duration: '3 min'
      },
      {
        id: 'lesson-1-2',
        title: 'Types de séries littéraires',
        content: `Il existe plusieurs formats de séries, chacun avec ses avantages.

La série à épisodes : chaque tome est relativement indépendant avec un personnage récurrent. Pensez à Sherlock Holmes ou James Bond. L'avantage ? Les lecteurs peuvent commencer n'importe où. C'est idéal pour les policiers, thrillers et romances.

La série feuilleton : l'histoire continue sur plusieurs tomes, la lecture séquentielle est obligatoire. L'avantage ? Immersion maximale et fidélisation forte. Idéal pour la fantasy, la science-fiction épique et les sagas familiales.

La trilogie ou duologie : format court avec un arc défini. L'avantage ? Planification plus simple, engagement limité. C'est idéal pour les premiers auteurs ou les concepts ciblés.

La série ouverte : le nombre de tomes n'est pas défini à l'avance. L'avantage ? Flexibilité selon le succès. Attention au risque : c'est difficile à maintenir cohérent sur la durée.

Choisissez le format en fonction de votre histoire, pas l'inverse. Les trilogies sont excellentes pour débuter.`,
        duration: '3 min'
      },
      {
        id: 'lesson-1-3',
        title: 'Planifier votre arc global',
        content: `L'arc global est la colonne vertébrale de votre série.

L'arc de transformation : comment votre protagoniste évolue du tome 1 au dernier ? Au début, son état initial et son problème fondamental. Au milieu, les épreuves, les apprentissages, les doutes. À la fin, la résolution et sa nouvelle identité.

L'arc narratif principal : c'est la grande question ou le conflit de la série. Quel est l'enjeu ultime ? Qu'est-ce qui doit être résolu à la fin ?

Les sous-arcs par tome : chaque tome doit avoir son propre conflit résolu, une contribution à l'arc global, et un cliffhanger ou une ouverture vers la suite.

La règle des 3 actes appliquée à la série : le tome 1 est l'acte 1, il établit le monde et les enjeux. Les tomes intermédiaires sont l'acte 2, avec les complications et le développement. Le dernier tome est l'acte 3, la résolution et la conclusion.

Conseil crucial : écrivez le résumé de votre dernier tome AVANT de commencer le premier. Identifiez 3 à 5 moments clés répartis sur toute la série.`,
        duration: '4 min'
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Personnages de Série',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Créer des personnages durables',
        content: `Les personnages d'une série doivent pouvoir évoluer sur plusieurs tomes.

La profondeur initiale : dès le tome 1, vos personnages doivent avoir une blessure ou faille qui les définit, des désirs conscients ET inconscients, et des contradictions internes.

Le potentiel d'évolution : prévoyez leur trajectoire. Où en sont-ils au début de la série ? Quelles épreuves les transformeront ? Qui seront-ils à la fin ?

Le défi de la cohérence versus le développement : faire évoluer les personnages tout en les gardant reconnaissables.

La bible de personnage doit inclure : l'historique complet même si non révélé, les traits de personnalité stables, les tics, expressions et habitudes récurrentes, et les relations avec les autres personnages.

Créez une fiche détaillée pour chaque personnage récurrent. Notez les secrets non révélés pour de futures intrigues. Donnez à chaque personnage un trait distinctif mémorable.`,
        duration: '3 min'
      },
      {
        id: 'lesson-2-2',
        title: 'Arcs de personnages sur plusieurs tomes',
        content: `Chaque personnage important doit avoir son propre arc.

L'arc positif : le personnage surmonte sa faille. Tome 1 : introduction de la faille. Tomes suivants : confrontation progressive. Dernier tome : résolution et guérison.

L'arc négatif : le personnage succombe à sa faille. C'est utile pour les antagonistes ou les personnages tragiques. Cela crée du contraste avec les arcs positifs.

L'arc plat : le personnage reste stable mais influence les autres. Souvent utilisé pour les mentors ou figures d'autorité.

Répartition des moments clés : Tome 1, établir qui ils sont vraiment. Tome du milieu, le moment de doute maximal. Avant-dernier tome, la décision cruciale. Dernier tome, la transformation finale.

Faites un graphique d'évolution émotionnelle pour chaque personnage. Alternez les tomes où chaque personnage est au premier plan.`,
        duration: '3 min'
      },
      {
        id: 'lesson-2-3',
        title: 'Gérer un casting de personnages',
        content: `Plus la série est longue, plus le casting grandit.

La hiérarchie des personnages : les protagonistes sont présents dans chaque tome. Les personnages principaux ont des arcs importants et sont présents souvent. Les secondaires récurrents apparaissent régulièrement. Les personnages de tome sont importants pour un tome spécifique.

L'introduction progressive : n'introduisez pas tout le monde au tome 1. Tome 1 : cast principal uniquement. Tomes suivants : nouveaux personnages avec de bonnes raisons.

La gestion des disparitions : les morts doivent avoir un impact. Les personnages absents doivent être expliqués. La possibilité de retours doit être préparée.

Le piège du trop de personnages : limitez le cast actif par tome, fusionnez des personnages si possible, donnez des rôles clairs à chacun.

Créez un tableau de présence par tome pour chaque personnage. Chaque nouveau personnage doit apporter quelque chose d'unique.`,
        duration: '3 min'
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Construire un Univers',
    icon: MapPin,
    color: 'from-purple-500 to-violet-500',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'World-building pour séries',
        content: `Un univers de série doit être extensible.

La règle de l'iceberg : vous devez connaître 10 fois plus que ce que vous montrez. Cela crée de la cohérence naturelle, permet d'ajouter des éléments sans contradiction, et donne de la profondeur perçue.

Les éléments à définir : la géographie avec cartes, distances et climats. L'histoire avec les événements passés qui influencent le présent. La culture avec traditions, religions et hiérarchies sociales. Les règles de magie, technologie et lois du monde. L'économie et comment les gens vivent.

La révélation progressive : Tome 1, l'essentiel pour comprendre. Tomes suivants, expansion et approfondissement. Les surprises sont des révélations qui changent la perception.

Créez un document Bible de l'univers dès le début. Dessinez une carte même approximative. Définissez les règles de magie ou technologie AVANT d'écrire.`,
        duration: '3 min'
      },
      {
        id: 'lesson-3-2',
        title: 'Cohérence et continuité',
        content: `La cohérence est le plus grand défi des séries.

Les types d'incohérences à éviter : factuelles comme la couleur des yeux, les dates, les distances. Caractérielles où un personnage agit de façon incohérente. Logiques où les règles du monde sont violées. Temporelles avec une chronologie impossible.

Les outils de suivi : fiches personnages mises à jour, timeline visuelle, base de données des lieux, glossaire des termes inventés.

Le processus de vérification : premièrement, relire les tomes précédents avant d'écrire. Deuxièmement, chercher les contradictions pendant l'écriture. Troisièmement, avoir des bêta-lecteurs spécialisés dans la continuité. Quatrièmement, tenir une feuille de continuité par chapitre.

Utilisez un logiciel de notes interconnectées comme Notion ou Obsidian. Faites une timeline physique sur un mur. Relisez TOUJOURS avant de commencer un nouveau tome.`,
        duration: '3 min'
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Techniques Narratives',
    icon: BookMarked,
    color: 'from-amber-500 to-orange-500',
    lessons: [
      {
        id: 'lesson-4-1',
        title: "L'art du cliffhanger",
        content: `Le cliffhanger est l'outil de fidélisation par excellence.

Les types de cliffhangers : action avec danger imminent ou combat interrompu. Révélation avec une information qui change tout. Décision où le personnage fait face à un choix impossible. Mystère avec une question posée sans réponse.

Les règles du bon cliffhanger : il doit être MÉRITÉ, préparé dans le tome. Il doit être RÉSOLVABLE, pas de triche au tome suivant. Il doit AVANCER l'intrigue, pas juste du suspense. Il doit être MÉMORABLE, le lecteur y pense après.

Les erreurs à éviter : un cliffhanger résolu en 2 pages au tome suivant. Un faux cliffhanger où la situation est moins grave qu'elle paraît. Un cliffhanger qui annule le développement du tome.

Planifiez vos cliffhangers en même temps que vos arcs. Testez-le : le lecteur va-t-il VRAIMENT vouloir la suite ? Variez les types de cliffhangers entre les tomes.`,
        duration: '3 min'
      },
      {
        id: 'lesson-4-2',
        title: 'Foreshadowing et payoff',
        content: `Planter et récolter sur plusieurs tomes.

Le foreshadowing : ce sont les indices plantés pour des révélations futures. Le subtil : le lecteur ne remarque qu'à la relecture. Le moyen : crée du mystère conscient. L'évident : promesse explicite à tenir.

Le payoff : c'est le moment où l'indice prend son sens. Il doit être SATISFAISANT. Il doit respecter les indices plantés. Il doit surprendre TOUT EN étant logique.

La technique du Chekhov's Gun étendue : si vous montrez quelque chose d'important, utilisez-le. Plus l'élément est mis en avant, plus le payoff doit être grand. Certains éléments peuvent traverser TOUS les tomes.

Tenez un journal de tous les éléments plantés. Certains foreshadowing peuvent être ajoutés en révision. Les meilleurs payoffs récompensent les lecteurs attentifs.`,
        duration: '3 min'
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Publication et Marketing',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Stratégie de publication',
        content: `La publication d'une série demande une stratégie.

Le rythme de publication : rapide de 3 à 6 mois maintient l'intérêt et favorise l'algorithme. Annuel permet plus de qualité et crée un événement. Variable risque de perdre des lecteurs.

Les stratégies recommandées : premièrement, écrire 2 à 3 tomes avant de publier le premier. Cela permet des corrections de cohérence, assure un rythme de publication, et réduit le stress.

Deuxièmement, créer un box-set après 3 tomes. C'est un nouveau produit à vendre, un prix attractif pour nouveaux lecteurs, et un boost de visibilité.

Troisièmement, utiliser les précommandes. Cela fidélise les lecteurs et améliore le classement au lancement.

Annoncez la date du prochain tome dans votre livre. Créez une newsletter pour votre série. Préparez les couvertures en lot pour une cohérence visuelle.`,
        duration: '3 min'
      },
      {
        id: 'lesson-5-2',
        title: 'Marketing de série',
        content: `Le marketing d'une série a ses particularités.

Le tome 1 est votre produit d'appel : prix bas ou gratuit périodiquement, maximum de reviews, couverture la plus travaillée.

La cross-promotion interne : extraits du tome suivant en fin de livre, section Aussi de cet auteur dans chaque tome, liens vers la série complète.

La création de communauté : groupe Facebook ou Discord dédié, contenu exclusif entre les tomes, fan art, théories et discussions.

KDP et séries : catégories adaptées aux séries, mots-clés incluant série, tome 1, etc, description mentionnant le nombre de tomes.

Le tome 1 gratuit est la meilleure stratégie d'acquisition. Créez un starter pack pour nouveaux lecteurs. Utilisez l'email pour annoncer chaque nouveau tome.

Félicitations ! Vous avez terminé cette formation. Vous avez maintenant toutes les clés pour créer une série à succès. Bonne écriture !`,
        duration: '3 min'
      }
    ]
  }
];

export const EbookFormationSeriesAudio: React.FC = () => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const currentModule = seriesAudioModules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const totalLessons = seriesAudioModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.length;
  const overallProgress = (completedCount / totalLessons) * 100;

  const generateAudio = async (text: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { 
          text: text.substring(0, 4500),
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - douce et narrative
        }
      });

      if (error) throw error;
      if (!data?.audioContent) throw new Error('No audio content received');

      const audioDataUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audioResponse = await fetch(audioDataUrl);
      const audioBlob = await audioResponse.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      toast.error('Erreur lors de la génération audio: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const playCurrentLesson = () => {
    if (currentLesson) {
      generateAudio(currentLesson.content);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (!audioUrl) {
          playCurrentLesson();
        } else {
          audioRef.current.play();
        }
      }
      setIsPlaying(!isPlaying);
    } else if (!audioUrl) {
      playCurrentLesson();
    }
  };

  const goToNextLesson = () => {
    // Mark current as completed
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }

    // Navigate to next
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < seriesAudioModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    } else {
      toast.success('Félicitations ! Formation terminée !');
      return;
    }
    
    setAudioUrl(null);
    setProgress(0);
    if (autoPlay) {
      setTimeout(() => playCurrentLesson(), 500);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModule = seriesAudioModules[currentModuleIndex - 1];
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
    setAudioUrl(null);
    setProgress(0);
  };

  const selectLesson = (moduleIdx: number, lessonIdx: number) => {
    setCurrentModuleIndex(moduleIdx);
    setCurrentLessonIndex(lessonIdx);
    setAudioUrl(null);
    setProgress(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (autoPlay) {
        goToNextLesson();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, currentModuleIndex, currentLessonIndex]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Headphones className="h-8 w-8 text-emerald-500" />
          Formation Audio : Créer une Série à Succès
        </h1>
        <p className="text-muted-foreground mt-2">
          Écoutez les leçons avec lecture automatique
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalLessons} leçons
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlist */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold">Playlist</h3>
          {seriesAudioModules.map((module, mIdx) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className={`py-3 bg-gradient-to-r ${module.color} text-white`}>
                <CardTitle className="text-sm flex items-center gap-2">
                  <module.icon className="h-4 w-4" />
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {module.lessons.map((lesson, lIdx) => {
                  const isActive = mIdx === currentModuleIndex && lIdx === currentLessonIndex;
                  const isCompleted = completedLessons.includes(lesson.id);
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(mIdx, lIdx)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      ) : isActive && isPlaying ? (
                        <Volume2 className="h-4 w-4 text-emerald-500 flex-shrink-0 animate-pulse" />
                      ) : (
                        <Play className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
            <CardHeader>
              <Badge className={`w-fit bg-gradient-to-r ${currentModule.color}`}>
                Module {currentModuleIndex + 1}
              </Badge>
              <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audio element */}
              <audio ref={audioRef} className="hidden" muted={isMuted} />

              {/* Progress bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.floor(progress)}%</span>
                  <span>{currentLesson.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToPreviousLesson}
                  disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button 
                  size="lg"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={goToNextLesson}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Auto-play toggle */}
              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoplay" className="text-sm text-muted-foreground">
                  Lecture automatique de la leçon suivante
                </label>
              </div>

              {/* Transcript */}
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookMarked className="h-4 w-4" />
                    Transcription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto text-sm text-muted-foreground whitespace-pre-line">
                    {currentLesson.content}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
