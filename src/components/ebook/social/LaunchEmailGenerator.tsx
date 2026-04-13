import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Copy, Loader2, Sparkles, Mail, RefreshCw, Download, 
  Pencil, Check, ChevronDown, ChevronUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EMAIL_PHASES = [
  { id: 'teaser-j7', label: 'Teaser J-7', emoji: '🔮', description: 'Créer la curiosité une semaine avant' },
  { id: 'teaser-j3', label: 'Teaser J-3', emoji: '⏳', description: 'Compte à rebours et anticipation' },
  { id: 'launch-j0', label: 'Lancement J0', emoji: '🚀', description: 'Annonce officielle avec lien d\'achat' },
  { id: 'reminder-j1', label: 'Rappel J+1', emoji: '🔔', description: 'Relance pour ceux qui n\'ont pas acheté' },
  { id: 'social-proof-j3', label: 'Preuve sociale J+3', emoji: '⭐', description: 'Partager les premiers retours' },
  { id: 'last-chance-j7', label: 'Dernière chance J+7', emoji: '🎁', description: 'Urgence et offre spéciale' },
];

interface GeneratedEmail {
  phaseId: string;
  subject: string;
  preview: string;
  body: string;
}

interface LaunchEmailGeneratorProps {
  ebookTitle?: string;
  authorName?: string;
  amazonLink?: string;
}

const LaunchEmailGenerator: React.FC<LaunchEmailGeneratorProps> = ({
  ebookTitle = '',
  authorName = '',
  amazonLink = '',
}) => {
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(authorName);
  const [link, setLink] = useState(amazonLink);
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) { toast.error('Titre du livre requis'); return; }
    setIsGenerating(true);
    
    try {
      const prompt = `Tu es un expert en email marketing pour auteurs. Génère une séquence de 6 emails de lancement pour le livre "${title}"${author ? ` par ${author}` : ''}${link ? ` (lien: ${link})` : ''}.

Les 6 emails correspondent aux phases:
${EMAIL_PHASES.map(p => `- ${p.label}: ${p.description}`).join('\n')}

Pour CHAQUE email, fournis:
- Un objet/sujet accrocheur (max 60 caractères)
- Un texte de preview (max 90 caractères)  
- Le corps de l'email (300-500 mots, ton conversationnel et engageant)

CONTRAINTES:
- Écrire en français
- Inclure un appel à l'action clair dans chaque email
- Personnaliser avec {{PRENOM}} comme variable
- NE PAS utiliser de markdown
- Ton chaleureux et authentique, pas commercial agressif

Réponds en JSON strict:
{
  "emails": [
    {
      "phaseId": "teaser-j7",
      "subject": "objet de l'email",
      "preview": "texte de preview",
      "body": "corps complet de l'email"
    }
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'launch-email-sequence', prompt, maxOutputTokens: 6000, temperature: 0.8 },
      });
      if (error) throw error;

      const text = data?.content || data?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.emails) {
          setEmails(parsed.emails);
          setExpandedEmail(0);
          toast.success(`${parsed.emails.length} emails générés !`);
        }
      }
    } catch (err) {
      console.error('Erreur génération emails:', err);
      toast.error('Erreur lors de la génération');
    } finally { setIsGenerating(false); }
  };

  const copyEmail = (email: GeneratedEmail) => {
    const text = `Objet: ${email.subject}\nPreview: ${email.preview}\n\n${email.body}`;
    navigator.clipboard.writeText(text);
    toast.success('Email copié !');
  };

  const copyAll = () => {
    const text = emails.map((email, i) => {
      const phase = EMAIL_PHASES.find(p => p.id === email.phaseId) || EMAIL_PHASES[i];
      return `═══ ${phase?.label?.toUpperCase()} ═══\n\nObjet: ${email.subject}\nPreview: ${email.preview}\n\n${email.body}`;
    }).join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Tous les emails copiés !');
  };

  const exportAsText = () => {
    const text = emails.map((email, i) => {
      const phase = EMAIL_PHASES.find(p => p.id === email.phaseId) || EMAIL_PHASES[i];
      return `═══ ${phase?.label?.toUpperCase()} ═══\n\nObjet: ${email.subject}\nPreview: ${email.preview}\n\n${email.body}`;
    }).join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    const blob = new Blob([`📧 Séquence d'emails de lancement — ${title}\n\n${text}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `emails-lancement-${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('Fichier exporté');
  };

  const updateEmail = (index: number, field: keyof GeneratedEmail, value: string) => {
    setEmails(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-6">
      {/* Config */}
      <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Séquence d'Emails de Lancement
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">IA Pro</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                6 emails stratégiques pour maximiser vos ventes au lancement
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titre du livre *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon livre incroyable" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Auteur</label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Votre nom" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Lien Amazon</label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://amazon.fr/dp/..." />
            </div>
          </div>

          {/* Phase overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {EMAIL_PHASES.map((phase) => (
              <div key={phase.id} className="p-2 rounded-lg bg-background/30 border border-border/30 text-center">
                <span className="text-lg">{phase.emoji}</span>
                <p className="text-xs font-medium mt-1">{phase.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim()}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Générer la séquence complète
        </Button>
        {emails.length > 0 && (
          <>
            <Button variant="outline" onClick={copyAll}>
              <Copy className="h-4 w-4 mr-2" /> Copier tout
            </Button>
            <Button variant="outline" onClick={exportAsText}>
              <Download className="h-4 w-4 mr-2" /> Exporter .txt
            </Button>
          </>
        )}
      </div>

      {/* Skeleton loader */}
      {isGenerating && emails.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted" />
                    <div className="h-4 w-48 rounded bg-muted" />
                  </div>
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Generated emails */}
      <AnimatePresence>
        {emails.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {emails.map((email, index) => {
              const phase = EMAIL_PHASES.find(p => p.id === email.phaseId) || EMAIL_PHASES[index];
              const isExpanded = expandedEmail === index;
              const isEdit = editingIndex === index;

              return (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className={cn(
                    "bg-card/50 border-border/50 transition-all",
                    isExpanded && "border-primary/20"
                  )}>
                    <CardContent className="p-0">
                      {/* Email header - clickable */}
                      <button 
                        onClick={() => setExpandedEmail(isExpanded ? null : index)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{phase?.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{phase?.label}</span>
                              <Badge variant="outline" className="text-xs">{email.subject.length} car.</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              Objet: {email.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={e => { e.stopPropagation(); copyEmail(email); }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                              {/* Subject */}
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Objet</label>
                                {isEdit ? (
                                  <Input value={email.subject} onChange={e => updateEmail(index, 'subject', e.target.value)} className="text-sm" />
                                ) : (
                                  <p className="text-sm font-medium bg-background/50 p-2 rounded border border-border/30">{email.subject}</p>
                                )}
                              </div>

                              {/* Preview */}
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Texte de preview</label>
                                {isEdit ? (
                                  <Input value={email.preview} onChange={e => updateEmail(index, 'preview', e.target.value)} className="text-sm" />
                                ) : (
                                  <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border/30">{email.preview}</p>
                                )}
                              </div>

                              {/* Body */}
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Corps de l'email</label>
                                {isEdit ? (
                                  <Textarea 
                                    value={email.body} 
                                    onChange={e => updateEmail(index, 'body', e.target.value)} 
                                    className="min-h-[200px] text-sm leading-relaxed" 
                                  />
                                ) : (
                                  <div className="p-3 rounded-lg bg-background/50 border border-border/30 whitespace-pre-wrap text-sm leading-relaxed max-h-[300px] overflow-y-auto">
                                    {email.body}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-1">
                                <Button size="sm" variant="outline" onClick={() => setEditingIndex(isEdit ? null : index)} className="gap-1">
                                  {isEdit ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                                  {isEdit ? 'Terminé' : 'Éditer'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => copyEmail(email)} className="gap-1">
                                  <Copy className="h-3 w-3" /> Copier
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchEmailGenerator;
