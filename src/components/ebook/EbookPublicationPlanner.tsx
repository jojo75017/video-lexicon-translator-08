import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Trash2, BookOpen, Rocket, Clock, CheckCircle2, Target, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface BookProject {
  id: string;
  title: string;
  niche: string;
  status: 'idea' | 'planning' | 'writing' | 'editing' | 'publishing' | 'published';
  targetDate: string;
  wordTarget: number;
  currentWords: number;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

const nicheTemplates = [
  { id: 'dev-perso', label: '🧠 Développement Personnel', chapters: 12, wordsPerChapter: 2500, suggestions: ['Confiance en soi', 'Productivité', 'Habitudes', 'Mindset'] },
  { id: 'business', label: '💼 Business / Entrepreneuriat', chapters: 10, wordsPerChapter: 3000, suggestions: ['Freelance', 'E-commerce', 'Side hustle', 'Marketing'] },
  { id: 'cuisine', label: '🍳 Cuisine / Recettes', chapters: 15, wordsPerChapter: 1500, suggestions: ['Meal prep', 'Vegan', 'Batch cooking', 'Desserts'] },
  { id: 'romance', label: '💕 Romance', chapters: 20, wordsPerChapter: 3000, suggestions: ['Contemporary', 'Historical', 'Paranormal', 'Dark'] },
  { id: 'thriller', label: '🔪 Thriller / Policier', chapters: 25, wordsPerChapter: 2500, suggestions: ['Psychologique', 'Espionnage', 'Serial killer', 'Conspiration'] },
  { id: 'fantasy', label: '⚔️ Fantasy / SF', chapters: 22, wordsPerChapter: 3500, suggestions: ['Epic', 'Urban', 'Dystopie', 'Space opera'] },
  { id: 'sante', label: '🏋️ Santé / Fitness', chapters: 10, wordsPerChapter: 2000, suggestions: ['Perte de poids', 'Musculation', 'Yoga', 'Nutrition'] },
  { id: 'finance', label: '💰 Finance Personnelle', chapters: 12, wordsPerChapter: 2500, suggestions: ['Investissement', 'Crypto', 'Immobilier', 'Épargne'] },
  { id: 'enfants', label: '👶 Livres Enfants', chapters: 8, wordsPerChapter: 500, suggestions: ['Album illustré', 'Conte', 'Éducatif', 'Coloriage'] },
  { id: 'voyage', label: '✈️ Voyage / Guide', chapters: 15, wordsPerChapter: 2000, suggestions: ['City guide', 'Road trip', 'Budget', 'Nomade digital'] },
];

const statusColors: Record<string, string> = {
  idea: 'bg-muted text-muted-foreground',
  planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  writing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  editing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  publishing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels: Record<string, string> = {
  idea: '💡 Idée', planning: '📋 Planification', writing: '✍️ Rédaction',
  editing: '🔄 Édition', publishing: '📤 Publication', published: '✅ Publié',
};

export const EbookPublicationPlanner: React.FC = () => {
  const [projects, setProjects] = useState<BookProject[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('');

  const addProject = (fromTemplate?: typeof nicheTemplates[0]) => {
    const newProject: BookProject = {
      id: `proj-${Date.now()}`,
      title: fromTemplate ? `Nouveau livre ${fromTemplate.label}` : 'Nouveau projet',
      niche: fromTemplate?.id || '',
      status: 'idea',
      targetDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      wordTarget: fromTemplate ? fromTemplate.chapters * fromTemplate.wordsPerChapter : 25000,
      currentWords: 0,
      notes: '',
      priority: 'medium',
    };
    setProjects(prev => [...prev, newProject]);
    toast.success('Projet ajouté !');
  };

  const updateProject = (id: string, field: keyof BookProject, value: any) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Projet supprimé');
  };

  const publishedCount = projects.filter(p => p.status === 'published').length;
  const totalTarget = projects.reduce((a, p) => a + p.wordTarget, 0);
  const totalWritten = projects.reduce((a, p) => a + p.currentWords, 0);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10"><Calendar className="h-6 w-6 text-primary" /></div>
            Planificateur de Publication
            <Badge className="bg-primary/10 text-primary border-primary/30">ÉDITORIAL</Badge>
          </CardTitle>
          <CardDescription>Gérez votre pipeline de livres : idées, rédaction, publication avec templates par niche</CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{projects.length}</div><div className="text-xs text-muted-foreground">Projets</div></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{publishedCount}</div><div className="text-xs text-muted-foreground">Publiés</div></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{(totalWritten / 1000).toFixed(0)}k</div><div className="text-xs text-muted-foreground">Mots écrits</div></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{totalTarget > 0 ? Math.round(totalWritten / totalTarget * 100) : 0}%</div><div className="text-xs text-muted-foreground">Progression</div></CardContent></Card>
      </div>

      {/* Quick add from template */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-lg">📚 Templates par Niche</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {nicheTemplates.map(t => (
              <Button key={t.id} variant="outline" size="sm" className="justify-start text-xs h-auto py-2" onClick={() => addProject(t)}>
                {t.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Vos projets ({projects.length})</h3>
          <Button onClick={() => addProject()} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Projet vierge</Button>
        </div>

        {projects.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <Rocket className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucun projet. Choisissez un template ou créez un projet vierge.</p>
          </CardContent></Card>
        ) : (
          projects.map(proj => (
            <Card key={proj.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3 items-center">
                      <Input value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} className="font-semibold" />
                      <Badge className={statusColors[proj.status]}>{statusLabels[proj.status]}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Select value={proj.status} onValueChange={v => updateProject(proj.id, 'status', v)}>
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={proj.priority} onValueChange={v => updateProject(proj.id, 'priority', v)}>
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">🟢 Basse</SelectItem>
                          <SelectItem value="medium">🟡 Moyenne</SelectItem>
                          <SelectItem value="high">🔴 Haute</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="date" value={proj.targetDate} onChange={e => updateProject(proj.id, 'targetDate', e.target.value)} className="text-xs" />
                      <div className="flex gap-1 items-center">
                        <Input type="number" value={proj.currentWords} onChange={e => updateProject(proj.id, 'currentWords', parseInt(e.target.value) || 0)} className="text-xs w-20" />
                        <span className="text-xs text-muted-foreground">/ {(proj.wordTarget / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, proj.wordTarget > 0 ? (proj.currentWords / proj.wordTarget) * 100 : 0)}%` }} />
                      </div>
                      <span className="text-xs font-mono">{proj.wordTarget > 0 ? Math.round(proj.currentWords / proj.wordTarget * 100) : 0}%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EbookPublicationPlanner;
