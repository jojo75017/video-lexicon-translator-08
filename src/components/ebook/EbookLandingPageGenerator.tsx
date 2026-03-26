import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Copy, Eye, Sparkles, Star, BookOpen, ShoppingCart, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookLandingPageGeneratorProps {
  ebookTitle?: string;
  authorName?: string;
  bookSummary?: string;
  coverImage?: string;
  kdpDescription?: string;
}

export const EbookLandingPageGenerator: React.FC<EbookLandingPageGeneratorProps> = ({
  ebookTitle = '', authorName = '', bookSummary = '', coverImage, kdpDescription = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [amazonUrl, setAmazonUrl] = useState('');
  const [emailCollect, setEmailCollect] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const generateLanding = async () => {
    if (!ebookTitle) { toast.error('Titre du livre requis'); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'landing-page',
          prompt: `Génère une landing page HTML complète et professionnelle pour vendre un ebook :\n\nTitre: ${ebookTitle}\nAuteur: ${authorName}\nRésumé: ${bookSummary || kdpDescription || 'Non fourni'}\nLien Amazon: ${amazonUrl || '#'}\nEmail collecte: ${emailCollect || ''}\n\nInclure :\n1. Hero section avec titre accrocheur et CTA\n2. Section "Ce que vous allez apprendre" (6 bullet points)\n3. Section "À propos de l'auteur"\n4. 3 témoignages fictifs réalistes\n5. Extrait gratuit (simulé)\n6. Section FAQ (4 questions)\n7. CTA final avec bouton Amazon\n8. Footer minimal\n\nStyle : moderne, professionnel, gradients subtils, mobile-first.\nUtilise Tailwind CSS inline (pas de <style> séparé).\nRetourne UNIQUEMENT le HTML complet prêt à copier (pas de markdown, pas de code fences).`,
        }
      });
      if (error) throw error;
      let html = data?.content || data?.analysis || '';
      // Clean markdown fences if present
      html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
      
      if (html.length > 100) {
        setGeneratedHtml(html);
        setShowPreview(true);
        toast.success('Landing page générée !');
      } else {
        toast.error('Contenu insuffisant généré');
      }
    } catch {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success('HTML copié ! Collez-le dans votre hébergeur.');
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Générateur de Landing Page
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Créez une page de vente professionnelle pour votre livre avec hero, témoignages, FAQ et bouton d'achat Amazon.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Titre du livre</Label>
              <Input value={ebookTitle} disabled className="mt-1" />
            </div>
            <div>
              <Label>Auteur</Label>
              <Input value={authorName} disabled className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Lien Amazon (optionnel)</Label>
            <Input value={amazonUrl} onChange={e => setAmazonUrl(e.target.value)} placeholder="https://amazon.com/dp/..." className="mt-1" />
          </div>
          <div>
            <Label>Email de collecte newsletter (optionnel)</Label>
            <Input value={emailCollect} onChange={e => setEmailCollect(e.target.value)} placeholder="votre@email.com" className="mt-1" />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateLanding} disabled={isGenerating} className="bg-primary">
              {isGenerating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Génération...</> : <><Sparkles className="h-4 w-4 mr-1" /> Générer la Landing Page</>}
            </Button>
            {generatedHtml && (
              <>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-1" /> {showPreview ? 'Masquer' : 'Aperçu'}
                </Button>
                <Button variant="outline" onClick={copyHtml}>
                  <Copy className="h-4 w-4 mr-1" /> Copier HTML
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features preview */}
      {!generatedHtml && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Star, label: 'Hero accrocheur', desc: 'Titre + sous-titre + CTA' },
            { icon: BookOpen, label: 'Contenu clé', desc: '6 points d\'apprentissage' },
            { icon: Mail, label: 'Témoignages', desc: '3 avis crédibles' },
            { icon: ShoppingCart, label: 'CTA Amazon', desc: 'Bouton d\'achat optimisé' },
          ].map(f => (
            <Card key={f.label} className="p-3 text-center">
              <f.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xs font-medium">{f.label}</div>
              <div className="text-[10px] text-muted-foreground">{f.desc}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview */}
      {showPreview && generatedHtml && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Aperçu de la Landing Page</CardTitle>
              <Badge variant="outline" className="text-xs">HTML prêt à déployer</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-card">
              <iframe
                srcDoc={generatedHtml}
                className="w-full h-[600px] border-0"
                title="Landing Page Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookLandingPageGenerator;
