import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Sparkles, Star, Copy, CheckCircle2, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface BookTemplate {
  id: string;
  name: string;
  category: string;
  emoji: string;
  chapters: number;
  wordTarget: number;
  tone: string;
  audience: string;
  structure: string[];
  prompts: string[];
  description: string;
  difficulty: 'facile' | 'moyen' | 'avancé';
}

const templates: BookTemplate[] = [
  { id: 'dev-perso-1', name: 'Guide de Développement Personnel', category: 'Dev Perso', emoji: '🧠', chapters: 10, wordTarget: 25000, tone: 'Motivant et pratique', audience: 'Adultes 25-45 ans', difficulty: 'facile', description: 'Structure classique pour un guide d\'amélioration personnelle avec exercices pratiques.', structure: ['Introduction : Pourquoi ce livre change tout', 'Chapitre 1 : Le diagnostic honnête', 'Chapitre 2 : Définir sa vision', 'Chapitre 3 : Les habitudes qui transforment', 'Chapitre 4 : Vaincre la procrastination', 'Chapitre 5 : L\'art de la discipline', 'Chapitre 6 : Relations et entourage', 'Chapitre 7 : Finances et liberté', 'Chapitre 8 : Santé corps-esprit', 'Chapitre 9 : Plan d\'action 90 jours', 'Conclusion : Votre nouvelle vie commence'], prompts: ['Écris comme un coach bienveillant mais direct', 'Chaque chapitre = 1 problème + 1 méthode + 1 exercice'] },
  { id: 'business-1', name: 'Business & Entrepreneuriat', category: 'Business', emoji: '💼', chapters: 12, wordTarget: 30000, tone: 'Professionnel et inspirant', audience: 'Entrepreneurs débutants', difficulty: 'moyen', description: 'Guide complet pour lancer son business avec études de cas réels.', structure: ['L\'état d\'esprit entrepreneur', 'Trouver son idée rentable', 'Étude de marché express', 'Le business model canvas', 'MVP et lancement rapide', 'Marketing digital', 'Vente et closing', 'Gestion financière', 'Scaling : passer à l\'échelle', 'Leadership et management', 'Les erreurs fatales à éviter', 'Votre plan d\'action'], prompts: ['Style direct, chiffres concrets, pas de théorie vague', 'Inclure 2 études de cas par chapitre'] },
  { id: 'romance-1', name: 'Romance Contemporaine', category: 'Fiction', emoji: '💕', chapters: 20, wordTarget: 60000, tone: 'Émotionnel et captivant', audience: 'Femmes 20-50 ans', difficulty: 'avancé', description: 'Structure classique en 3 actes pour une romance page-turner.', structure: ['La rencontre (chapitres 1-3)', 'L\'attirance (chapitres 4-7)', 'Le rapprochement (chapitres 8-10)', 'L\'obstacle majeur (chapitres 11-14)', 'La séparation (chapitres 15-17)', 'La résolution (chapitres 18-20)'], prompts: ['Alterner les points de vue', 'Un cliffhanger par chapitre', 'Show don\'t tell pour les émotions'] },
  { id: 'thriller-1', name: 'Thriller Psychologique', category: 'Fiction', emoji: '🔪', chapters: 25, wordTarget: 70000, tone: 'Tendu et haletant', audience: 'Adultes', difficulty: 'avancé', description: 'Chapitres courts, retournements de situation, tension croissante.', structure: ['Le crime / l\'événement déclencheur', 'Présentation du protagoniste', 'Les premiers indices', 'Fausse piste #1', 'Montée de tension', 'Révélation intermédiaire', 'Fausse piste #2', 'Course contre la montre', 'Le twist majeur', 'Dénouement'], prompts: ['Chapitres de 2000-2500 mots max', 'Finir chaque chapitre sur un cliffhanger', 'Le lecteur doit suspecter tout le monde'] },
  { id: 'cuisine-1', name: 'Livre de Recettes Thématique', category: 'Cuisine', emoji: '🍳', chapters: 8, wordTarget: 20000, tone: 'Chaleureux et gourmand', audience: 'Passionnés de cuisine', difficulty: 'facile', description: 'Organisation par thème avec 5-8 recettes par chapitre.', structure: ['Introduction et philosophie culinaire', 'Petit-déjeuners énergisants', 'Déjeuners express', 'Dîners pour impressionner', 'Desserts irrésistibles', 'Snacks et en-cas', 'Recettes de saison', 'Menus complets semaine'], prompts: ['Chaque recette : ingrédients + étapes + astuce chef + variante', 'Inclure temps de préparation et difficulté'] },
  { id: 'finance-1', name: 'Liberté Financière', category: 'Finance', emoji: '💰', chapters: 10, wordTarget: 25000, tone: 'Pédagogique et motivant', audience: 'Débutants en finance', difficulty: 'moyen', description: 'De l\'épargne aux investissements : guide pas à pas.', structure: ['Votre relation à l\'argent', 'Le budget qui libère', 'Éliminer les dettes', 'L\'épargne automatique', 'Investir en bourse', 'L\'immobilier accessible', 'Les revenus passifs', 'La fiscalité optimisée', 'Protéger son patrimoine', 'Plan vers l\'indépendance'], prompts: ['Pas de jargon financier', 'Exemples chiffrés avec des salaires réalistes', 'Tableaux et calculs simples'] },
  { id: 'sante-1', name: 'Guide Bien-être & Santé', category: 'Santé', emoji: '🧘', chapters: 10, wordTarget: 22000, tone: 'Bienveillant et scientifique', audience: 'Grand public', difficulty: 'facile', description: 'Approche holistique santé avec conseils actionnables.', structure: ['Bilan de santé personnel', 'Nutrition fondamentale', 'Mouvement et exercice', 'Sommeil réparateur', 'Gestion du stress', 'Santé mentale', 'Détox numérique', 'Relations saines', 'Routines quotidiennes', 'Plan 30 jours transformation'], prompts: ['Citer des études scientifiques', 'Un exercice pratique par section', 'Ton expert mais accessible'] },
  { id: 'parent-1', name: 'Guide Parental Moderne', category: 'Famille', emoji: '👶', chapters: 12, wordTarget: 28000, tone: 'Empathique et rassurant', audience: 'Jeunes parents', difficulty: 'moyen', description: 'Éducation positive et gestion du quotidien familial.', structure: ['Devenir parent : le choc', 'Les premiers mois', 'Sommeil de bébé', 'Alimentation', 'Éducation positive', 'Les crises et colères', 'L\'autonomie', 'Vie de couple et parentalité', 'Écrans et numérique', 'L\'école et les apprentissages', 'Adolescence', 'Le parent que je veux être'], prompts: ['Pas de culpabilisation', 'Anecdotes personnelles encouragées', 'Solutions concrètes applicables dès ce soir'] },
  { id: 'scifi-1', name: 'Science-Fiction', category: 'Fiction', emoji: '🚀', chapters: 18, wordTarget: 55000, tone: 'Immersif et visionnaire', audience: 'Fans de SF', difficulty: 'avancé', description: 'Worldbuilding complet avec enjeux technologiques et humains.', structure: ['Le monde de demain', 'Le protagoniste dans son élément', 'L\'anomalie', 'La quête commence', 'Alliés et ennemis', 'Premier affrontement', 'Révélation sur le monde', 'Le point de non-retour', 'L\'ascension', 'Le climax', 'Le nouveau monde'], prompts: ['Worldbuilding cohérent sur 3 pages avant d\'écrire', 'La technologie doit servir l\'histoire, pas l\'inverse'] },
  { id: 'lowcontent-1', name: 'Low-Content (Journal/Planner)', category: 'Low-Content', emoji: '📓', chapters: 6, wordTarget: 5000, tone: 'Minimaliste et fonctionnel', audience: 'Utilisateurs de planners', difficulty: 'facile', description: 'Structure pour journals, trackers et planners KDP.', structure: ['Page d\'introduction motivante', 'Comment utiliser ce journal', 'Section quotidienne (templates)', 'Section hebdomadaire', 'Section mensuelle', 'Pages de réflexion et bilan'], prompts: ['Texte minimal, focus sur les templates visuels', 'Inclure des prompts de journaling', 'Penser à la mise en page KDP 6x9'] },
  { id: 'voyage-1', name: 'Guide de Voyage', category: 'Voyage', emoji: '✈️', chapters: 10, wordTarget: 25000, tone: 'Enthousiaste et pratique', audience: 'Voyageurs', difficulty: 'moyen', description: 'Guide complet d\'une destination avec itinéraires et bons plans.', structure: ['Pourquoi cette destination', 'Préparer son voyage', 'Itinéraire jour par jour', 'Hébergements', 'Gastronomie locale', 'Activités incontournables', 'Hors des sentiers battus', 'Budget et bons plans', 'Sécurité et santé', 'Ressources et contacts utiles'], prompts: ['Écrire comme un ami qui y est allé', 'Adresses précises et prix récents', 'Photos recommandées pour chaque lieu'] },
  { id: 'productivite-1', name: 'Productivité & Organisation', category: 'Dev Perso', emoji: '⚡', chapters: 8, wordTarget: 20000, tone: 'Énergique et structuré', audience: 'Professionnels débordés', difficulty: 'facile', description: 'Méthodes et systèmes pour doubler sa productivité.', structure: ['L\'audit de votre temps', 'La méthode des 3 priorités', 'Deep Work : le focus intense', 'Systèmes et automatisation', 'Énergie vs temps', 'Dire non sans culpabiliser', 'Outils et apps essentiels', 'Votre système personnalisé'], prompts: ['Résultats mesurables à chaque chapitre', 'Templates et checklists à copier', 'Méthode applicable en 5 minutes'] },
];

export const EbookNicheTemplates: React.FC<{ onApplyTemplate?: (template: BookTemplate) => void }> = ({ onApplyTemplate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['Tous', ...Array.from(new Set(templates.map(t => t.category)))];
  const filtered = templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Tous' || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const difficultyColor: Record<string, string> = { 'facile': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', 'moyen': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', 'avancé': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };

  const copyStructure = (t: BookTemplate) => {
    navigator.clipboard.writeText(t.structure.join('\n'));
    toast.success('Structure copiée !');
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Bibliothèque de Templates ({templates.length} modèles)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Templates pré-configurés par niche avec structure, ton, audience et prompts optimisés.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-9" />
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(c => (
              <Button key={c} variant={selectedCategory === c ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(c)} className="text-xs h-7">
                {c}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(t => (
          <Card key={t.id} className={`cursor-pointer transition-all hover:border-primary/40 ${expandedId === t.id ? 'ring-2 ring-primary/20' : ''}`} onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <CardTitle className="text-sm">{t.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{t.chapters} chapitres</Badge>
                <Badge variant="outline" className="text-[10px]">{(t.wordTarget / 1000).toFixed(0)}k mots</Badge>
                <Badge className={`text-[10px] ${difficultyColor[t.difficulty]}`}>{t.difficulty}</Badge>
                <Badge variant="outline" className="text-[10px]">{t.audience}</Badge>
              </div>

              {expandedId === t.id && (
                <div className="space-y-3 pt-2 border-t mt-2" onClick={e => e.stopPropagation()}>
                  <div>
                    <p className="text-xs font-medium mb-1">📋 Structure :</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {t.structure.map((s, i) => <li key={i} className="flex items-start gap-1"><CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">🎯 Ton : {t.tone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">💡 Conseils d'écriture :</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {t.prompts.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyStructure(t)}>
                      <Copy className="h-3 w-3 mr-1" /> Copier structure
                    </Button>
                    {onApplyTemplate && (
                      <Button size="sm" onClick={() => { onApplyTemplate(t); toast.success(`Template "${t.name}" appliqué !`); }}>
                        <Sparkles className="h-3 w-3 mr-1" /> Appliquer
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EbookNicheTemplates;
