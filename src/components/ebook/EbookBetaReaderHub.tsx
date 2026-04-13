import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Link, Copy, Star, MessageSquare, Plus, Trash2, BookOpen, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface BetaReader {
  id: string;
  name: string;
  email: string;
  invitedAt: string;
  status: 'invited' | 'reading' | 'completed';
  progress: number;
}

interface ChapterFeedback {
  id: string;
  chapterIndex: number;
  chapterTitle: string;
  readerName: string;
  rating: number;
  comment: string;
  category: 'positive' | 'issue' | 'suggestion';
  createdAt: string;
}

interface EbookBetaReaderHubProps {
  ebookTitle?: string;
  chapters?: any[];
}

export const EbookBetaReaderHub: React.FC<EbookBetaReaderHubProps> = ({
  ebookTitle = 'Mon Ebook',
  chapters = [],
}) => {
  const [readers, setReaders] = useState<BetaReader[]>([]);
  const [feedbacks, setFeedbacks] = useState<ChapterFeedback[]>([]);
  const [newReaderName, setNewReaderName] = useState('');
  const [newReaderEmail, setNewReaderEmail] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(4);
  const [newCategory, setNewCategory] = useState<'positive' | 'issue' | 'suggestion'>('positive');
  const [shareLink] = useState(`https://beta-reader.app/${Date.now().toString(36)}`);

  const addReader = () => {
    if (!newReaderName.trim()) { toast.error('Nom requis'); return; }
    const reader: BetaReader = {
      id: Date.now().toString(),
      name: newReaderName.trim(),
      email: newReaderEmail.trim(),
      invitedAt: new Date().toLocaleDateString('fr-FR'),
      status: 'invited',
      progress: 0,
    };
    setReaders(prev => [...prev, reader]);
    setNewReaderName('');
    setNewReaderEmail('');
    toast.success(`${reader.name} ajouté comme bêta-lecteur`);
  };

  const removeReader = (id: string) => {
    setReaders(prev => prev.filter(r => r.id !== id));
    toast.info('Bêta-lecteur retiré');
  };

  const addFeedback = () => {
    if (!newComment.trim()) { toast.error('Commentaire requis'); return; }
    const fb: ChapterFeedback = {
      id: Date.now().toString(),
      chapterIndex: selectedChapter,
      chapterTitle: chapters[selectedChapter]?.title || `Chapitre ${selectedChapter + 1}`,
      readerName: readers.length > 0 ? readers[0].name : 'Bêta-lecteur',
      rating: newRating,
      comment: newComment.trim(),
      category: newCategory,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };
    setFeedbacks(prev => [...prev, fb]);
    setNewComment('');
    toast.success('Annotation ajoutée');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Lien de relecture copié !');
  };

  // Stats
  const totalFeedbacks = feedbacks.length;
  const avgRating = totalFeedbacks > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / totalFeedbacks).toFixed(1) : '—';
  const issuesCount = feedbacks.filter(f => f.category === 'issue').length;
  const suggestionsCount = feedbacks.filter(f => f.category === 'suggestion').length;

  // Per-chapter stats
  const chapterStats = chapters.map((ch, i) => {
    const chFb = feedbacks.filter(f => f.chapterIndex === i);
    return {
      index: i,
      title: ch.title || `Chapitre ${i + 1}`,
      feedbackCount: chFb.length,
      avgRating: chFb.length > 0 ? (chFb.reduce((s, f) => s + f.rating, 0) / chFb.length).toFixed(1) : '—',
      issues: chFb.filter(f => f.category === 'issue').length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Hub Bêta-Lecteurs
          </CardTitle>
          <p className="text-muted-foreground">
            Partagez votre manuscrit, collectez des annotations et priorisez les retours
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
            <Link className="h-4 w-4 text-muted-foreground" />
            <code className="text-sm flex-1 truncate">{shareLink}</code>
            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1">
              <Copy className="h-3 w-3" /> Copier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Users className="h-5 w-5 mx-auto text-blue-500 mb-1" />
          <div className="text-2xl font-bold">{readers.length}</div>
          <div className="text-xs text-muted-foreground">Bêta-lecteurs</div>
        </Card>
        <Card className="text-center p-4">
          <MessageSquare className="h-5 w-5 mx-auto text-purple-500 mb-1" />
          <div className="text-2xl font-bold">{totalFeedbacks}</div>
          <div className="text-xs text-muted-foreground">Annotations</div>
        </Card>
        <Card className="text-center p-4">
          <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
          <div className="text-2xl font-bold">{avgRating}</div>
          <div className="text-xs text-muted-foreground">Note moyenne</div>
        </Card>
        <Card className="text-center p-4">
          <BarChart3 className="h-5 w-5 mx-auto text-red-500 mb-1" />
          <div className="text-2xl font-bold text-red-500">{issuesCount}</div>
          <div className="text-xs text-muted-foreground">Problèmes signalés</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beta Readers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👥 Bêta-Lecteurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={newReaderName} onChange={e => setNewReaderName(e.target.value)} placeholder="Nom" className="flex-1" />
              <Input value={newReaderEmail} onChange={e => setNewReaderEmail(e.target.value)} placeholder="Email (optionnel)" className="flex-1" />
              <Button onClick={addReader} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            {readers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Ajoutez vos premiers bêta-lecteurs</p>
            ) : (
              readers.map(reader => (
                <div key={reader.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {reader.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{reader.name}</div>
                    <div className="text-xs text-muted-foreground">Invité le {reader.invitedAt}</div>
                  </div>
                  <Badge variant={reader.status === 'completed' ? 'default' : reader.status === 'reading' ? 'secondary' : 'outline'}>
                    {reader.status === 'invited' ? '📩 Invité' : reader.status === 'reading' ? '📖 En lecture' : '✅ Terminé'}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => removeReader(reader.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Add Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💬 Ajouter une Annotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(parseInt(e.target.value))}
              className="w-full p-2 rounded-lg border bg-background text-sm"
            >
              {chapters.length > 0 ? chapters.map((ch: any, i: number) => (
                <option key={i} value={i}>{ch.title || `Chapitre ${i + 1}`}</option>
              )) : (
                <option value={0}>Chapitre 1</option>
              )}
            </select>
            <div className="flex gap-2">
              {(['positive', 'issue', 'suggestion'] as const).map(cat => (
                <Button
                  key={cat}
                  variant={newCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewCategory(cat)}
                >
                  {cat === 'positive' ? '👍 Positif' : cat === 'issue' ? '⚠️ Problème' : '💡 Suggestion'}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <Button key={n} variant="ghost" size="sm" onClick={() => setNewRating(n)} className={`p-1 ${n <= newRating ? 'text-yellow-500' : 'text-muted-foreground/30'}`}>
                  ★
                </Button>
              ))}
            </div>
            <Textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Commentaire détaillé..." rows={3} />
            <Button onClick={addFeedback} className="w-full gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
          </CardContent>
        </Card>
      </div>

      {/* Chapter Stats */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Retours par Chapitre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {chapterStats.map(stat => (
              <div key={stat.index} className="flex items-center gap-3 p-2 rounded border bg-muted/20">
                <span className="text-sm font-medium w-48 truncate">{stat.title}</span>
                <Badge variant="secondary" className="text-xs">{stat.feedbackCount} retours</Badge>
                <span className="text-sm text-yellow-500">{stat.avgRating} ⭐</span>
                {stat.issues > 0 && <Badge variant="destructive" className="text-xs">{stat.issues} ⚠️</Badge>}
                <Progress value={stat.feedbackCount > 0 ? Math.min(stat.feedbackCount * 20, 100) : 0} className="flex-1 h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Feedbacks */}
      {feedbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Toutes les Annotations ({feedbacks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedbacks.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(fb => (
              <div key={fb.id} className={`p-3 rounded-lg border ${fb.category === 'issue' ? 'border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20' : fb.category === 'suggestion' ? 'border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20' : 'border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={fb.category === 'issue' ? 'destructive' : fb.category === 'suggestion' ? 'secondary' : 'default'} className="text-xs">
                    {fb.category === 'positive' ? '👍' : fb.category === 'issue' ? '⚠️' : '💡'} {fb.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{fb.chapterTitle}</span>
                  <span className="text-xs text-yellow-500">{'★'.repeat(fb.rating)}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{fb.readerName} · {fb.createdAt}</span>
                </div>
                <p className="text-sm">{fb.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
