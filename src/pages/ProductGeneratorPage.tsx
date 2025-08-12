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

## ${result.h2Section.title}
${result.h2Section.content}

### ${result.h3Section.title}
${result.h3Section.content}

${result.h3Section.bulletPoints.map(point => `• ${point}`).join('\n')}

## Témoignage
${result.testimonial}

## À quoi cela sert
${result.whatItDoesFor}

## Où le trouver
${result.whereToFind}

## FAQ
${result.faq.map(item => `Q: ${item.question}\nR: ${item.answer}`).join('\n\n')}

## Caractéristiques
${result.characteristics.map(char => `• ${char}`).join('\n')}
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
          <div className="space-y-6">
            {/* Description courte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  Description Courte (2 lignes)
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
                <p className="text-foreground leading-relaxed whitespace-pre-line">{result.shortDescription}</p>
              </CardContent>
            </Card>

            {/* Section H2 avec description longue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  {result.h2Section.title}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`## ${result.h2Section.title}\n${result.h2Section.content}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: result.h2Section.content }}
                />
              </CardContent>
            </Card>

            {/* Section H3 avec listes à puces */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  {result.h3Section.title}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`### ${result.h3Section.title}\n${result.h3Section.content}\n\n${result.h3Section.bulletPoints.map(point => `• ${point}`).join('\n')}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{result.h3Section.content}</p>
                <ul className="space-y-2">
                  {result.h3Section.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Témoignage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Témoignage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                    <p className="text-foreground italic">"{result.testimonial}"</p>
                  </div>
                </CardContent>
              </Card>

              {/* À quoi cela sert */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">À quoi cela sert</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{result.whatItDoesFor}</p>
                </CardContent>
              </Card>

              {/* Où le trouver */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Où le trouver</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{result.whereToFind}</p>
                </CardContent>
              </Card>

              {/* Caractéristiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.characteristics.map((char, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{char}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.faq.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-foreground">{item.question}</h4>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    {index < result.faq.length - 1 && <hr className="border-muted" />}
                  </div>
                ))}
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