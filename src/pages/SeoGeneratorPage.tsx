import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Settings, Link, Image, Code, Network, Zap, Copy, Download, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';

const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUrl, analyzeSite, isLoading, seoAnalysis } = useSiteAnalyzer();
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  
  const analyzeUrl = async () => {
    if (!urlToAnalyze.trim()) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }
    
    try {
      setUrl(urlToAnalyze);
      await analyzeSite();
      
      // Attendre un peu pour que l'analyse se termine
      setTimeout(() => {
        if (seoAnalysis) {
          // Pré-remplir le formulaire avec les données analysées
          setFormData(prev => ({
            ...prev,
            title: seoAnalysis.title || prev.title,
            description: seoAnalysis.description || prev.description,
            keywords: seoAnalysis.keywords?.join(', ') || prev.keywords,
            h1: seoAnalysis.headings?.h1?.[0] || prev.h1,
            h2Tags: seoAnalysis.headings?.h2 || prev.h2Tags,
            targetUrl: urlToAnalyze,
            canonical: urlToAnalyze,
            organizationName: seoAnalysis.metadata?.title || prev.organizationName,
          }));
          
          toast.success('Analyse terminée ! Formulaire pré-rempli.');
        }
      }, 2000);
    } catch (error) {
      toast.error('Erreur lors de l\'analyse de l\'URL');
    }
  };

  const [formData, setFormData] = useState({
    // Rédaction
    title: 'Guide Complet SEO 2024 : Optimisation pour les Moteurs de Recherche',
    description: 'Découvrez les meilleures stratégies SEO 2024 pour améliorer votre référencement naturel et augmenter votre visibilité sur Google.',
    keywords: 'SEO, référencement naturel, optimisation Google, stratégies SEO 2024, marketing digital',
    h1: 'Guide Complet du SEO en 2024',
    h2Tags: [
      'Les Fondamentaux du Référencement Naturel',
      'Techniques d\'Optimisation On-Page',
      'Stratégies de Content Marketing',
      'Analyse de la Concurrence'
    ],
    content: 'Le SEO (Search Engine Optimization) est devenu un élément crucial pour toute stratégie de marketing digital. En 2024, les moteurs de recherche privilégient un contenu de qualité, une expérience utilisateur optimale et une structure technique impeccable. Ce guide vous accompagne dans l\'optimisation complète de votre présence en ligne.',
    
    // Optimisation
    focusKeyword: 'SEO 2024',
    targetUrl: 'https://monsite.com/guide-seo-2024',
    language: 'fr',
    country: 'FR',
    
    // Configuration
    robots: 'index,follow',
    canonical: 'https://monsite.com/guide-seo-2024',
    hreflang: [],
    
    // Liens
    internalLinks: [
      '/blog/techniques-seo',
      '/services/audit-seo',
      '/outils/analyse-mots-cles'
    ],
    externalLinks: [
      'https://developers.google.com/search',
      'https://search.google.com/search-console'
    ],
    
    // Images
    altTexts: [
      'Graphique des tendances SEO 2024',
      'Schéma d\'optimisation on-page',
      'Tableau de bord Google Analytics'
    ],
    imageUrls: [
      '/images/seo-trends-2024.jpg',
      '/images/on-page-optimization.png',
      '/images/analytics-dashboard.jpg'
    ],
    
    // Données structurées
    schemaType: 'Article',
    organizationName: 'MonSite Digital',
    
    // HTTP & réseau
    redirects: [
      '/ancien-guide-seo → /guide-seo-2024'
    ],
    sitemapUrl: 'https://monsite.com/sitemap.xml'
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generateSeoContent = () => {
    const generated = {
      metaTags: `<title>${formData.title}</title>
<meta name="description" content="${formData.description}">
<meta name="keywords" content="${formData.keywords}">
<meta name="robots" content="${formData.robots}">
${formData.canonical ? `<link rel="canonical" href="${formData.canonical}">` : ''}`,

      structuredData: {
        "@context": "https://schema.org",
        "@type": formData.schemaType,
        "headline": formData.title,
        "description": formData.description,
        "author": {
          "@type": "Organization",
          "name": formData.organizationName
        },
        "publisher": {
          "@type": "Organization",
          "name": formData.organizationName
        }
      },

      htmlStructure: `<h1>${formData.h1}</h1>
${formData.h2Tags.filter(h2 => h2.trim()).map(h2 => `<h2>${h2}</h2>`).join('\n')}

<p>${formData.content}</p>`,

      recommendations: [
        {
          type: formData.title.length >= 30 && formData.title.length <= 60 ? 'success' : 'warning',
          title: 'Titre SEO',
          description: `Longueur: ${formData.title.length} caractères ${formData.title.length >= 30 && formData.title.length <= 60 ? '✓' : '(optimal: 30-60)'}`
        },
        {
          type: formData.description.length >= 120 && formData.description.length <= 160 ? 'success' : 'warning',
          title: 'Meta Description',
          description: `Longueur: ${formData.description.length} caractères ${formData.description.length >= 120 && formData.description.length <= 160 ? '✓' : '(optimal: 120-160)'}`
        },
        {
          type: formData.focusKeyword && formData.title.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? 'success' : 'warning',
          title: 'Mot-clé principal',
          description: formData.focusKeyword && formData.title.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? 'Présent dans le titre ✓' : 'Absent du titre'
        }
      ]
    };

    setGeneratedContent(generated);
    toast.success('Contenu SEO généré avec succès !');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 Générateur SEO Complet
          </h1>
        </div>

        {/* URL Analysis Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analyser une URL existante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://monsite.com/ma-page"
                value={urlToAnalyze}
                onChange={(e) => setUrlToAnalyze(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={analyzeUrl} 
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyse...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Analysez une URL existante pour pré-remplir automatiquement le formulaire avec les données SEO détectées.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="redaction" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-7 text-xs">
                    <TabsTrigger value="redaction" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Rédaction
                    </TabsTrigger>
                    <TabsTrigger value="optimisation" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Optimisation
                    </TabsTrigger>
                    <TabsTrigger value="configuration" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Config
                    </TabsTrigger>
                    <TabsTrigger value="liens" className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      Liens
                    </TabsTrigger>
                    <TabsTrigger value="images" className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="donnees" className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      Données
                    </TabsTrigger>
                    <TabsTrigger value="reseau" className="flex items-center gap-1">
                      <Network className="h-3 w-3" />
                      Réseau
                    </TabsTrigger>
                  </TabsList>

                  {/* Onglet Rédaction */}
                  <TabsContent value="redaction" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Titre SEO</label>
                        <Input
                          placeholder="Titre optimisé pour le SEO (30-60 caractères)"
                          value={formData.title}
                          onChange={(e) => updateFormData('title', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.title.length}/60 caractères
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Meta Description</label>
                        <Textarea
                          placeholder="Description optimisée pour les moteurs de recherche (120-160 caractères)"
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.description.length}/160 caractères
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Mots-clés</label>
                        <Input
                          placeholder="mot-clé 1, mot-clé 2, mot-clé 3"
                          value={formData.keywords}
                          onChange={(e) => updateFormData('keywords', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Titre H1</label>
                        <Input
                          placeholder="Titre principal de la page"
                          value={formData.h1}
                          onChange={(e) => updateFormData('h1', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Titres H2</label>
                        {formData.h2Tags.map((h2, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder={`Titre H2 #${index + 1}`}
                              value={h2}
                              onChange={(e) => updateArrayItem('h2Tags', index, e.target.value)}
                            />
                            {formData.h2Tags.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('h2Tags', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('h2Tags')}
                        >
                          + Ajouter H2
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Contenu principal</label>
                        <Textarea
                          placeholder="Contenu optimisé avec mots-clés naturellement intégrés"
                          value={formData.content}
                          onChange={(e) => updateFormData('content', e.target.value)}
                          rows={5}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Optimisation */}
                  <TabsContent value="optimisation" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Mot-clé principal</label>
                        <Input
                          placeholder="Mot-clé à cibler"
                          value={formData.focusKeyword}
                          onChange={(e) => updateFormData('focusKeyword', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">URL cible</label>
                        <Input
                          placeholder="https://monsite.com/ma-page"
                          value={formData.targetUrl}
                          onChange={(e) => updateFormData('targetUrl', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Langue</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={formData.language}
                            onChange={(e) => updateFormData('language', e.target.value)}
                          >
                            <option value="fr">Français</option>
                            <option value="en">Anglais</option>
                            <option value="es">Espagnol</option>
                            <option value="de">Allemand</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Pays</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                          >
                            <option value="FR">France</option>
                            <option value="BE">Belgique</option>
                            <option value="CH">Suisse</option>
                            <option value="CA">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Configuration */}
                  <TabsContent value="configuration" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Robots.txt</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={formData.robots}
                          onChange={(e) => updateFormData('robots', e.target.value)}
                        >
                          <option value="index,follow">index,follow</option>
                          <option value="noindex,follow">noindex,follow</option>
                          <option value="index,nofollow">index,nofollow</option>
                          <option value="noindex,nofollow">noindex,nofollow</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">URL Canonique</label>
                        <Input
                          placeholder="https://monsite.com/page-principale"
                          value={formData.canonical}
                          onChange={(e) => updateFormData('canonical', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Liens */}
                  <TabsContent value="liens" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Liens internes</label>
                        {formData.internalLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder="/page-interne"
                              value={link}
                              onChange={(e) => updateArrayItem('internalLinks', index, e.target.value)}
                            />
                            {formData.internalLinks.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('internalLinks', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('internalLinks')}
                        >
                          + Ajouter lien interne
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Liens externes</label>
                        {formData.externalLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder="https://site-externe.com"
                              value={link}
                              onChange={(e) => updateArrayItem('externalLinks', index, e.target.value)}
                            />
                            {formData.externalLinks.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('externalLinks', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('externalLinks')}
                        >
                          + Ajouter lien externe
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Images */}
                  <TabsContent value="images" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">URLs d'images</label>
                        {formData.imageUrls.map((url, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder="/images/mon-image.jpg"
                              value={url}
                              onChange={(e) => updateArrayItem('imageUrls', index, e.target.value)}
                            />
                            {formData.imageUrls.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('imageUrls', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('imageUrls')}
                        >
                          + Ajouter image
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Textes Alt</label>
                        {formData.altTexts.map((alt, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder="Description de l'image pour l'accessibilité"
                              value={alt}
                              onChange={(e) => updateArrayItem('altTexts', index, e.target.value)}
                            />
                            {formData.altTexts.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('altTexts', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('altTexts')}
                        >
                          + Ajouter texte alt
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Données structurées */}
                  <TabsContent value="donnees" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type de Schema</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={formData.schemaType}
                          onChange={(e) => updateFormData('schemaType', e.target.value)}
                        >
                          <option value="Article">Article</option>
                          <option value="BlogPosting">Blog Post</option>
                          <option value="Product">Produit</option>
                          <option value="Organization">Organisation</option>
                          <option value="LocalBusiness">Entreprise locale</option>
                          <option value="Person">Personne</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Nom de l'organisation</label>
                        <Input
                          placeholder="Mon Entreprise"
                          value={formData.organizationName}
                          onChange={(e) => updateFormData('organizationName', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet HTTP & réseau */}
                  <TabsContent value="reseau" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Redirections</label>
                        {formData.redirects.map((redirect, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              placeholder="/ancienne-page -> /nouvelle-page"
                              value={redirect}
                              onChange={(e) => updateArrayItem('redirects', index, e.target.value)}
                            />
                            {formData.redirects.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('redirects', index)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayItem('redirects')}
                        >
                          + Ajouter redirection
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">URL Sitemap</label>
                        <Input
                          placeholder="https://monsite.com/sitemap.xml"
                          value={formData.sitemapUrl}
                          onChange={(e) => updateFormData('sitemapUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <div className="pt-4 border-t">
                    <Button onClick={generateSeoContent} className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Générer le contenu SEO
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {generatedContent && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Contenu généré
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Meta Tags</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.metaTags)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {generatedContent.metaTags}
                      </pre>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Structure HTML</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.htmlStructure)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {generatedContent.htmlStructure}
                      </pre>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Schema.org</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(generatedContent.structuredData, null, 2))}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40">
                        {JSON.stringify(generatedContent.structuredData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {generatedContent.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge variant={rec.type === 'success' ? 'default' : 'secondary'}>
                          {rec.type === 'success' ? '✓' : '!'}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoGeneratorPage;