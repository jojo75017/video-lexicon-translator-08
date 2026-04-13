import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mail, 
  Star, 
  Send, 
  Download, 
  Copy, 
  Check,
  Plus,
  Trash2,
  BookOpen,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Gift,
  Link2,
  FileDown,
  ExternalLink,
  BookMarked,
  Smartphone,
  Search,
  Loader2,
  Target,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ArcLinkGenerator from './ArcLinkGenerator';

interface ArcReader {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'sent' | 'reading' | 'reviewed' | 'declined';
  sentDate?: string;
  reviewDate?: string;
  rating?: number;
  reviewText?: string;
}

interface EbookArcManagerProps {
  ebookTitle: string;
  authorName: string;
  bookSummary?: string;
  coverUrl?: string;
}

const EbookArcManager: React.FC<EbookArcManagerProps> = ({
  ebookTitle,
  authorName,
  bookSummary = '',
  coverUrl
}) => {
  const [readers, setReaders] = useState<ArcReader[]>([]);
  const [newReaderName, setNewReaderName] = useState('');
  const [newReaderEmail, setNewReaderEmail] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  
  // Title Analysis state
  const [titleToAnalyze, setTitleToAnalyze] = useState('');
  const [isAnalyzingTitle, setIsAnalyzingTitle] = useState(false);
  const [titleAnalysis, setTitleAnalysis] = useState<{
    score: number;
    marketPotential: string;
    kdpOptimization: string;
    emotionalImpact: string;
    suggestions: string[];
    keywords: string[];
    competitorTitles: string[];
  } | null>(null);
  const [reviewRequestTemplate, setReviewRequestTemplate] = useState('');
  const [copied, setCopied] = useState(false);

  // Générer les templates par défaut
  useEffect(() => {
    setEmailTemplate(`Bonjour {nom},

J'ai le plaisir de vous offrir une copie avancée gratuite de mon nouveau livre "${ebookTitle}" en avant-première !

En tant que lecteur ARC (Advance Review Copy), vous recevrez le livre complet avant sa publication officielle. En échange, je vous serais reconnaissant(e) de bien vouloir laisser un avis honnête sur Amazon après la date de sortie.

📖 À propos du livre:
${bookSummary || '[Ajoutez un résumé de votre livre ici]'}

Cliquez sur le lien ci-dessous pour télécharger votre copie gratuite:
[LIEN DE TÉLÉCHARGEMENT]

Merci pour votre soutien !

Cordialement,
${authorName}`);

    setReviewRequestTemplate(`Bonjour {nom},

J'espère que vous avez apprécié la lecture de "${ebookTitle}" !

Le livre vient d'être publié sur Amazon et vos premiers avis seraient d'une aide précieuse pour son lancement.

Si vous avez aimé le livre, pourriez-vous prendre quelques minutes pour laisser un avis sur Amazon ?

Lien direct: [LIEN AMAZON]

Votre avis compte énormément et aide d'autres lecteurs à découvrir ce livre.

Merci infiniment !

${authorName}`);
  }, [ebookTitle, authorName, bookSummary]);

  const addReader = () => {
    if (!newReaderName.trim() || !newReaderEmail.trim()) {
      toast.error('Veuillez remplir le nom et l\'email');
      return;
    }

    if (!newReaderEmail.includes('@')) {
      toast.error('Email invalide');
      return;
    }

    const newReader: ArcReader = {
      id: Date.now().toString(),
      name: newReaderName.trim(),
      email: newReaderEmail.trim(),
      status: 'pending'
    };

    setReaders([...readers, newReader]);
    setNewReaderName('');
    setNewReaderEmail('');
    toast.success('Lecteur ARC ajouté');
  };

  const removeReader = (id: string) => {
    setReaders(readers.filter(r => r.id !== id));
    toast.info('Lecteur supprimé');
  };

  const updateReaderStatus = (id: string, status: ArcReader['status']) => {
    setReaders(readers.map(r => {
      if (r.id === id) {
        const update: Partial<ArcReader> = { status };
        if (status === 'sent') update.sentDate = new Date().toISOString();
        if (status === 'reviewed') update.reviewDate = new Date().toISOString();
        return { ...r, ...update };
      }
      return r;
    }));
  };

  const getPersonalizedEmail = (reader: ArcReader, template: string): string => {
    return template.replace(/{nom}/g, reader.name);
  };

  const copyEmail = async (reader: ArcReader, template: string) => {
    await navigator.clipboard.writeText(getPersonalizedEmail(reader, template));
    setCopied(true);
    toast.success('Email copié dans le presse-papiers');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReadersList = () => {
    const csv = [
      ['Nom', 'Email', 'Statut', 'Date envoi', 'Date avis', 'Note'].join(','),
      ...readers.map(r => [
        r.name,
        r.email,
        r.status,
        r.sentDate || '',
        r.reviewDate || '',
        r.rating || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arc-readers-${ebookTitle.replace(/\s+/g, '-')}.csv`;
    a.click();
    toast.success('Liste exportée en CSV');
  };

  const getStatusIcon = (status: ArcReader['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'reading': return <BookOpen className="h-4 w-4 text-amber-500" />;
      case 'reviewed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: ArcReader['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'sent': return 'Envoyé';
      case 'reading': return 'En lecture';
      case 'reviewed': return 'Avis reçu';
      case 'declined': return 'Refusé';
    }
  };

  const stats = {
    total: readers.length,
    sent: readers.filter(r => ['sent', 'reading', 'reviewed'].includes(r.status)).length,
    reviewed: readers.filter(r => r.status === 'reviewed').length,
    conversionRate: readers.length > 0 
      ? Math.round((readers.filter(r => r.status === 'reviewed').length / readers.length) * 100) 
      : 0
  };

  const analyzeTitleWithAI = async () => {
    if (!titleToAnalyze.trim()) {
      toast.error('Veuillez entrer un titre à analyser');
      return;
    }

    setIsAnalyzingTitle(true);
    setTitleAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-book-title', {
        body: { title: titleToAnalyze.trim() }
      });

      if (error) throw error;

      setTitleAnalysis(data.analysis);
      toast.success('Analyse terminée !');
    } catch (error) {
      console.error('Erreur analyse titre:', error);
      toast.error('Analyse du titre impossible — vérifiez votre connexion et réessayez.');
    } finally {
      setIsAnalyzingTitle(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <Card className="border-2 border-dashed border-amber-200 dark:border-amber-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Gestionnaire ARC
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  2026
                </Badge>
              </CardTitle>
              <CardDescription>
                Gérez vos lecteurs de copies avancées et collectez des avis
              </CardDescription>
            </div>
          </div>
          {readers.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportReadersList}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="readers" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="readers">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Lecteurs</span> ({readers.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              <Link2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Formulaire</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="relative">
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Distribution</span>
              <Badge className="absolute -top-1 -right-1 text-[10px] px-1 py-0 bg-amber-500 text-white">2026</Badge>
            </TabsTrigger>
            <TabsTrigger value="title-analysis" className="relative">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analyse Titres</span>
              <Badge className="absolute -top-1 -right-1 text-[10px] px-1 py-0 bg-purple-500 text-white">2026</Badge>
            </TabsTrigger>
            <TabsTrigger value="email-arc">
              <Gift className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Email ARC</span>
            </TabsTrigger>
            <TabsTrigger value="email-review">
              <Star className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Demande</span>
            </TabsTrigger>
            <TabsTrigger value="resources">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ressources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="readers" className="space-y-4">
            {/* Statistiques */}
            {readers.length > 0 && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4 bg-muted/50">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Lecteurs ARC</div>
                </Card>
                <Card className="p-4 bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
                  <div className="text-sm text-muted-foreground">Copies envoyées</div>
                </Card>
                <Card className="p-4 bg-green-50 dark:bg-green-950/30">
                  <div className="text-2xl font-bold text-green-600">{stats.reviewed}</div>
                  <div className="text-sm text-muted-foreground">Avis reçus</div>
                </Card>
                <Card className="p-4 bg-amber-50 dark:bg-amber-950/30">
                  <div className="text-2xl font-bold text-amber-600">{stats.conversionRate}%</div>
                  <div className="text-sm text-muted-foreground">Taux de conversion</div>
                </Card>
              </div>
            )}

            {/* Formulaire d'ajout */}
            <div className="flex gap-2">
              <Input
                placeholder="Nom du lecteur"
                value={newReaderName}
                onChange={(e) => setNewReaderName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Email"
                type="email"
                value={newReaderEmail}
                onChange={(e) => setNewReaderEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addReader}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>

            {/* Liste des lecteurs */}
            {readers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun lecteur ARC pour le moment</p>
                <p className="text-sm">Ajoutez des lecteurs pour commencer à collecter des avis</p>
              </div>
            ) : (
              <div className="space-y-2">
                {readers.map((reader) => (
                  <div 
                    key={reader.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(reader.status)}
                      <div>
                        <div className="font-medium">{reader.name}</div>
                        <div className="text-sm text-muted-foreground">{reader.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStatusLabel(reader.status)}</Badge>
                      <select 
                        value={reader.status}
                        onChange={(e) => updateReaderStatus(reader.id, e.target.value as ArcReader['status'])}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">En attente</option>
                        <option value="sent">Envoyé</option>
                        <option value="reading">En lecture</option>
                        <option value="reviewed">Avis reçu</option>
                        <option value="declined">Refusé</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyEmail(reader, emailTemplate)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeReader(reader.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            <ArcLinkGenerator 
              ebookTitle={ebookTitle}
              authorName={authorName}
              genre=""
            />
          </TabsContent>

          <TabsContent value="title-analysis" className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Analyser un Titre de Livre
              </h4>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez un titre à analyser..."
                  value={titleToAnalyze}
                  onChange={(e) => setTitleToAnalyze(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeTitleWithAI()}
                />
                <Button 
                  onClick={analyzeTitleWithAI} 
                  disabled={isAnalyzingTitle || !titleToAnalyze.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzingTitle ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyser
                    </>
                  )}
                </Button>
              </div>

              {/* Pre-fill with current book title if available */}
              {ebookTitle && !titleToAnalyze && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTitleToAnalyze(ebookTitle)}
                >
                  Utiliser le titre actuel : "{ebookTitle}"
                </Button>
              )}
            </div>

            {titleAnalysis && (
              <div className="space-y-4">
                {/* Score global */}
                <Card className={`p-4 ${getScoreBgColor(titleAnalysis.score)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-primary" />
                      <div>
                        <h5 className="font-semibold">Score Global KDP</h5>
                        <p className="text-sm text-muted-foreground">Potentiel de vente estimé</p>
                      </div>
                    </div>
                    <div className={`text-4xl font-bold ${getScoreColor(titleAnalysis.score)}`}>
                      {titleAnalysis.score}/100
                    </div>
                  </div>
                </Card>

                {/* Analyses détaillées */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <h5 className="font-semibold">Potentiel Marché</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">{titleAnalysis.marketPotential}</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-5 w-5 text-green-500" />
                      <h5 className="font-semibold">Optimisation KDP</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">{titleAnalysis.kdpOptimization}</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      <h5 className="font-semibold">Impact Émotionnel</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">{titleAnalysis.emotionalImpact}</p>
                  </Card>
                </div>

                {/* Suggestions de titres */}
                <Card className="p-4">
                  <h5 className="font-semibold flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Suggestions de Titres Alternatifs
                  </h5>
                  <div className="space-y-2">
                    {titleAnalysis.suggestions.map((suggestion, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-sm">{suggestion}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(suggestion);
                            toast.success('Titre copié !');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Mots-clés et concurrents */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Mots-clés Recommandés</h5>
                    <div className="flex flex-wrap gap-2">
                      {titleAnalysis.keywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Titres Concurrents</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {titleAnalysis.competitorTitles.map((title, i) => (
                        <li key={i}>• {title}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <h5 className="font-semibold flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-400">
                <Lightbulb className="h-4 w-4" />
                Conseils pour un bon titre KDP
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Court et percutant</strong> - 2-5 mots maximum pour le titre principal</li>
                <li>• <strong>Sous-titre descriptif</strong> - Ajoutez les mots-clés et bénéfices</li>
                <li>• <strong>Évitez les termes génériques</strong> - "Guide", "Manuel" seuls ne suffisent pas</li>
                <li>• <strong>Utilisez des chiffres</strong> - "7 Secrets", "30 Jours" attirent l'attention</li>
                <li>• <strong>Promesse claire</strong> - Le lecteur doit savoir ce qu'il va obtenir</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            {/* Guide des formats */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <FileDown className="h-4 w-4 text-primary" />
                Formats à envoyer à vos lecteurs ARC
              </h4>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500 text-white">
                      <BookMarked className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-green-700 dark:text-green-400">EPUB</h5>
                      <Badge variant="secondary" className="text-xs">Recommandé</Badge>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Standard universel</li>
                    <li>✓ Kobo, Apple Books, Google</li>
                    <li>✓ Ajustable (taille police)</li>
                    <li>✓ Léger et fluide</li>
                  </ul>
                </Card>

                <Card className="p-4 border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500 text-white">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-700 dark:text-amber-400">MOBI / KPF</h5>
                      <Badge variant="secondary" className="text-xs">Kindle</Badge>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Liseuses Kindle</li>
                    <li>✓ App Kindle mobile</li>
                    <li>✓ Envoi par email @kindle.com</li>
                    <li>⚠ Format Amazon uniquement</li>
                  </ul>
                </Card>

                <Card className="p-4 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-blue-700 dark:text-blue-400">PDF</h5>
                      <Badge variant="secondary" className="text-xs">Universel</Badge>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Mise en page fixe</li>
                    <li>✓ Tous les appareils</li>
                    <li>✓ Idéal pour impression</li>
                    <li>⚠ Moins confortable sur liseuse</li>
                  </ul>
                </Card>
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <strong>💡 Conseil :</strong> Proposez EPUB + PDF pour couvrir tous les besoins. 
                  Ajoutez MOBI si vous avez des lecteurs Kindle.
                </p>
              </div>
            </div>

            {/* BookFunnel */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" />
                Distribution avec BookFunnel (Recommandé)
              </h4>

              <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📚</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-lg mb-2">BookFunnel</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Service professionnel de distribution d'ebooks. Version gratuite disponible pour les auteurs indépendants.
                    </p>
                    <div className="grid gap-2 md:grid-cols-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Détection automatique de l'appareil</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Conversion EPUB → MOBI automatique</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Support lecteur intégré</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Collecte d'emails automatique</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Statistiques de téléchargement</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Lien unique à partager</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.open('https://bookfunnel.com/', '_blank')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visiter BookFunnel
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="p-4 rounded-lg bg-muted/50">
                <h5 className="font-medium mb-3">📋 Comment utiliser BookFunnel :</h5>
                <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Créez un compte gratuit sur BookFunnel</li>
                  <li>Uploadez votre fichier EPUB (il sera converti automatiquement)</li>
                  <li>Créez une "landing page" pour votre livre</li>
                  <li>Obtenez un lien unique à partager avec vos lecteurs ARC</li>
                  <li>BookFunnel gère le téléchargement et le support technique</li>
                </ol>
              </div>
            </div>

            {/* Alternatives manuelles */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Alternatives manuelles
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h5 className="font-medium mb-2">☁️ Cloud Storage</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Uploadez vos fichiers sur Google Drive, Dropbox ou OneDrive et partagez le lien.
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Gratuit</li>
                    <li>✓ Simple à mettre en place</li>
                    <li>⚠ Pas de statistiques</li>
                    <li>⚠ Support technique à votre charge</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium mb-2">📧 Envoi direct par email</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Attachez les fichiers directement à vos emails (attention à la taille).
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Personnel et direct</li>
                    <li>✓ Aucun intermédiaire</li>
                    <li>⚠ Limite de taille (~25MB)</li>
                    <li>⚠ Fastidieux si nombreux lecteurs</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium mb-2">📱 Envoi Kindle direct</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Envoyez le MOBI à l'adresse @kindle.com du lecteur.
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Arrive directement sur Kindle</li>
                    <li>✓ Synchronisation automatique</li>
                    <li>⚠ Uniquement pour Kindle</li>
                    <li>⚠ Le lecteur doit autoriser votre email</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium mb-2">🔗 StoryOrigin</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Alternative à BookFunnel avec fonctionnalités similaires.
                  </p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('https://storyoriginapp.com/', '_blank')}
                  >
                    Visiter →
                  </Button>
                </Card>
              </div>
            </div>

            {/* Checklist export */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Checklist avant distribution
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Fichier EPUB validé (pas d'erreurs)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>PDF mis en page correctement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Couverture incluse dans les fichiers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Mention "Copie ARC - Ne pas distribuer"</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Table des matières fonctionnelle</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Date de sortie prévue indiquée</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email-arc" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Gift className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <strong>Email d'invitation ARC</strong>
                <p className="text-muted-foreground mt-1">
                  Ce template sera utilisé pour inviter les lecteurs à recevoir une copie gratuite.
                  Utilisez {'{nom}'} pour personnaliser automatiquement.
                </p>
              </div>
            </div>
            <Textarea
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(emailTemplate);
                toast.success('Template copié');
              }}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier le template
            </Button>
          </TabsContent>

          <TabsContent value="email-review" className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Star className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <strong>Email de demande d'avis</strong>
                <p className="text-muted-foreground mt-1">
                  Envoyez ce message après la publication pour rappeler aux lecteurs de laisser un avis.
                </p>
              </div>
            </div>
            <Textarea
              value={reviewRequestTemplate}
              onChange={(e) => setReviewRequestTemplate(e.target.value)}
              className="min-h-[250px] font-mono text-sm"
            />
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(reviewRequestTemplate);
                toast.success('Template copié');
              }}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier le template
            </Button>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {/* Où trouver des lecteurs ARC */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Où trouver des lecteurs ARC français
              </h4>
              
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <h5 className="font-medium">Babelio - Masse Critique</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Programme officiel de lecture anticipée avec +1M de lecteurs
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open('https://www.babelio.com/massecritique/', '_blank')}
                      >
                        Visiter →
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h5 className="font-medium">Groupes Facebook</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Lecteurs Bêta Francophones", "Auteurs Indépendants"
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open('https://www.facebook.com/search/groups?q=lecteurs%20beta%20francais', '_blank')}
                      >
                        Rechercher →
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📖</div>
                    <div>
                      <h5 className="font-medium">Livraddict</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Forum avec section bêta-lecture et partenariats
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open('https://www.livraddict.com/', '_blank')}
                      >
                        Visiter →
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⭐</div>
                    <div>
                      <h5 className="font-medium">Booknode</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Communauté de lecteurs passionnés avec système de partenariats
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open('https://booknode.com/', '_blank')}
                      >
                        Visiter →
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Template de recrutement */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Annonce de recrutement ARC
              </h4>
              
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm whitespace-pre-wrap">
{`🎁 RECHERCHE LECTEURS ARC - "${ebookTitle}"

Bonjour à tous ! 

Je recherche des lecteurs passionnés pour recevoir une copie GRATUITE de mon nouveau livre "${ebookTitle}" en avant-première !

📖 À PROPOS DU LIVRE:
${bookSummary || '[Votre résumé ici]'}

✨ CE QUE VOUS RECEVEZ:
• Le livre complet en PDF/EPUB
• Accès 2 semaines avant la sortie officielle
• Mention dans les remerciements (optionnel)

🤝 CE QUE JE DEMANDE:
• Lire le livre avant la date de sortie
• Laisser un avis HONNÊTE sur Amazon après publication
• (Pas besoin d'avis positif, juste sincère !)

📧 COMMENT PARTICIPER:
Envoyez-moi un message privé avec:
1. Votre email
2. Votre format préféré (PDF/EPUB/MOBI)
3. Pourquoi ce livre vous intéresse

⏰ PLACES LIMITÉES: 20 lecteurs seulement !

Merci d'avance ! 🙏
${authorName}`}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    const text = `🎁 RECHERCHE LECTEURS ARC - "${ebookTitle}"

Bonjour à tous ! 

Je recherche des lecteurs passionnés pour recevoir une copie GRATUITE de mon nouveau livre "${ebookTitle}" en avant-première !

📖 À PROPOS DU LIVRE:
${bookSummary || '[Votre résumé ici]'}

✨ CE QUE VOUS RECEVEZ:
• Le livre complet en PDF/EPUB
• Accès 2 semaines avant la sortie officielle
• Mention dans les remerciements (optionnel)

🤝 CE QUE JE DEMANDE:
• Lire le livre avant la date de sortie
• Laisser un avis HONNÊTE sur Amazon après publication
• (Pas besoin d'avis positif, juste sincère !)

📧 COMMENT PARTICIPER:
Envoyez-moi un message privé avec:
1. Votre email
2. Votre format préféré (PDF/EPUB/MOBI)
3. Pourquoi ce livre vous intéresse

⏰ PLACES LIMITÉES: 20 lecteurs seulement !

Merci d'avance ! 🙏
${authorName}`;
                    navigator.clipboard.writeText(text);
                    toast.success('Annonce copiée !');
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier l'annonce Facebook/Forum
                </Button>
              </div>
            </div>

            {/* Conseils pro */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-600" />
                Conseils pro pour recruter des lecteurs ARC
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Ciblez votre genre</strong> - Postez dans des groupes spécialisés (romance, thriller, SF...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Proposez plusieurs formats</strong> - PDF, EPUB et MOBI pour toucher plus de lecteurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Limitez les places</strong> - La rareté motive les inscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Utilisez BookFunnel</strong> - Service gratuit pour distribuer vos copies ARC facilement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Constituez une liste email</strong> - Vos lecteurs ARC deviendront vos fans fidèles</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Conseils */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            Conseils pour les ARC
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Visez 10-30 lecteurs ARC pour un lancement réussi</li>
            <li>• Envoyez les copies 2-4 semaines avant la publication</li>
            <li>• Rappelez poliment après la date de sortie</li>
            <li>• Ne demandez JAMAIS de "bons" avis (violation des TOS Amazon)</li>
            <li>• Utilisez BookFunnel ou StoryOrigin pour distribuer les copies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EbookArcManager;
