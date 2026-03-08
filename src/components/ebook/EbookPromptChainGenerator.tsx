import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Sparkles, Copy, BookOpen, Zap, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface PromptChain {
  genre: string;
  emoji: string;
  description: string;
  color: string;
  steps: { title: string; prompt: string; output: string }[];
}

const PROMPT_CHAINS: PromptChain[] = [
  {
    genre: 'Développement Personnel',
    emoji: '🧠',
    description: 'Livre de coaching/self-help structuré avec exercices pratiques',
    color: 'from-blue-500 to-indigo-500',
    steps: [
      { title: '1. Plan stratégique', prompt: 'Crée un plan de livre de développement personnel sur [SUJET]. 10 chapitres progressifs avec titre accrocheur + 3 sous-sections par chapitre. Structure : Problème → Prise de conscience → Méthode → Action. Inclus un exercice pratique par chapitre.', output: 'Plan complet avec titres' },
      { title: '2. Introduction magnétique', prompt: 'Rédige une introduction de 800 mots pour ce livre. Commence par une anecdote personnelle percutante. Utilise le "vous" pour impliquer le lecteur. Termine par la promesse du livre.', output: 'Introduction 800 mots' },
      { title: '3. Rédaction chapitres', prompt: 'Rédige le chapitre [N] "[TITRE]" (2000+ mots). Structure : histoire d\'ouverture → concept clé → méthode en 3 étapes → exercice pratique → citation inspirante → transition vers le chapitre suivant.', output: 'Chapitre complet' },
      { title: '4. Exercices & fiches', prompt: 'Crée 10 exercices pratiques et 5 fiches-actions récapitulatives à insérer en fin de livre. Format : objectif, durée, étapes, résultat attendu.', output: 'Exercices + fiches' },
      { title: '5. Conclusion & CTA', prompt: 'Rédige une conclusion de 600 mots qui résume les 3 transformations clés. Ajoute un appel à l\'action vers ton prochain livre ou ta communauté.', output: 'Conclusion + CTA' },
    ]
  },
  {
    genre: 'Thriller / Polar',
    emoji: '🔪',
    description: 'Roman policier avec rebondissements et personnages complexes',
    color: 'from-red-500 to-orange-500',
    steps: [
      { title: '1. Bible du thriller', prompt: 'Crée la bible de mon thriller sur [SUJET]. Inclus : le crime (qui, quoi, comment, pourquoi), 5 suspects avec mobile/alibi, le protagoniste (failles + motivation), 3 fausses pistes, le twist final. Timeline sur 72h.', output: 'Bible narrative complète' },
      { title: '2. Structure en 3 actes', prompt: 'Structure le thriller en 15 chapitres (3 actes). Acte 1 (ch1-4) : découverte du crime + présentation. Acte 2 (ch5-11) : enquête + fausses pistes + montée tension. Acte 3 (ch12-15) : révélation + confrontation + résolution.', output: 'Plan 15 chapitres' },
      { title: '3. Chapitre d\'ouverture', prompt: 'Rédige le chapitre 1 (3000 mots). Commence in medias res (au cœur de l\'action). Installe l\'atmosphère sombre. Termine par un cliffhanger. Dialogues réalistes et courts.', output: 'Chapitre 1 percutant' },
      { title: '4. Chapitres de tension', prompt: 'Rédige le chapitre [N] (2500 mots). Alterne POV si nécessaire. Chaque chapitre doit révéler UN indice et créer UN nouveau doute. Fin de chapitre = micro-cliffhanger obligatoire.', output: 'Chapitre avec tension' },
      { title: '5. Le twist final', prompt: 'Rédige les chapitres 14-15 (4000 mots total). La révélation doit être surprenante MAIS cohérente avec tous les indices semés. Résolution émotionnelle. Dernière phrase mémorable.', output: 'Dénouement explosif' },
    ]
  },
  {
    genre: 'Romance',
    emoji: '💕',
    description: 'Romance contemporaine avec chimie et développement des personnages',
    color: 'from-pink-500 to-rose-500',
    steps: [
      { title: '1. Fiches personnages', prompt: 'Crée 2 fiches de personnages principaux pour une romance sur [SUJET]. Pour chacun : nom, âge, physique, blessure émotionnelle passée, trait attachant, défaut, rêve secret. Définir leur "meet-cute" (première rencontre).', output: '2 fiches personnages' },
      { title: '2. Arc romantique', prompt: 'Structure la romance en 12 chapitres avec l\'arc classique : rencontre → attraction → obstacles → rapprochement → crise → séparation → déclaration → happy ending. Détaille chaque beat émotionnel.', output: 'Plan émotionnel' },
      { title: '3. La rencontre', prompt: 'Rédige les chapitres 1-2 (3000 mots). Meet-cute mémorable + chimie immédiate + dialogue pétillant. Le lecteur doit shipper le couple dès la page 3.', output: 'Rencontre + chimie' },
      { title: '4. Tension romantique', prompt: 'Rédige le chapitre [N] (2500 mots). Scène de rapprochement avec tension non résolue. Slow-burn : presque-baisers, regards, frôlements. Dialogues sous-textuels.', output: 'Tension & slow-burn' },
      { title: '5. Le climax émotionnel', prompt: 'Rédige les chapitres 11-12 (3000 mots). La grande déclaration. Résolution du conflit interne. Scène finale émouvante. Épilogue doux (6 mois plus tard).', output: 'Happy ending' },
    ]
  },
  {
    genre: 'Finance / Business',
    emoji: '💰',
    description: 'Guide pratique finance/investissement avec études de cas',
    color: 'from-green-500 to-emerald-500',
    steps: [
      { title: '1. Recherche & plan', prompt: 'Crée un plan de livre pratique sur [SUJET FINANCE]. 8 chapitres : du débutant à l\'avancé. Chaque chapitre = 1 concept + 1 stratégie + 1 erreur à éviter + 1 étude de cas chiffrée. Public cible : [AUDIENCE].', output: 'Plan structuré' },
      { title: '2. Chapitres fondamentaux', prompt: 'Rédige le chapitre [N] (2500 mots). Commence par un mythe à déconstruire. Explique le concept avec une analogie simple. Données chiffrées réelles. Étude de cas. Checklist actionnable en fin de chapitre.', output: 'Chapitre expert' },
      { title: '3. Études de cas', prompt: 'Crée 5 études de cas réalistes pour illustrer les concepts du livre. Format : Situation initiale → Stratégie appliquée → Résultats chiffrés → Leçon clé. Varier les profils (salarié, entrepreneur, retraité).', output: '5 études de cas' },
      { title: '4. Outils & templates', prompt: 'Crée 8 outils pratiques : tableaux de calcul, checklists, modèles de budget, grilles de décision. Format prêt à imprimer. Chaque outil = titre + mode d\'emploi + exemple rempli.', output: 'Outils pratiques' },
      { title: '5. FAQ & glossaire', prompt: 'Rédige une FAQ de 20 questions fréquentes sur [SUJET] + un glossaire de 30 termes essentiels. Réponses concises et actionnables.', output: 'FAQ + Glossaire' },
    ]
  },
  {
    genre: 'Cuisine / Recettes',
    emoji: '🍳',
    description: 'Livre de recettes thématique avec photos et conseils de chef',
    color: 'from-amber-500 to-yellow-500',
    steps: [
      { title: '1. Concept & structure', prompt: 'Crée le concept d\'un livre de recettes sur [THÈME]. 6 sections thématiques, 8-10 recettes par section. Pour chaque recette : nom créatif, temps de préparation, difficulté, portions. Inclure une introduction de chef.', output: 'Plan du livre' },
      { title: '2. Recettes détaillées', prompt: 'Rédige 5 recettes complètes pour la section [N]. Format : intro alléchante, ingrédients précis (g/ml), étapes numérotées détaillées, astuces du chef, variantes, accords boisson.', output: '5 recettes' },
      { title: '3. Conseils techniques', prompt: 'Rédige 10 pages de conseils techniques : techniques de base, liste d\'ustensiles indispensables, tableau de substitution d\'ingrédients, conversions mesures, temps de cuisson par aliment.', output: 'Guide technique' },
      { title: '4. Descriptions visuelles', prompt: 'Pour chaque recette, rédige une description visuelle pour la génération d\'images IA : dressage, angle de prise de vue, éclairage, décor de table, couleurs dominantes.', output: 'Prompts photos' },
      { title: '5. Index & bonus', prompt: 'Crée un index par ingrédient principal, un planning de repas hebdomadaire, et une liste de courses type. Ajouter 3 menus complets (entrée-plat-dessert) pour occasions spéciales.', output: 'Index + menus' },
    ]
  },
  {
    genre: 'Science-Fiction',
    emoji: '🚀',
    description: 'Roman SF avec worldbuilding riche et concepts innovants',
    color: 'from-purple-500 to-violet-500',
    steps: [
      { title: '1. Worldbuilding', prompt: 'Crée l\'univers de mon roman SF sur [CONCEPT]. Définir : époque, technologie clé, système social, conflit central, 3 factions/espèces, règles physiques de l\'univers. Carte conceptuelle du monde.', output: 'Bible de l\'univers' },
      { title: '2. Personnages & enjeux', prompt: 'Crée 4 personnages principaux avec : backstory, compétence unique, motivation profonde, arc de transformation. Définir les relations entre eux et leur rôle dans le conflit central.', output: 'Fiches personnages' },
      { title: '3. Structure narrative', prompt: 'Structure le roman en 20 chapitres. Alterner chapitres d\'action et chapitres de worldbuilding. Placer 3 retournements majeurs. Crescendo constant vers le climax.', output: 'Plan 20 chapitres' },
      { title: '4. Scènes clés', prompt: 'Rédige le chapitre [N] (3000 mots). Équilibrer action, dialogue et description de l\'univers. Le jargon SF doit être compréhensible par le contexte. Sensations immersives.', output: 'Chapitre immersif' },
      { title: '5. Climax & ouverture', prompt: 'Rédige les 3 derniers chapitres (5000 mots). Confrontation finale spectaculaire. Résolution du conflit principal MAIS ouverture vers une suite potentielle. Dernière ligne qui résonne.', output: 'Fin + setup suite' },
    ]
  },
];

export const EbookPromptChainGenerator: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const copyPrompt = (prompt: string, stepTitle: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success(`Prompt "${stepTitle}" copié !`);
  };

  const toggleStep = (genreId: string, stepIdx: number) => {
    const key = `${genreId}-${stepIdx}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selected = PROMPT_CHAINS.find(c => c.genre === selectedGenre);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" />
            Générateur de Chaînes de Prompts
          </CardTitle>
          <p className="text-muted-foreground">
            Séquences de prompts optimisés par genre — Créez un livre entier étape par étape
          </p>
        </CardHeader>
      </Card>

      {/* Genre Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROMPT_CHAINS.map(chain => {
          const completed = chain.steps.filter((_, i) => completedSteps[`${chain.genre}-${i}`]).length;
          return (
            <Card
              key={chain.genre}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedGenre === chain.genre ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedGenre(chain.genre)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{chain.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold">{chain.genre}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{chain.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{chain.steps.length} étapes</Badge>
                      {completed > 0 && (
                        <Badge variant="default">{completed}/{chain.steps.length} ✓</Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Chain Detail */}
      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{selected.emoji}</span>
              Chaîne : {selected.genre}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {selected.steps.map((step, idx) => {
                  const key = `${selected.genre}-${idx}`;
                  const isDone = completedSteps[key];
                  return (
                    <div key={idx} className={`p-4 rounded-xl border transition-all ${isDone ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40' : 'bg-muted/30 border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isDone ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleStep(selected.genre, idx)}
                            className="h-7 w-7 p-0 rounded-full"
                          >
                            {isDone ? '✓' : idx + 1}
                          </Button>
                          <h4 className={`font-semibold ${isDone ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">{step.output}</Badge>
                      </div>
                      <div className="bg-background/80 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap border">
                        {step.prompt}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 gap-1"
                        onClick={() => copyPrompt(step.prompt, step.title)}
                      >
                        <Copy className="h-3 w-3" /> Copier le prompt
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
