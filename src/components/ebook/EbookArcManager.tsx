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
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readers">
              <Users className="h-4 w-4 mr-2" />
              Lecteurs ({readers.length})
            </TabsTrigger>
            <TabsTrigger value="email-arc">
              <Gift className="h-4 w-4 mr-2" />
              Email ARC
            </TabsTrigger>
            <TabsTrigger value="email-review">
              <Star className="h-4 w-4 mr-2" />
              Demande d'avis
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
