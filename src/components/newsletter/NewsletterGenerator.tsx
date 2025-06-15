
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  wordCount: number;
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

  const getWordTarget = (lengthParam: string) => {
    switch (lengthParam) {
      case 'court': return 300;
      case 'moyen': return 500;
      case 'long': return 800;
      default: return 500;
    }
  };

  const generateContentByLength = (selectedNiche: string, topicsArray: string[], selectedTone: string, targetWords: number) => {
    const baseContent = `Bonjour,

Bienvenue dans votre newsletter ${selectedNiche} !

## 📚 Sujets de la semaine

${topicsArray.map(topic => `• **${topic.trim()}**: Analyse approfondie et conseils pratiques`).join('\n')}

## 💡 Conseil de la semaine

Restez toujours informé des dernières tendances dans votre domaine pour garder une longueur d'avance sur vos concurrents.`;

    if (targetWords <= 300) {
      return baseContent + `

## 📈 Point clé

Les professionnels qui se forment régulièrement ont 47% plus de chances de réussir.

À bientôt pour la prochaine édition !`;
    }

    if (targetWords <= 500) {
      return baseContent + `

## 🎯 Stratégies recommandées

1. **Veille concurrentielle**: Analysez ce que font vos concurrents pour identifier les opportunités
2. **Formation continue**: Investissez dans votre développement professionnel
3. **Networking**: Développez votre réseau professionnel dans votre secteur

## 📈 Statistiques intéressantes

- Les professionnels qui se forment régulièrement ont 47% plus de chances de réussir
- La veille informationnelle améliore les performances de 23%
- Le networking génère 85% des opportunités d'affaires

À bientôt pour la prochaine édition !`;
    }

    return baseContent + `

## 🎯 Analyse approfondie

### Tendances actuelles en ${selectedNiche}

Le secteur du ${selectedNiche} connaît une évolution rapide. Les dernières études montrent que les entreprises qui s'adaptent rapidement aux nouvelles tendances augmentent leur chiffre d'affaires de 35% en moyenne.

### Stratégies gagnantes

1. **Innovation constante**: Les leaders du marché investissent 15% de leur chiffre d'affaires en R&D
2. **Expérience client**: 73% des consommateurs privilégient les marques qui offrent une expérience personnalisée
3. **Transformation digitale**: Les entreprises digitalisées croissent 26% plus vite que leurs concurrents

### Étude de cas

Prenons l'exemple d'une entreprise qui a réussi sa transformation. En intégrant l'intelligence artificielle dans ses processus, elle a :
- Réduit ses coûts opérationnels de 30%
- Amélioré sa productivité de 45%
- Augmenté la satisfaction client de 60%

## 🔍 Focus sur ${topicsArray[0] || 'l\'innovation'}

L'importance de ${topicsArray[0] || 'l\'innovation'} ne peut être sous-estimée dans le contexte actuel. Les entreprises qui négligent cet aspect risquent de perdre leur avantage concurrentiel.

### Actions concrètes à mettre en place

- **Audit régulier**: Évaluez vos performances mensuellement
- **Benchmarking**: Comparez-vous aux leaders du marché
- **Formation d'équipe**: Investissez dans le développement de vos collaborateurs
- **Technologie**: Adoptez les outils qui optimisent vos processus

## 📈 Métriques à suivre

- Taux de conversion: +15% visé pour le trimestre
- Satisfaction client: Objectif 90%
- Productivité: Amélioration de 20% attendue
- ROI marketing: Optimisation continue nécessaire

## 🚀 Plan d'action pour la semaine

1. **Lundi**: Analyse des performances de la semaine précédente
2. **Mercredi**: Mise en place des nouvelles stratégies
3. **Vendredi**: Évaluation des premiers résultats

L'excellence n'est pas un accident, c'est le résultat d'un travail constant et méthodique.

À bientôt pour la prochaine édition !`;
  };

  const generateNewsletter = () => {
    if (!niche || !topics) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);
    toast.info('Génération de votre newsletter...');

    const targetWords = getWordTarget(length);
    const topicsArray = topics.split(',').filter(t => t.trim());

    setTimeout(() => {
      const generatedContent = generateContentByLength(niche, topicsArray, tone, targetWords);
      const wordCount = generatedContent.split(' ').length;

      const subjects = {
        'court': `📰 ${niche} - Flash Info`,
        'moyen': `🎯 ${niche} - Édition ${new Date().toLocaleDateString('fr-FR')}`,
        'long': `📊 ${niche} - Analyse Complète de la Semaine`
      };

      const previews = {
        'court': 'L\'essentiel en quelques minutes',
        'moyen': `Votre dose hebdomadaire d'expertise en ${niche}`,
        'long': `Analyse détaillée et stratégies avancées pour ${niche}`
      };

      const ctas = {
        'court': `Découvrir ${niche}`,
        'moyen': `En savoir plus sur ${niche}`,
        'long': `Accéder à notre formation ${niche}`
      };

      const selectedTemplate: NewsletterTemplate = {
        subject: subjects[length as keyof typeof subjects],
        preview: previews[length as keyof typeof previews],
        content: generatedContent,
        cta: ctas[length as keyof typeof ctas],
        wordCount: wordCount
      };

      setNewsletter(selectedTemplate);
      setIsGenerating(false);
      toast.success(`Newsletter générée ! (${wordCount} mots)`);
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
Nombre de mots: ${newsletter.wordCount}

${newsletter.content}

Call-to-Action: ${newsletter.cta}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${niche.toLowerCase().replace(/\s+/g, '-')}-${length}.txt`;
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
                <SelectItem value="court">Court (~300 mots)</SelectItem>
                <SelectItem value="moyen">Moyen (~500 mots)</SelectItem>
                <SelectItem value="long">Long (~800 mots)</SelectItem>
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
            <div>
              <h2 className="text-xl font-semibold">Votre Newsletter</h2>
              <p className="text-sm text-gray-600">
                {newsletter.wordCount} mots • Cible: {getWordTarget(length)} mots
              </p>
            </div>
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
    
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
      <p>Nombre de mots: ${newsletter.wordCount}</p>
    </footer>
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
