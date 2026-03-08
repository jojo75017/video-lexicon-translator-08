import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BookOpen, Copy, Sparkles, Star, User, BookCopy, Mail, QrCode, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookBackMatterGeneratorProps {
  authorName?: string;
  ebookTitle?: string;
  bookSummary?: string;
}

export const EbookBackMatterGenerator: React.FC<EbookBackMatterGeneratorProps> = ({
  authorName = '', ebookTitle = '', bookSummary = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [authorBio, setAuthorBio] = useState('');
  const [otherBooks, setOtherBooks] = useState('');
  const [reviewCTA, setReviewCTA] = useState('');
  const [newsletterCTA, setNewsletterCTA] = useState('');
  const [acknowledgments, setAcknowledgments] = useState('');
  const [resourcesPage, setResourcesPage] = useState('');
  const [disclaimerPage, setDisclaimerPage] = useState('');

  const [settings, setSettings] = useState({
    includeAbout: true,
    includeOtherBooks: true,
    includeReviewCTA: true,
    includeNewsletter: true,
    includeAcknowledgments: false,
    includeResources: false,
    includeDisclaimer: true,
  });

  const generateAll = async () => {
    if (!authorName && !ebookTitle) { toast.error('Renseignez au moins le titre ou l\'auteur'); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'back-matter',
          prompt: `Génère les pages de fin (back matter) pour un ebook KDP:\n\nTitre: ${ebookTitle}\nAuteur: ${authorName}\nRésumé: ${bookSummary || 'Non fourni'}\n\nGénère en JSON:\n{\n  "aboutAuthor": "Biographie auteur 150-200 mots (3ème personne, professionnelle, engageante)",\n  "otherBooks": "Section 'Du même auteur' avec 3-4 titres fictifs cohérents + descriptions courtes",\n  "reviewCTA": "Appel à laisser un avis Amazon (émotionnel, sincère, avec instruction précise)",\n  "newsletterCTA": "Appel à rejoindre la newsletter avec promesse de bonus exclusif",\n  "acknowledgments": "Page de remerciements professionnelle et touchante",\n  "resources": "Page de ressources complémentaires liées au sujet du livre",\n  "disclaimer": "Mentions légales et avertissement standard ebook"\n}`,
        }
      });
      if (error) throw error;
      const content = data?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAuthorBio(parsed.aboutAuthor || '');
        setOtherBooks(parsed.otherBooks || '');
        setReviewCTA(parsed.reviewCTA || '');
        setNewsletterCTA(parsed.newsletterCTA || '');
        setAcknowledgments(parsed.acknowledgments || '');
        setResourcesPage(parsed.resources || '');
        setDisclaimerPage(parsed.disclaimer || '');
        toast.success('Back matter généré !');
      }
    } catch {
      toast.error('Erreur de génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAll = () => {
    const parts: string[] = [];
    if (settings.includeDisclaimer && disclaimerPage) parts.push(`--- MENTIONS LÉGALES ---\n\n${disclaimerPage}`);
    if (settings.includeAcknowledgments && acknowledgments) parts.push(`--- REMERCIEMENTS ---\n\n${acknowledgments}`);
    if (settings.includeResources && resourcesPage) parts.push(`--- RESSOURCES ---\n\n${resourcesPage}`);
    if (settings.includeAbout && authorBio) parts.push(`--- À PROPOS DE L'AUTEUR ---\n\n${authorBio}`);
    if (settings.includeOtherBooks && otherBooks) parts.push(`--- DU MÊME AUTEUR ---\n\n${otherBooks}`);
    if (settings.includeReviewCTA && reviewCTA) parts.push(`--- UN MOT POUR L'AUTEUR ? ---\n\n${reviewCTA}`);
    if (settings.includeNewsletter && newsletterCTA) parts.push(`--- RESTEZ CONNECTÉ ---\n\n${newsletterCTA}`);
    navigator.clipboard.writeText(parts.join('\n\n\n'));
    toast.success('Back matter copié !');
  };

  const sections = [
    { key: 'includeAbout', label: 'À propos de l\'auteur', icon: User, content: authorBio, setter: setAuthorBio },
    { key: 'includeOtherBooks', label: 'Du même auteur', icon: BookCopy, content: otherBooks, setter: setOtherBooks },
    { key: 'includeReviewCTA', label: 'Appel à review', icon: Star, content: reviewCTA, setter: setReviewCTA },
    { key: 'includeNewsletter', label: 'Newsletter CTA', icon: Mail, content: newsletterCTA, setter: setNewsletterCTA },
    { key: 'includeAcknowledgments', label: 'Remerciements', icon: BookOpen, content: acknowledgments, setter: setAcknowledgments },
    { key: 'includeResources', label: 'Ressources', icon: BookOpen, content: resourcesPage, setter: setResourcesPage },
    { key: 'includeDisclaimer', label: 'Mentions légales', icon: BookOpen, content: disclaimerPage, setter: setDisclaimerPage },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Générateur de Back Matter
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Créez automatiquement les pages de fin de votre livre : biographie, autres livres, appel à review, newsletter, mentions légales.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Nom de l'auteur</Label>
              <Input value={authorName} disabled placeholder="Depuis les paramètres du projet" />
            </div>
            <div>
              <Label>Titre du livre</Label>
              <Input value={ebookTitle} disabled placeholder="Depuis les paramètres du projet" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Sections à inclure</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sections.map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <Switch checked={settings[s.key as keyof typeof settings]} onCheckedChange={v => setSettings(p => ({ ...p, [s.key]: v }))} />
                  <span className="text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateAll} disabled={isGenerating} className="bg-primary">
              {isGenerating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Génération...</> : <><Sparkles className="h-4 w-4 mr-1" /> Générer tout</>}
            </Button>
            {authorBio && <Button variant="outline" onClick={copyAll}><Copy className="h-4 w-4 mr-1" /> Copier tout</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Generated Sections */}
      {sections.filter(s => s.content && settings[s.key as keyof typeof settings]).map(s => (
        <Card key={s.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <s.icon className="h-4 w-4 text-primary" />
              {s.label}
              <Badge variant="outline" className="text-xs ml-auto"><CheckCircle2 className="h-3 w-3 mr-1" /> Généré</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={s.content} onChange={e => s.setter(e.target.value)} className="min-h-[120px] text-sm" />
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { navigator.clipboard.writeText(s.content); toast.success('Copié'); }}>
              <Copy className="h-3 w-3 mr-1" /> Copier
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EbookBackMatterGenerator;
