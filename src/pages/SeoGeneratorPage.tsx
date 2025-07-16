import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Settings, Link, Image, Code, Network, Zap, Copy, Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Rédaction
    title: '',
    description: '',
    keywords: '',
    h1: '',
    h2Tags: [''],
    content: '',
    
    // Optimisation
    focusKeyword: '',
    targetUrl: '',
    language: 'fr',
    country: 'FR',
    
    // Configuration
    robots: 'index,follow',
    canonical: '',
    hreflang: [],
    
    // Liens
    internalLinks: [''],
    externalLinks: [''],
    
    // Images
    altTexts: [''],
    imageUrls: [''],
    
    // Données structurées
    schemaType: 'Article',
    organizationName: '',
    
    // HTTP & réseau
    redirects: [''],
    sitemapUrl: ''
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