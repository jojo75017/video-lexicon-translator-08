import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Share2, Globe, Mail, Target, Copy, Download } from 'lucide-react';

interface Chapter { id: string; title: string; subChapters: SubChapter[]; content?: string; }
interface SubChapter { id: string; title: string; content?: string; }
interface EbookMarketingProps { ebookTitle: string; chapters: Chapter[]; isGenerating: boolean; }

export const EbookMarketing: React.FC<EbookMarketingProps> = ({ ebookTitle, chapters, isGenerating }) => {
  const [socialPosts, setSocialPosts] = useState<string[]>([]);
  const [landingPageHtml, setLandingPageHtml] = useState('');
  const [emailTemplates, setEmailTemplates] = useState<string[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');

  const generateSocialPosts = async () => { if (!ebookTitle) { toast.error('Titre requis'); return; } toast.info('Fonctionnalité disponible via la page de gestion'); };
  const generateLandingPage = async () => { if (!ebookTitle) { toast.error('Titre requis'); return; } toast.info('Fonctionnalité disponible via la page de gestion'); };
  const generateEmailCampaign = async () => { if (!ebookTitle) { toast.error('Titre requis'); return; } toast.info('Fonctionnalité disponible via la page de gestion'); };
  const generateAdCampaigns = async () => { toast.info('Fonctionnalité disponible prochainement'); };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); toast.success('Copié dans le presse-papier !'); };
  const downloadFile = (content: string, filename: string) => { const blob = new Blob([content], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Configuration Marketing
          </CardTitle>
          <CardDescription>Configurez vos paramètres marketing avant de générer le contenu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-audience">Public cible</Label>
              <Input id="target-audience" placeholder="Ex: Entrepreneurs, parents, étudiants..." value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="budget">Budget marketing</Label>
              <Input id="budget" placeholder="Ex: 100€, 500€..." value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Share2 className="h-5 w-5 text-primary" />
            Générateur de Posts Réseaux Sociaux
          </CardTitle>
          <CardDescription>Créez des posts engageants pour Facebook, Instagram, LinkedIn et Twitter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateSocialPosts} disabled={!ebookTitle || isGenerating} className="w-full">
            Générer 5 Posts Réseaux Sociaux
          </Button>
          {socialPosts.length > 0 && (
            <div className="space-y-3">
              {socialPosts.map((post, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex justify-between items-start gap-2">
                    <pre className="whitespace-pre-wrap text-sm flex-1 text-foreground">{post}</pre>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(post)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe className="h-5 w-5 text-primary" />
            Générateur de Landing Page
          </CardTitle>
          <CardDescription>Créez une page de vente professionnelle pour votre ebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateLandingPage} disabled={!ebookTitle || isGenerating} className="w-full">
            Créer la Landing Page
          </Button>
          {landingPageHtml && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(landingPageHtml)}><Copy className="h-4 w-4 mr-2" />Copier HTML</Button>
                <Button variant="outline" onClick={() => downloadFile(landingPageHtml, `landing-page-${ebookTitle}.html`)}><Download className="h-4 w-4 mr-2" />Télécharger</Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{landingPageHtml}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            Système Email Marketing
          </CardTitle>
          <CardDescription>Générez une séquence d'emails pour promouvoir votre ebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateEmailCampaign} disabled={!ebookTitle || isGenerating} className="w-full">
            Générer Séquence Email (5 emails)
          </Button>
          {emailTemplates.length > 0 && (
            <div className="space-y-3">
              {emailTemplates.map((email, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">Email {index + 1}</Badge>
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{email}</pre>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(email)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Générateur de Publicités
          </CardTitle>
          <CardDescription>Créez des campagnes publicitaires pour Facebook, Amazon et Google</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateAdCampaigns} disabled={!ebookTitle || isGenerating} className="w-full">
            Générer Campagnes Publicitaires
          </Button>
          {adCampaigns.length > 0 && (
            <div className="space-y-3">
              {adCampaigns.map((campaign, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">
                        {index === 0 ? 'Facebook' : index === 1 ? 'Amazon KDP' : 'Google Ads'}
                      </Badge>
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{campaign}</pre>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(campaign)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
