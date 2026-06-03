import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Share2, Globe, Mail, Target, Copy, Download, Loader2, Rocket, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isValidGoogleKey } from '@/services/aiWritingService';

const getGeminiApiKey = (): string => (localStorage.getItem('openai_api_key') || '').trim();

interface Chapter { id: string; title: string; subChapters: SubChapter[]; content?: string; }
interface SubChapter { id: string; title: string; content?: string; }
interface EbookMarketingProps {
  ebookTitle: string;
  chapters: Chapter[];
  isGenerating: boolean;
  authorName?: string;
  bookSummary?: string;
  targetAudience?: string;
}

interface LaunchEmail {
  step: number;
  label: string;
  dayOffset: string;
  subject: string;
  preheader: string;
  bodyText: string;
  bodyHtml: string;
}

export const EbookMarketing: React.FC<EbookMarketingProps> = ({
  ebookTitle, chapters, isGenerating,
  authorName = '', bookSummary = '', targetAudience = '',
}) => {
  // Campagne email de lancement (la fonctionnalité principale)
  const [launchDate, setLaunchDate] = useState('');
  const [bookPitch, setBookPitch] = useState('');
  const [buyLink, setBuyLink] = useState('');
  const [launchEmails, setLaunchEmails] = useState<LaunchEmail[]>([]);
  const [generatingCampaign, setGeneratingCampaign] = useState(false);

  // Sections placeholder conservées (inchangées)
  const [socialPosts] = useState<string[]>([]);
  const [landingPageHtml] = useState('');
  const [adCampaigns] = useState<string[]>([]);
  const [campaignTargetAudience, setCampaignTargetAudience] = useState(targetAudience);
  const [budget, setBudget] = useState('');

  const copyToClipboard = (text: string, label = 'Copié !') => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const downloadFile = (content: string, filename: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const buildEml = (e: LaunchEmail): string => {
    const safeSubject = e.subject.replace(/[\r\n]+/g, ' ');
    return [
      `Subject: ${safeSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      `<!-- Preheader: ${e.preheader} -->`,
      e.bodyHtml,
    ].join('\r\n');
  };

  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'livre';

  const generateLaunchCampaign = async () => {
    if (!ebookTitle?.trim()) {
      toast.error('Le titre du livre est requis (renseigne-le dans la fiche projet).');
      return;
    }
    const apiKey = getGeminiApiKey();
    if (!isValidGoogleKey(apiKey)) {
      toast.error('Configure d\'abord ta clé Google Gemini dans les Paramètres (AIza… ou AQ.Ab…).');
      return;
    }

    setGeneratingCampaign(true);
    setLaunchEmails([]);
    try {
      const { data, error } = await supabase.functions.invoke('generate-launch-email-campaign', {
        body: {
          ebookTitle,
          authorName,
          targetAudience: campaignTargetAudience || targetAudience,
          bookSummary,
          bookPitch: bookPitch.trim() || undefined,
          launchDate: launchDate || undefined,
          buyLink: buyLink.trim() || undefined,
          geminiApiKey: apiKey,
        },
      });

      if (error) throw new Error(error.message);
      if (!data?.success || !Array.isArray(data?.emails)) {
        throw new Error(data?.error || 'Réponse invalide');
      }

      setLaunchEmails(data.emails);
      toast.success(`Campagne générée : ${data.emails.length} emails prêts !`);
    } catch (err: any) {
      console.error('[launch-campaign]', err);
      toast.error(err?.message || 'Échec de la génération');
    } finally {
      setGeneratingCampaign(false);
    }
  };

  const downloadAllEmails = async () => {
    if (launchEmails.length === 0) return;
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const slug = slugify(ebookTitle);
      launchEmails.forEach((e) => {
        const base = `email-${e.step}-${slugify(e.dayOffset)}`;
        zip.file(`${base}.eml`, buildEml(e));
        zip.file(`${base}.txt`, `OBJET : ${e.subject}\nPRE-HEADER : ${e.preheader}\n\n${e.bodyText}`);
        zip.file(`${base}.html`, e.bodyHtml);
      });
      zip.file('README.txt',
`Campagne email de lancement - ${ebookTitle}

Comment utiliser ces fichiers :
1. Importe-les dans ton outil d'emailing (Mailchimp, Brevo, Systeme.io, ConvertKit, MailerLite...).
2. Pour chaque email, copie l'OBJET (champ subject) et le CORPS (.html ou .txt).
3. Programme l'envoi selon le calendrier J-7, J-3, J0, J+3, J+7.
4. Remplace [LIEN_ACHAT] par le vrai lien si tu ne l'as pas renseigné.

Ebookstudio Pro V2 génère le contenu - l'envoi se fait depuis ton outil d'emailing.`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `campagne-email-${slug}.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Campagne téléchargée !');
    } catch (err: any) {
      toast.error('Téléchargement impossible : ' + (err?.message || 'erreur'));
    }
  };

  const placeholderToast = () => toast.info('Module disponible prochainement');

  return (
    <div className="space-y-6">
      {/* === CAMPAGNE EMAIL DE LANCEMENT (fonctionnalité active) === */}
      <Card className="bg-card border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Rocket className="h-5 w-5 text-primary" />
            Campagne Email de Lancement
            <Badge className="ml-2 bg-primary/10 text-primary border-primary/30">5 emails prêts</Badge>
          </CardTitle>
          <CardDescription>
            Génère une séquence complète (J-7 → J+7) pour annoncer la sortie de ton livre à ta liste email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Ces emails sont à <strong>copier-coller dans ton outil d'emailing</strong> habituel
              (Mailchimp, Brevo, Systeme.io, ConvertKit, MailerLite…). Ebookstudio Pro V2 génère le contenu —
              <strong> l'envoi se fait depuis ton outil</strong>. Aucun email n'est envoyé d'ici.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="launch-date">Date de sortie prévue</Label>
              <Input id="launch-date" type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="buy-link">Lien d'achat (optionnel)</Label>
              <Input id="buy-link" placeholder="https://amazon.fr/dp/..." value={buyLink} onChange={(e) => setBuyLink(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="campaign-audience">Public cible</Label>
            <Input
              id="campaign-audience"
              placeholder="Ex : entrepreneurs débutants, parents d'ados, passionnés de cuisine…"
              value={campaignTargetAudience}
              onChange={(e) => setCampaignTargetAudience(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="book-pitch">Pitch / promesse du livre (optionnel - sinon le résumé du projet sera utilisé)</Label>
            <Textarea
              id="book-pitch"
              rows={3}
              placeholder="En 2-3 phrases : à qui s'adresse le livre, quel problème il résout, quelle promesse..."
              value={bookPitch}
              onChange={(e) => setBookPitch(e.target.value)}
            />
          </div>

          <Button
            onClick={generateLaunchCampaign}
            disabled={!ebookTitle || generatingCampaign}
            className="w-full"
            size="lg"
          >
            {generatingCampaign ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération en cours… (~30s)</>
            ) : (
              <><Rocket className="h-4 w-4 mr-2" /> Générer la séquence de 5 emails</>
            )}
          </Button>

          {launchEmails.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">
                  {launchEmails.length} emails générés ✨
                </p>
                <Button variant="default" size="sm" onClick={downloadAllEmails}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tout (.zip)
                </Button>
              </div>

              {launchEmails.map((e) => (
                <div key={e.step} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">{e.dayOffset}</Badge>
                      <span className="font-medium text-foreground">{e.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(e.subject, 'Objet copié')}>
                        <Copy className="h-3 w-3 mr-1" /> Objet
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(e.bodyText, 'Texte copié')}>
                        <Copy className="h-3 w-3 mr-1" /> Texte
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(e.bodyHtml, 'HTML copié')}>
                        <Copy className="h-3 w-3 mr-1" /> HTML
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div><strong className="text-foreground">Objet :</strong> {e.subject}</div>
                    <div className="italic mt-0.5">Aperçu : {e.preheader}</div>
                  </div>

                  <pre className="whitespace-pre-wrap text-sm text-foreground bg-background p-3 rounded border border-border max-h-80 overflow-y-auto font-sans">
                    {e.bodyText}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* === Configuration générale (placeholder) === */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Autres outils marketing
          </CardTitle>
          <CardDescription>Modules complémentaires pour ta promotion (en préparation)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="budget">Budget marketing prévu</Label>
            <Input id="budget" placeholder="Ex: 100€, 500€..." value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" onClick={placeholderToast} className="justify-start">
              <Share2 className="h-4 w-4 mr-2" /> Posts réseaux sociaux
            </Button>
            <Button variant="outline" onClick={placeholderToast} className="justify-start">
              <Globe className="h-4 w-4 mr-2" /> Landing page
            </Button>
            <Button variant="outline" onClick={placeholderToast} className="justify-start">
              <Mail className="h-4 w-4 mr-2" /> Pubs Facebook/Amazon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
