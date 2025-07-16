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


const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const analyzeUrl = async () => {
    if (!urlToAnalyze.trim()) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }
    
    setIsLoading(true);
    try {
      // Essayer plusieurs APIs CORS proxy
      let data = null;
      const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(urlToAnalyze)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlToAnalyze)}`,
        `https://cors-anywhere.herokuapp.com/${urlToAnalyze}`
      ];
      
      for (const proxyUrl of proxies) {
        try {
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const text = await response.text();
            data = { contents: text };
            break;
          }
        } catch (e) {
          console.log(`Proxy ${proxyUrl} failed, trying next...`);
        }
      }
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Extraire les métadonnées avec différentes variantes
        const title = doc.querySelector('title')?.textContent || '';
        
        // Plusieurs façons de récupérer la description
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                          doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        
        // Plusieurs façons de récupérer les mots-clés
        const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || 
                        doc.querySelector('meta[name="Keywords"]')?.getAttribute('content') || 
                        doc.querySelector('meta[property="keywords"]')?.getAttribute('content') || '';
        
        const h1 = doc.querySelector('h1')?.textContent || '';
        const h2Elements = Array.from(doc.querySelectorAll('h2')).map(h2 => h2.textContent || '').filter(text => text.length > 0);
        
        // Extraire plus d'informations pour l'analyse
        const metaTags = Array.from(doc.querySelectorAll('meta')).map(tag => ({
          name: tag.getAttribute('name') || tag.getAttribute('property') || '',
          content: tag.getAttribute('content') || ''
        }));
        
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        
        // Analyser le contenu pour des suggestions
        const pageText = doc.body?.textContent || '';
        const wordCount = pageText.split(/\s+/).length;
        const images = Array.from(doc.querySelectorAll('img'));
        const imagesWithoutAlt = images.filter(img => !img.getAttribute('alt'));
        
        // Stocker les données extraites pour l'affichage
        const extractedInfo = {
          title,
          description,
          keywords,
          h1,
          h2Elements,
          url: urlToAnalyze,
          metaTags,
          ogTitle,
          ogDescription,
          analysis: {
            titleLength: title.length,
            descriptionLength: description.length,
            hasH1: !!h1,
            h2Count: h2Elements.length,
            wordCount,
            imagesCount: images.length,
            imagesWithoutAlt: imagesWithoutAlt.length,
            hasKeywords: !!keywords,
            hasOgTags: !!ogTitle || !!ogDescription
          }
        };
        setExtractedData(extractedInfo);
        
        // Pré-remplir le formulaire avec les données extraites
        setFormData(prev => ({
          ...prev,
          title: title || `SEO Optimisé pour ${urlToAnalyze}`,
          description: description || `Optimisation SEO complète pour améliorer le référencement de votre site web.`,
          keywords: keywords || 'seo, référencement, optimisation, web',
          h1: h1 || title || 'Titre Principal SEO',
          h2Tags: h2Elements.length > 0 ? h2Elements : ['Section Important', 'Avantages Clés'],
          targetUrl: urlToAnalyze,
          canonical: urlToAnalyze,
        }));
        
        toast.success('Analyse terminée ! Données extraites et suggestions générées.');
      } else {
        throw new Error('Impossible d\'extraire le contenu');
      }
    } catch (error) {
      console.error('Erreur analyse URL:', error);
      toast.error('Erreur lors de l\'analyse. Formulaire pré-rempli avec des données par défaut.');
      
      // Pré-remplir avec des données par défaut basées sur l'URL
      const domain = new URL(urlToAnalyze).hostname;
      setFormData(prev => ({
        ...prev,
        title: `Guide SEO Complet pour ${domain} - Optimisation 2024`,
        description: `Découvrez comment optimiser ${domain} pour les moteurs de recherche avec notre guide SEO complet et nos techniques avancées.`,
        keywords: `${domain}, seo, référencement, optimisation, marketing digital`,
        h1: `Optimisation SEO pour ${domain}`,
        h2Tags: ['Stratégie SEO', 'Mots-clés ciblés', 'Optimisation technique', 'Contenu de qualité'],
        targetUrl: urlToAnalyze,
        canonical: urlToAnalyze,
      }));
    } finally {
      setIsLoading(false);
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

  const [extractedData, setExtractedData] = useState<any>(null);

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

        {/* Extracted Data Display */}
        {extractedData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Données extraites de {extractedData.url}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Titre de la page</h4>
                  <p className="text-sm bg-muted p-2 rounded">{extractedData.title || 'Non trouvé'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Meta Description</h4>
                  <p className="text-sm bg-muted p-2 rounded">{extractedData.description || 'Non trouvée'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">H1 Principal</h4>
                  <p className="text-sm bg-muted p-2 rounded">{extractedData.h1 || 'Non trouvé'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Mots-clés Meta</h4>
                  <p className="text-sm bg-muted p-2 rounded">{extractedData.keywords || 'Non trouvés'}</p>
                </div>
                
                {extractedData.h2Elements && extractedData.h2Elements.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-sm mb-2">Titres H2 détectés</h4>
                    <div className="space-y-1">
                      {extractedData.h2Elements.map((h2, index) => (
                        <p key={index} className="text-sm bg-muted p-2 rounded">{h2}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Analysis & Suggestions */}
              {extractedData.analysis && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Analyse SEO et suggestions d'amélioration
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Titre */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Titre</span>
                        <Badge variant={extractedData.analysis.titleLength >= 30 && extractedData.analysis.titleLength <= 60 ? 'default' : 'destructive'}>
                          {extractedData.analysis.titleLength >= 30 && extractedData.analysis.titleLength <= 60 ? '✓' : '!'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.titleLength} caractères 
                        {extractedData.analysis.titleLength < 30 && ' (trop court, recommandé: 30-60)'}
                        {extractedData.analysis.titleLength > 60 && ' (trop long, recommandé: 30-60)'}
                        {extractedData.analysis.titleLength >= 30 && extractedData.analysis.titleLength <= 60 && ' (optimal)'}
                      </p>
                    </div>
                    
                    {/* Description */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Meta Description</span>
                        <Badge variant={extractedData.analysis.descriptionLength >= 120 && extractedData.analysis.descriptionLength <= 160 ? 'default' : 'destructive'}>
                          {extractedData.analysis.descriptionLength >= 120 && extractedData.analysis.descriptionLength <= 160 ? '✓' : '!'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.descriptionLength} caractères
                        {extractedData.analysis.descriptionLength < 120 && ' (trop courte, recommandé: 120-160)'}
                        {extractedData.analysis.descriptionLength > 160 && ' (trop longue, recommandé: 120-160)'}
                        {extractedData.analysis.descriptionLength >= 120 && extractedData.analysis.descriptionLength <= 160 && ' (optimal)'}
                      </p>
                    </div>
                    
                    {/* H1 */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Titre H1</span>
                        <Badge variant={extractedData.analysis.hasH1 ? 'default' : 'destructive'}>
                          {extractedData.analysis.hasH1 ? '✓' : '!'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.hasH1 ? 'H1 présent' : 'Aucun H1 trouvé (recommandé)'}
                      </p>
                    </div>
                    
                    {/* H2 */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Structure H2</span>
                        <Badge variant={extractedData.analysis.h2Count > 0 ? 'default' : 'secondary'}>
                          {extractedData.analysis.h2Count > 0 ? '✓' : 'i'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.h2Count} titre(s) H2 trouvé(s)
                        {extractedData.analysis.h2Count === 0 && ' (recommandé pour structurer le contenu)'}
                      </p>
                    </div>
                    
                    {/* Mots-clés */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Mots-clés Meta</span>
                        <Badge variant={extractedData.analysis.hasKeywords ? 'default' : 'secondary'}>
                          {extractedData.analysis.hasKeywords ? '✓' : 'i'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.hasKeywords ? 'Mots-clés présents' : 'Aucun mot-clé meta (optionnel en 2024)'}
                      </p>
                    </div>
                    
                    {/* Open Graph */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Open Graph</span>
                        <Badge variant={extractedData.analysis.hasOgTags ? 'default' : 'destructive'}>
                          {extractedData.analysis.hasOgTags ? '✓' : '!'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.hasOgTags ? 'Tags OG présents' : 'Tags Open Graph manquants (recommandé pour les réseaux sociaux)'}
                      </p>
                    </div>
                    
                    {/* Images */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Images</span>
                        <Badge variant={extractedData.analysis.imagesWithoutAlt === 0 ? 'default' : 'destructive'}>
                          {extractedData.analysis.imagesWithoutAlt === 0 ? '✓' : '!'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {extractedData.analysis.imagesCount} image(s), {extractedData.analysis.imagesWithoutAlt} sans attribut alt
                        {extractedData.analysis.imagesWithoutAlt > 0 && ' (ajouter des descriptions alt pour l\'accessibilité)'}
                      </p>
                    </div>
                    
                    {/* Contenu */}
                    <div className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Contenu</span>
                        <Badge variant={extractedData.analysis.wordCount >= 300 ? 'default' : 'secondary'}>
                          {extractedData.analysis.wordCount >= 300 ? '✓' : 'i'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ~{extractedData.analysis.wordCount} mots
                        {extractedData.analysis.wordCount < 300 && ' (recommandé: +300 mots pour le SEO)'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Suggestions principales */}
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">📋 Suggestions prioritaires :</h5>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      {!extractedData.analysis.hasOgTags && (
                        <li>• Ajouter les balises Open Graph (og:title, og:description, og:image)</li>
                      )}
                      {extractedData.analysis.titleLength < 30 && (
                        <li>• Allonger le titre (actuellement {extractedData.analysis.titleLength} caractères, optimal: 30-60)</li>
                      )}
                      {extractedData.analysis.titleLength > 60 && (
                        <li>• Raccourcir le titre (actuellement {extractedData.analysis.titleLength} caractères, optimal: 30-60)</li>
                      )}
                      {extractedData.analysis.descriptionLength < 120 && (
                        <li>• Étoffer la meta description (actuellement {extractedData.analysis.descriptionLength} caractères, optimal: 120-160)</li>
                      )}
                      {extractedData.analysis.descriptionLength > 160 && (
                        <li>• Raccourcir la meta description (actuellement {extractedData.analysis.descriptionLength} caractères, optimal: 120-160)</li>
                      )}
                      {!extractedData.analysis.hasH1 && (
                        <li>• Ajouter un titre H1 principal à la page</li>
                      )}
                      {extractedData.analysis.h2Count === 0 && (
                        <li>• Structurer le contenu avec des titres H2</li>
                      )}
                      {extractedData.analysis.imagesWithoutAlt > 0 && (
                        <li>• Ajouter des attributs alt aux {extractedData.analysis.imagesWithoutAlt} image(s) manquante(s)</li>
                      )}
                      {extractedData.analysis.wordCount < 300 && (
                        <li>• Enrichir le contenu textuel (actuellement ~{extractedData.analysis.wordCount} mots, recommandé: +300)</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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