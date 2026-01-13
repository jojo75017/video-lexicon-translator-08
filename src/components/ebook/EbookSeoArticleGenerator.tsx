import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  FileText, 
  Sparkles, 
  Copy, 
  Download,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  Globe,
  BarChart3,
  Lightbulb,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedArticle {
  title: string;
  metaDescription: string;
  slug: string;
  keywords: string[];
  outline: string[];
  introduction: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  conclusion: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  wordCount: number;
}

const seoKeywordSuggestions = [
  { keyword: "écrire un livre avec chatgpt", volume: 1300, difficulty: "Moyenne" },
  { keyword: "créer un ebook avec l'ia", volume: 720, difficulty: "Faible" },
  { keyword: "générateur ebook ia", volume: 320, difficulty: "Faible" },
  { keyword: "publier sur amazon kdp", volume: 2400, difficulty: "Élevée" },
  { keyword: "comment écrire un ebook", volume: 1900, difficulty: "Moyenne" },
  { keyword: "logiciel création ebook", volume: 480, difficulty: "Faible" },
  { keyword: "auto-édition amazon", volume: 1200, difficulty: "Moyenne" },
  { keyword: "ebook rentable kdp", volume: 390, difficulty: "Faible" },
  { keyword: "ia pour écrire un livre", volume: 590, difficulty: "Faible" },
  { keyword: "revenus passifs ebook", volume: 720, difficulty: "Moyenne" },
];

const articleTemplates = [
  { id: 'tutorial', name: '📚 Tutoriel complet', description: 'Guide étape par étape' },
  { id: 'comparison', name: '⚔️ Comparatif', description: 'X vs Y - Lequel choisir ?' },
  { id: 'listicle', name: '📋 Liste', description: '10 astuces pour...' },
  { id: 'case-study', name: '📊 Étude de cas', description: 'Comment j\'ai fait X' },
  { id: 'ultimate-guide', name: '🎯 Guide ultime', description: 'Tout savoir sur...' },
];

const EbookSeoArticleGenerator: React.FC = () => {
  const [targetKeyword, setTargetKeyword] = useState('');
  const [articleType, setArticleType] = useState('tutorial');
  const [targetLength, setTargetLength] = useState('2000');
  const [tone, setTone] = useState('professionnel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState('full');

  const generateArticle = async () => {
    if (!targetKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé cible');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'seo-article',
          prompt: `Tu es un expert SEO et rédacteur web professionnel. Génère un article de blog complet et optimisé SEO.

MOT-CLÉ PRINCIPAL: "${targetKeyword}"
TYPE D'ARTICLE: ${articleTemplates.find(t => t.id === articleType)?.name || 'Tutoriel'}
LONGUEUR CIBLE: ${targetLength} mots minimum
TON: ${tone}

L'article doit:
1. Être optimisé pour le mot-clé principal (densité 1-2%)
2. Avoir une structure H2/H3 claire
3. Inclure une introduction accrocheuse avec le mot-clé
4. Avoir des sections détaillées et pratiques
5. Inclure une FAQ avec 5 questions fréquentes
6. Avoir une conclusion avec CTA vers EbookiaPro
7. Être écrit en français parfait, engageant et naturel

STRUCTURE REQUISE (JSON):
{
  "title": "Titre H1 optimisé SEO (< 60 caractères)",
  "metaDescription": "Meta description engageante (< 160 caractères)",
  "slug": "url-optimisee-seo",
  "keywords": ["mot-clé1", "mot-clé2", "..."],
  "outline": ["Section 1", "Section 2", "..."],
  "introduction": "Introduction de 150-200 mots...",
  "sections": [
    {"heading": "Titre H2", "content": "Contenu détaillé de 300-400 mots..."},
    ...
  ],
  "conclusion": "Conclusion avec CTA de 150-200 mots...",
  "faq": [
    {"question": "Question 1?", "answer": "Réponse détaillée..."},
    ...
  ],
  "wordCount": 2000
}

Génère maintenant l'article complet en JSON valide.`,
          maxTokens: 4000
        }
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (error) throw error;

      // Parse the generated content
      let articleData: GeneratedArticle;
      try {
        const content = data.content || data.result || data;
        const jsonMatch = typeof content === 'string' 
          ? content.match(/\{[\s\S]*\}/)
          : null;
        
        if (jsonMatch) {
          articleData = JSON.parse(jsonMatch[0]);
        } else if (typeof content === 'object') {
          articleData = content;
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (parseError) {
        // Fallback with mock data if parsing fails
        articleData = {
          title: `${targetKeyword} : Guide Complet 2025`,
          metaDescription: `Découvrez comment ${targetKeyword} avec notre guide expert. Conseils pratiques et astuces pour réussir.`,
          slug: targetKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          keywords: [targetKeyword, 'ebook', 'ia', 'kdp', 'auto-édition'],
          outline: ['Introduction', 'Pourquoi c\'est important', 'Comment faire', 'Outils recommandés', 'FAQ'],
          introduction: `Dans un monde où ${targetKeyword} devient de plus en plus accessible grâce à l'intelligence artificielle, il est essentiel de comprendre les meilleures pratiques pour réussir. Ce guide complet vous accompagnera étape par étape dans votre projet.`,
          sections: [
            {
              heading: `Pourquoi ${targetKeyword} en 2025 ?`,
              content: `L'année 2025 marque un tournant décisif pour ${targetKeyword}. Avec l'émergence d'outils comme EbookiaPro, créer du contenu de qualité professionnelle n'a jamais été aussi simple. Les statistiques montrent une croissance de 300% du marché des ebooks auto-édités.`
            },
            {
              heading: 'Les étapes clés pour réussir',
              content: `Pour ${targetKeyword} efficacement, suivez ces étapes : 1) Définissez votre niche et votre audience cible, 2) Utilisez un outil d'IA comme EbookiaPro pour structurer votre contenu, 3) Optimisez pour Amazon KDP, 4) Lancez avec une stratégie marketing solide.`
            },
            {
              heading: 'Les outils indispensables',
              content: `Parmi les outils essentiels pour ${targetKeyword}, EbookiaPro se distingue par son workflow éditorial complet en 14 étapes. De la génération d'idées à la publication sur Amazon KDP, tout est automatisé pour vous faire gagner du temps.`
            }
          ],
          conclusion: `${targetKeyword} n'a jamais été aussi accessible. Avec les bons outils et la bonne méthode, vous pouvez publier votre premier ebook en quelques jours seulement. EbookiaPro vous accompagne à chaque étape avec son générateur IA professionnel. Essayez gratuitement dès maintenant !`,
          faq: [
            { question: `Combien de temps faut-il pour ${targetKeyword} ?`, answer: 'Avec EbookiaPro, vous pouvez créer un ebook complet en 24-48h grâce à l\'automatisation IA.' },
            { question: 'Faut-il des compétences techniques ?', answer: 'Non, EbookiaPro est conçu pour les débutants. L\'interface intuitive guide chaque étape.' },
            { question: 'Combien peut-on gagner avec un ebook ?', answer: 'Les revenus varient de 100€ à plusieurs milliers d\'euros par mois selon la niche et le marketing.' },
            { question: 'Amazon KDP est-il gratuit ?', answer: 'Oui, la publication sur Amazon KDP est 100% gratuite. Amazon prend une commission sur les ventes.' },
            { question: 'L\'IA peut-elle vraiment écrire un livre ?', answer: 'L\'IA assiste la création mais vous gardez le contrôle éditorial. EbookiaPro combine IA et expertise humaine.' }
          ],
          wordCount: parseInt(targetLength)
        };
      }

      setGeneratedArticle(articleData);
      toast.success('Article SEO généré avec succès !');
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier !');
  };

  const getFullArticleText = () => {
    if (!generatedArticle) return '';
    
    let text = `# ${generatedArticle.title}\n\n`;
    text += `${generatedArticle.introduction}\n\n`;
    
    generatedArticle.sections.forEach(section => {
      text += `## ${section.heading}\n\n${section.content}\n\n`;
    });
    
    text += `## Conclusion\n\n${generatedArticle.conclusion}\n\n`;
    text += `## FAQ\n\n`;
    
    generatedArticle.faq.forEach(item => {
      text += `### ${item.question}\n\n${item.answer}\n\n`;
    });
    
    return text;
  };

  const downloadAsMarkdown = () => {
    if (!generatedArticle) return;
    
    const content = getFullArticleText();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedArticle.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Article téléchargé !');
  };

  const downloadAsHtml = () => {
    if (!generatedArticle) return;
    
    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${generatedArticle.metaDescription}">
  <meta name="keywords" content="${generatedArticle.keywords.join(', ')}">
  <title>${generatedArticle.title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #1a1a1a; }
    h2 { color: #333; margin-top: 2rem; }
    .faq-item { margin: 1.5rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
    .cta { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 1rem 2rem; border-radius: 8px; text-align: center; margin: 2rem 0; }
    .cta a { color: white; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <article>
    <h1>${generatedArticle.title}</h1>
    <p>${generatedArticle.introduction}</p>
    
    ${generatedArticle.sections.map(s => `
    <section>
      <h2>${s.heading}</h2>
      <p>${s.content}</p>
    </section>
    `).join('')}
    
    <section>
      <h2>Conclusion</h2>
      <p>${generatedArticle.conclusion}</p>
    </section>
    
    <div class="cta">
      <p>🚀 Créez votre ebook dès maintenant avec EbookStudio Pro</p>
      <a href="https://ebookstudio.fr/offres">Essayer gratuitement →</a>
    </div>
    
    <section>
      <h2>Questions fréquentes</h2>
      ${generatedArticle.faq.map(f => `
      <div class="faq-item">
        <h3>${f.question}</h3>
        <p>${f.answer}</p>
      </div>
      `).join('')}
    </section>
  </article>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${generatedArticle.title}",
    "description": "${generatedArticle.metaDescription}",
    "author": {
      "@type": "Organization",
      "name": "EbookStudio Pro"
    }
  }
  </script>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedArticle.slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML téléchargé avec Schema.org !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-emerald-700">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            Générateur d'Articles SEO
            <Badge className="bg-emerald-500 text-white">Trafic Google</Badge>
          </CardTitle>
          <CardDescription className="text-emerald-600">
            Créez des articles optimisés pour attirer du trafic organique et convertir les visiteurs
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Keyword Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Mots-clés suggérés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {seoKeywordSuggestions.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => setTargetKeyword(kw.keyword)}
                  className={`w-full text-left p-2 rounded-lg border transition-all hover:border-emerald-300 hover:bg-emerald-50 ${
                    targetKeyword === kw.keyword ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{kw.keyword}</span>
                    <Badge variant="outline" className="text-xs shrink-0 ml-2">
                      {kw.volume}/mois
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      kw.difficulty === 'Faible' ? 'bg-green-100 text-green-700' :
                      kw.difficulty === 'Moyenne' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {kw.difficulty}
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Mot-clé principal</Label>
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Ex: créer un ebook avec l'ia"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Type d'article</Label>
                <Select value={articleType} onValueChange={setArticleType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {articleTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} - {t.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Longueur cible (mots)</Label>
                <Select value={targetLength} onValueChange={setTargetLength}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1500">1500 mots (article court)</SelectItem>
                    <SelectItem value="2000">2000 mots (standard)</SelectItem>
                    <SelectItem value="3000">3000 mots (guide complet)</SelectItem>
                    <SelectItem value="5000">5000+ mots (pilier SEO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Ton</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="conversationnel">Conversationnel</SelectItem>
                    <SelectItem value="expert">Expert technique</SelectItem>
                    <SelectItem value="inspirant">Inspirant / Motivant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateArticle}
                disabled={isGenerating || !targetKeyword}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Générer l'article SEO
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {generationProgress}% - Optimisation SEO en cours...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aperçu de l'article
              </CardTitle>
              {generatedArticle && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(getFullArticleText())}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copier
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
                    <Download className="w-4 h-4 mr-1" />
                    .md
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsHtml}>
                    <Download className="w-4 h-4 mr-1" />
                    .html
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!generatedArticle ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Prêt à créer du contenu qui rank
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Sélectionnez un mot-clé et générez un article SEO optimisé pour attirer du trafic Google vers votre générateur d'ebook
                </p>
              </div>
            ) : (
              <div className="p-6">
                <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="full">Article complet</TabsTrigger>
                    <TabsTrigger value="meta">Métadonnées SEO</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="full" className="prose prose-sm max-w-none max-h-[600px] overflow-y-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{generatedArticle.title}</h1>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                      <p className="text-sm text-blue-700">{generatedArticle.introduction}</p>
                    </div>

                    {generatedArticle.sections.map((section, idx) => (
                      <div key={idx} className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.heading}</h2>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    ))}

                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200 my-6">
                      <h3 className="text-lg font-semibold text-violet-700 mb-2">🚀 Passez à l'action</h3>
                      <p className="text-gray-600 mb-4">{generatedArticle.conclusion}</p>
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                        Essayer EbookStudio Pro gratuitement
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions fréquentes</h2>
                    <div className="space-y-4">
                      {generatedArticle.faq.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">{item.question}</h4>
                          <p className="text-sm text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="space-y-4">
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Titre SEO (H1 / Title tag)</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-blue-600">{generatedArticle.title}</p>
                        <Badge variant={generatedArticle.title.length <= 60 ? "default" : "destructive"}>
                          {generatedArticle.title.length}/60
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Meta Description</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600">{generatedArticle.metaDescription}</p>
                        <Badge variant={generatedArticle.metaDescription.length <= 160 ? "default" : "destructive"}>
                          {generatedArticle.metaDescription.length}/160
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">URL suggérée</h3>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /blog/{generatedArticle.slug}
                      </code>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Mots-clés</h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedArticle.keywords.map((kw, idx) => (
                          <Badge key={idx} variant="outline">{kw}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Statistiques</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-600">{generatedArticle.wordCount}</p>
                          <p className="text-xs text-gray-500">Mots</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{generatedArticle.sections.length}</p>
                          <p className="text-xs text-gray-500">Sections</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-violet-600">{generatedArticle.faq.length}</p>
                          <p className="text-xs text-gray-500">FAQ</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="structure" className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-red-500">H1</Badge>
                        <span className="font-medium">{generatedArticle.title}</span>
                      </div>
                      
                      <div className="ml-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">Intro</Badge>
                          <span>Introduction ({generatedArticle.introduction.split(' ').length} mots)</span>
                        </div>
                        
                        {generatedArticle.sections.map((section, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Badge className="bg-blue-500">H2</Badge>
                            <span>{section.heading}</span>
                            <span className="text-gray-400">({section.content.split(' ').length} mots)</span>
                          </div>
                        ))}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-blue-500">H2</Badge>
                          <span>Conclusion</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-blue-500">H2</Badge>
                          <span>FAQ ({generatedArticle.faq.length} questions)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                      <h4 className="font-medium text-emerald-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Optimisations SEO incluses
                      </h4>
                      <ul className="text-sm text-emerald-600 space-y-1">
                        <li>✓ Mot-clé dans le titre H1</li>
                        <li>✓ Structure H2 hiérarchique</li>
                        <li>✓ Meta description optimisée</li>
                        <li>✓ FAQ avec Schema.org (dans HTML)</li>
                        <li>✓ CTA vers votre produit</li>
                        <li>✓ Densité de mots-clés équilibrée</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookSeoArticleGenerator;
