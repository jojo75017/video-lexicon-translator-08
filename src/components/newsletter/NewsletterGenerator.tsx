
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Sparkles, Copy, Download, Eye, Send } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterTemplate {
  subject: string;
  preview: string;
  content: string;
  cta: string;
}

const NewsletterGenerator = () => {
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [length, setLength] = useState('moyen');
  const [topics, setTopics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newsletter, setNewsletter] = useState<NewsletterTemplate | null>(null);

  const niches = [
    'Marketing Digital',
    'E-commerce',
    'Développement Personnel',
    'Finance & Investissement',
    'Santé & Bien-être',
    'Technologie',
    'Voyage',
    'Cuisine & Gastronomie',
    'Mode & Beauté',
    'Immobilier',
    'Sport & Fitness',
    'Entrepreneuriat',
    'Art & Culture',
    'Éducation',
    'Environnement'
  ];

  const tones = [
    { value: 'professionnel', label: 'Professionnel' },
    { value: 'decontracte', label: 'Décontracté' },
    { value: 'expert', label: 'Expert' },
    { value: 'amical', label: 'Amical' },
    { value: 'motivant', label: 'Motivant' }
  ];

  const generateNewsletter = () => {
    if (!niche || !topics) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);
    toast.info('Génération de votre newsletter...');

    // Simulation de génération
    setTimeout(() => {
      const templates = {
        'Marketing Digital': {
          subject: `🚀 Les dernières tendances ${new Date().getFullYear()} en Marketing Digital`,
          preview: `Découvrez les stratégies qui font la différence cette semaine`,
          content: `Bonjour,

Cette semaine, nous explorons les dernières innovations en marketing digital qui transforment l'industrie.

## 📊 Tendances de la semaine

• **IA Générative**: Comment l'intelligence artificielle révolutionne la création de contenu
• **Marketing d'Influence**: Les micro-influenceurs génèrent 60% plus d'engagement
• **Personnalisation**: L'hyperpersonnalisation augmente les conversions de 19%

## 🎯 Conseils pratiques

1. **Optimisez vos campagnes**: Utilisez les données de première partie pour améliorer vos ciblages
2. **Contenu vidéo**: Les vidéos courtes génèrent 200% plus d'engagement
3. **Automatisation**: Intégrez des chatbots pour améliorer l'expérience client

## 📈 Chiffres clés

- 73% des consommateurs préfèrent les marques qui personnalisent leur expérience
- Les emails personnalisés ont un taux d'ouverture 26% plus élevé
- Le ROI du marketing de contenu est 3x supérieur aux méthodes traditionnelles

Bonne semaine marketing !`,
          cta: 'Découvrir nos formations marketing'
        },
        'E-commerce': {
          subject: `💰 Boostez vos ventes e-commerce - Stratégies qui marchent`,
          preview: `Les techniques secrètes des top vendeurs en ligne`,
          content: `Salut entrepreneur,

Cette semaine, focus sur les stratégies e-commerce qui génèrent vraiment des résultats.

## 🛒 Optimisation des conversions

• **Abandon de panier**: Récupérez 70% de ventes avec ces emails automatisés
• **Reviews clients**: Les avis augmentent les conversions de 31%
• **Cross-selling**: Augmentez votre panier moyen de 35%

## 💡 Techniques avancées

1. **Remarketing intelligent**: Ciblez les visiteurs selon leur comportement
2. **Urgence et rareté**: Créez l'urgence sans paraître désespéré
3. **Social proof**: Utilisez les notifications d'achat en temps réel

## 📱 Mobile-first

- 54% des achats se font sur mobile
- Optimisez votre checkout en 3 étapes maximum
- Intégrez Apple Pay et Google Pay

À vos ventes !`,
          cta: 'Accéder à notre masterclass e-commerce'
        }
      };

      const selectedTemplate = templates[niche as keyof typeof templates] || {
        subject: `🎯 Newsletter ${niche} - Édition du ${new Date().toLocaleDateString('fr-FR')}`,
        preview: `Votre dose hebdomadaire d'expertise en ${niche}`,
        content: `Bonjour,

Bienvenue dans votre newsletter ${niche} !

## 📚 Sujets de la semaine

${topics.split(',').map(topic => `• **${topic.trim()}**: Analyse approfondie et conseils pratiques`).join('\n')}

## 💡 Conseil de la semaine

Restez toujours informé des dernières tendances dans votre domaine pour garder une longueur d'avance sur vos concurrents.

## 📈 Statistiques intéressantes

- Les professionnels qui se forment régulièrement ont 47% plus de chances de réussir
- La veille informationnelle améliore les performances de 23%

À bientôt pour la prochaine édition !`,
        cta: `En savoir plus sur ${niche}`
      };

      setNewsletter(selectedTemplate);
      setIsGenerating(false);
      toast.success('Newsletter générée avec succès !');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier !');
  };

  const exportNewsletter = () => {
    if (!newsletter) return;
    
    const content = `Sujet: ${newsletter.subject}
Aperçu: ${newsletter.preview}

${newsletter.content}

Call-to-Action: ${newsletter.cta}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${niche.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    
    toast.success('Newsletter exportée !');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Générateur de Newsletter IA</h1>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="w-3 h-3 mr-1" />
            IA
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Niche *</label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez votre niche" />
              </SelectTrigger>
              <SelectContent>
                {niches.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ton</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Longueur</label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="court">Court (300 mots)</SelectItem>
                <SelectItem value="moyen">Moyen (500 mots)</SelectItem>
                <SelectItem value="long">Long (800 mots)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sujets *</label>
            <Input
              placeholder="ex: SEO, Content Marketing"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={generateNewsletter}
          disabled={isGenerating}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Génération...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer la newsletter
            </>
          )}
        </Button>
      </Card>

      {newsletter && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Votre Newsletter</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(newsletter.content)}>
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
              <Button variant="outline" size="sm" onClick={exportNewsletter}>
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Code HTML
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg">Sujet</h3>
                  <p className="text-gray-700">{newsletter.subject}</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Aperçu</h3>
                  <p className="text-gray-600 text-sm">{newsletter.preview}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">{newsletter.content}</pre>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {newsletter.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="html">
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm">
                  <pre>{`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${newsletter.subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb;">${newsletter.subject}</h1>
    <p style="color: #666; font-style: italic;">${newsletter.preview}</p>
    
    <div style="margin: 20px 0;">
      ${newsletter.content.replace(/\n/g, '<br>')}
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
        ${newsletter.cta}
      </a>
    </div>
  </div>
</body>
</html>`}</pre>
                </code>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default NewsletterGenerator;
