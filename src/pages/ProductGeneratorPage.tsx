import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useProductGeneration } from '@/hooks/useProductGeneration';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { ShoppingBag, Package, Star, Copy, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ProductGeneratorPage = () => {
  const [productTitle, setProductTitle] = useState('');
  const { generateProductSheet, loading, result } = useProductGeneration();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!productTitle.trim()) {
      toast.error('Veuillez saisir un titre de produit');
      return;
    }
    await generateProductSheet(productTitle);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Contenu copié dans le presse-papiers');
  };

  const downloadAsText = () => {
    if (!result) return;
    
    const content = `FICHE PRODUIT - ${result.title}

DESCRIPTION COURTE:
${result.shortDescription}

DESCRIPTION LONGUE:
${result.longDescription}

CARACTÉRISTIQUES:
${result.features.map(feature => `• ${feature}`).join('\n')}

CRITÈRES TECHNIQUES:
${result.specifications.map(spec => `• ${spec.name}: ${spec.value}`).join('\n')}

AVANTAGES:
${result.benefits.map(benefit => `• ${benefit}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche-produit-${result.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Fiche produit téléchargée');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au Dashboard
            </Button>
            <div className="flex-1" />
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PROD-BOT
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Générateur de fiches produits complètes avec IA - Descriptions, caractéristiques et avantages automatiques
          </p>
        </div>

        {/* Configuration OpenAI */}
        <OpenAIConfigPanel />

        {/* Générateur */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Générateur de Fiche Produit
            </CardTitle>
            <CardDescription>
              Saisissez simplement le titre de votre produit pour générer une fiche complète
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du produit</label>
              <Input
                placeholder="Ex: iPhone 15 Pro Max 256GB Titanium Bleu"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !productTitle.trim()}
              className="w-full"
            >
              {loading ? 'Génération en cours...' : 'Générer la fiche produit'}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats */}
        {result && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Description courte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Description Courte
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.shortDescription)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: result.shortDescription }}
                />
              </CardContent>
            </Card>

            {/* Description longue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Description Longue (500 mots)
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.longDescription)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none text-justify"
                  dangerouslySetInnerHTML={{ __html: result.longDescription }}
                />
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques Principales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spécifications techniques */}
            <Card>
              <CardHeader>
                <CardTitle>Spécifications Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium text-sm">{spec.name}</span>
                      <Badge variant="secondary">{spec.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avantages */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Avantages du Produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {result.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions de téléchargement */}
        {result && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Button onClick={downloadAsText} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger la fiche complète
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductGeneratorPage;