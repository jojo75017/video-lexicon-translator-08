import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Globe, ExternalLink, Loader2, Copy, Download, ArrowLeft, TrendingUp, Image, Video, MapPin, Clock, Star, Users, Eye, BarChart, Target, Filter, Sparkles, Brain, HelpCircle, LinkIcon, FileText, Bookmark, Calendar, Shield } from "lucide-react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SerpResult {
  position: number;
  title: string;
  url: string;
  domain: string;
  description: string;
  type: 'organic' | 'featured' | 'video' | 'image' | 'local' | 'shopping';
  features?: string[];
  rating?: number;
  reviews?: number;
  date?: string;
  author?: string;
  breadcrumbs?: string[];
  sitelinks?: Array<{ title: string; url: string; description: string }>;
  snippet?: {
    type: 'paragraph' | 'list' | 'table' | 'faq';
    content: string[];
  };
}

interface RelatedSearch {
  query: string;
  trend: 'up' | 'down' | 'stable';
  volume: number;
}

interface SerpFeature {
  type: string;
  title: string;
  description: string;
  present: boolean;
}

interface SerpAnalysis {
  totalResults: number;
  competitionLevel: 'low' | 'medium' | 'high';
  avgTitleLength: number;
  avgDescriptionLength: number;
  topDomains: Array<{ domain: string; count: number; percentage: number }>;
  features: SerpFeature[];
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  difficulty: number;
}

const SerpGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serpResults, setSerpResults] = useState<SerpResult[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<RelatedSearch[]>([]);
  const [serpAnalysis, setSerpAnalysis] = useState<SerpAnalysis | null>(null);
  const [peopleAlsoAsk, setPeopleAlsoAsk] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState('France');
  const [searchDevice, setSearchDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [activeTab, setActiveTab] = useState<'results' | 'analysis' | 'features' | 'export'>('results');

  const generateAdvancedSerpResults = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Génération de résultats SERP avancés avec différents types
      const serpSites = [
        { 
          domain: 'fr.wikipedia.org', 
          name: 'Wikipedia', 
          description: 'Encyclopédie collaborative',
          type: 'organic' as const,
          features: ['rich-snippet', 'knowledge-panel'],
          rating: 4.8,
          reviews: 25600,
          date: '2024-01-15'
        },
        { 
          domain: 'www.youtube.com', 
          name: 'YouTube', 
          description: 'Plateforme de vidéos',
          type: 'video' as const,
          features: ['video-thumbnail', 'duration'],
          rating: 4.6,
          reviews: 15420
        },
        { 
          domain: 'www.tripadvisor.fr', 
          name: 'TripAdvisor', 
          description: 'Avis et conseils de voyage',
          type: 'local' as const,
          features: ['reviews', 'rating-stars', 'local-pack'],
          rating: 4.3,
          reviews: 8950
        },
        { 
          domain: 'www.booking.com', 
          name: 'Booking.com', 
          description: 'Réservation d\'hôtels',
          type: 'shopping' as const,
          features: ['price', 'availability', 'sitelinks'],
          rating: 4.2,
          reviews: 12340
        },
        { 
          domain: 'www.lemonde.fr', 
          name: 'Le Monde', 
          description: 'Journal d\'information',
          type: 'organic' as const,
          features: ['news-box', 'date'],
          date: '2024-01-20'
        },
        { 
          domain: 'www.voyage-prive.com', 
          name: 'Voyage Privé', 
          description: 'Ventes flash voyages',
          type: 'shopping' as const,
          features: ['price', 'discount', 'limited-time'],
          rating: 4.1,
          reviews: 3200
        },
        { 
          domain: 'images.google.com', 
          name: 'Google Images', 
          description: 'Recherche d\'images',
          type: 'image' as const,
          features: ['image-pack', 'carousel']
        },
        { 
          domain: 'www.instagram.com', 
          name: 'Instagram', 
          description: 'Réseau social photos',
          type: 'organic' as const,
          features: ['social-media', 'hashtags'],
          rating: 4.5,
          reviews: 89000
        },
        { 
          domain: 'www.expedia.fr', 
          name: 'Expedia', 
          description: 'Agence de voyage en ligne',
          type: 'shopping' as const,
          features: ['price-comparison', 'deals', 'sitelinks'],
          rating: 4.0,
          reviews: 5670
        },
        { 
          domain: 'www.routard.com', 
          name: 'Le Routard', 
          description: 'Guide de voyage',
          type: 'organic' as const,
          features: ['guide', 'tips', 'breadcrumbs'],
          rating: 4.4,
          reviews: 2890
        }
      ];

      const results: SerpResult[] = serpSites.map((site, index) => {
        const position = index + 1;
        const isTopResult = position <= 3;
        
        return {
          position,
          title: generateTitle(site.name, keyword, isTopResult),
          url: `https://${site.domain}`,
          domain: site.domain,
          description: generateDescription(site.description, keyword, site.type),
          type: site.type,
          features: site.features,
          rating: site.rating,
          reviews: site.reviews,
          date: site.date,
          author: generateAuthor(site.type),
          breadcrumbs: generateBreadcrumbs(site.domain, keyword),
          sitelinks: position <= 2 ? generateSitelinks(site.domain, keyword) : undefined,
          snippet: generateSnippet(site.type, keyword)
        };
      });

      // Génération des recherches associées
      const related: RelatedSearch[] = [
        { query: `${keyword} prix`, trend: 'up', volume: 8900 },
        { query: `${keyword} avis`, trend: 'stable', volume: 6700 },
        { query: `${keyword} 2024`, trend: 'up', volume: 12400 },
        { query: `meilleur ${keyword}`, trend: 'up', volume: 5600 },
        { query: `${keyword} pas cher`, trend: 'stable', volume: 9800 },
        { query: `${keyword} comparaison`, trend: 'down', volume: 3400 },
        { query: `guide ${keyword}`, trend: 'up', volume: 4200 },
        { query: `${keyword} conseils`, trend: 'stable', volume: 3800 }
      ];

      // Questions relatives (People Also Ask)
      const questions = [
        `Quelle est la durée idéale pour ${keyword.toLowerCase()} ?`,
        `Combien coûte ${keyword.toLowerCase()} ?`,
        `Quelle est la meilleure période pour ${keyword.toLowerCase()} ?`,
        `Que faut-il savoir avant ${keyword.toLowerCase()} ?`,
        `Comment organiser ${keyword.toLowerCase()} ?`,
        `Quels sont les incontournables de ${keyword.toLowerCase()} ?`
      ];

      // Analyse SERP avancée
      const analysis: SerpAnalysis = {
        totalResults: 2840000,
        competitionLevel: 'high',
        avgTitleLength: Math.floor(results.reduce((acc, r) => acc + r.title.length, 0) / results.length),
        avgDescriptionLength: Math.floor(results.reduce((acc, r) => acc + r.description.length, 0) / results.length),
        topDomains: calculateTopDomains(results),
        features: generateSerpFeatures(results),
        intent: determineSearchIntent(keyword),
        difficulty: Math.floor(Math.random() * 40) + 60
      };

      setSerpResults(results);
      setRelatedSearches(related);
      setPeopleAlsoAsk(questions);
      setSerpAnalysis(analysis);
      toast.success(`✅ ${results.length} résultats SERP générés avec analyse complète`);
      
    } catch (error) {
      console.error('Erreur génération SERP:', error);
      toast.error('❌ Erreur lors de la génération des résultats');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTitle = (siteName: string, keyword: string, isTopResult: boolean): string => {
    const templates = isTopResult ? [
      `${keyword} - Guide Complet 2024 | ${siteName}`,
      `Tout savoir sur ${keyword} | ${siteName}`,
      `${keyword} : Les Meilleures Options | ${siteName}`
    ] : [
      `${siteName} - ${keyword} | Découvrez nos offres`,
      `${keyword} sur ${siteName} | Réservation en ligne`,
      `${siteName} : ${keyword} au meilleur prix`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateDescription = (siteDesc: string, keyword: string, type: string): string => {
    const templates = {
      organic: `Découvrez tout sur ${keyword.toLowerCase()}. ${siteDesc} avec des informations détaillées, conseils pratiques et recommandations d'experts.`,
      video: `Regardez les meilleures vidéos sur ${keyword.toLowerCase()}. ${siteDesc} avec des tutoriels, guides et témoignages.`,
      shopping: `Trouvez les meilleures offres pour ${keyword.toLowerCase()}. ${siteDesc} avec comparaison de prix et avis clients.`,
      local: `${keyword} près de chez vous. ${siteDesc} avec avis, photos et informations pratiques.`,
      image: `Images de ${keyword.toLowerCase()}. ${siteDesc} haute qualité et libre de droits.`,
      featured: `Guide complet ${keyword.toLowerCase()}. ${siteDesc} avec tout ce qu'il faut savoir.`
    };
    return templates[type as keyof typeof templates] || templates.organic;
  };

  const generateAuthor = (type: string): string | undefined => {
    if (type === 'organic') {
      const authors = ['Marie Dubois', 'Pierre Martin', 'Sophie Laurent', 'Thomas Bernard'];
      return authors[Math.floor(Math.random() * authors.length)];
    }
    return undefined;
  };

  const generateBreadcrumbs = (domain: string, keyword: string): string[] => {
    return [domain.replace('www.', ''), 'Guide', keyword];
  };

  const generateSitelinks = (domain: string, keyword: string) => {
    return [
      { title: `${keyword} - Prix`, url: `https://${domain}/prix`, description: 'Comparez les prix et trouvez les meilleures offres' },
      { title: `${keyword} - Avis`, url: `https://${domain}/avis`, description: 'Lisez les avis et témoignages clients' },
      { title: `${keyword} - Guide`, url: `https://${domain}/guide`, description: 'Guide complet et conseils pratiques' }
    ];
  };

  const generateSnippet = (type: string, keyword: string) => {
    const snippets = {
      faq: {
        type: 'faq' as const,
        content: [
          `Q: Qu'est-ce que ${keyword.toLowerCase()} ?`,
          `R: ${keyword} est une excellente option pour...`,
          `Q: Combien coûte ${keyword.toLowerCase()} ?`,
          `R: Les prix varient entre 50€ et 200€ selon...`
        ]
      },
      list: {
        type: 'list' as const,
        content: [
          `Top 5 des meilleurs ${keyword.toLowerCase()}`,
          '1. Option premium avec excellent rapport qualité-prix',
          '2. Alternative économique très appréciée',
          '3. Choix haut de gamme pour les exigeants'
        ]
      }
    };
    
    return Math.random() > 0.5 ? snippets.faq : snippets.list;
  };

  const calculateTopDomains = (results: SerpResult[]) => {
    const domainCount: { [key: string]: number } = {};
    results.forEach(result => {
      const rootDomain = result.domain.replace('www.', '').split('.')[0];
      domainCount[rootDomain] = (domainCount[rootDomain] || 0) + 1;
    });
    
    return Object.entries(domainCount)
      .map(([domain, count]) => ({
        domain,
        count,
        percentage: Math.round((count / results.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateSerpFeatures = (results: SerpResult[]): SerpFeature[] => {
    const allFeatures = results.flatMap(r => r.features || []);
    const featureTypes = [
      { type: 'rich-snippet', title: 'Rich Snippets', description: 'Extraits enrichis avec informations structurées' },
      { type: 'knowledge-panel', title: 'Knowledge Panel', description: 'Panneau de connaissances à droite' },
      { type: 'video-thumbnail', title: 'Miniatures Vidéo', description: 'Aperçus vidéos dans les résultats' },
      { type: 'local-pack', title: 'Pack Local', description: 'Résultats locaux avec carte' },
      { type: 'image-pack', title: 'Pack Images', description: 'Galerie d\'images liées' },
      { type: 'sitelinks', title: 'Liens de Site', description: 'Liens supplémentaires sous le résultat principal' },
      { type: 'reviews', title: 'Avis', description: 'Notes et commentaires clients' },
      { type: 'price', title: 'Prix', description: 'Informations de prix et comparaisons' }
    ];

    return featureTypes.map(feature => ({
      ...feature,
      present: allFeatures.includes(feature.type)
    }));
  };

  const determineSearchIntent = (keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' => {
    const transactionalWords = ['acheter', 'prix', 'tarif', 'commande', 'réserver'];
    const informationalWords = ['comment', 'pourquoi', 'guide', 'conseil', 'définition'];
    const commercialWords = ['meilleur', 'comparaison', 'avis', 'top', 'vs'];
    
    const lowerKeyword = keyword.toLowerCase();
    
    if (transactionalWords.some(word => lowerKeyword.includes(word))) return 'transactional';
    if (informationalWords.some(word => lowerKeyword.includes(word))) return 'informational';
    if (commercialWords.some(word => lowerKeyword.includes(word))) return 'commercial';
    
    return 'informational';
  };

  const copyUrls = () => {
    const urls = serpResults.map(result => result.url).join('\n');
    navigator.clipboard.writeText(urls);
    toast.success('URLs copiées dans le presse-papier');
  };

  const copyRelatedSearches = () => {
    const searches = relatedSearches.map(search => search.query).join('\n');
    navigator.clipboard.writeText(searches);
    toast.success('Recherches associées copiées');
  };

  const exportAdvancedData = () => {
    const data = {
      keyword,
      searchLocation,
      searchDevice,
      timestamp: new Date().toISOString(),
      results: serpResults,
      relatedSearches,
      peopleAlsoAsk,
      analysis: serpAnalysis,
      totalResults: serpResults.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serp-advanced-${keyword.replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Analyse SERP complète exportée');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-red-500" />;
      case 'image': return <Image className="h-4 w-4 text-blue-500" />;
      case 'local': return <MapPin className="h-4 w-4 text-green-500" />;
      case 'shopping': return <Target className="h-4 w-4 text-orange-500" />;
      case 'featured': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🔍 Analyseur SERP Avancé
          </h1>
        </div>
        
        <div className="space-y-6">
          {/* Configuration de recherche */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Configuration de Recherche SERP
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Analysez les résultats de recherche avec des fonctionnalités avancées
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Entrez votre mot-clé..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateAdvancedSerpResults()}
                  />
                  <Input
                    placeholder="Localisation"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={searchDevice}
                    onChange={(e) => setSearchDevice(e.target.value as 'desktop' | 'mobile' | 'tablet')}
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablette</option>
                  </select>
                </div>
                
                <Button onClick={generateAdvancedSerpResults} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyser SERP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onglets de navigation */}
          {serpResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'results', label: 'Résultats', icon: Globe },
                    { id: 'analysis', label: 'Analyse', icon: BarChart },
                    { id: 'features', label: 'Fonctionnalités', icon: Sparkles },
                    { id: 'export', label: 'Export', icon: Download }
                  ].map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {/* Onglet Résultats */}
                {activeTab === 'results' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Résultats SERP - "{keyword}"</h3>
                      <Badge variant="outline">{serpResults.length} résultats</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {serpResults.map((result) => (
                        <div key={result.position} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <Badge variant="outline" className="w-8 h-6 flex items-center justify-center text-xs shrink-0">
                              {result.position}
                            </Badge>
                            
                            <div className="flex-1 space-y-3">
                              {/* En-tête avec domaine et type */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-green-600 font-medium">{result.domain}</span>
                                {getTypeIcon(result.type)}
                                <Badge variant="outline">{result.type}</Badge>
                                {result.features && result.features.length > 0 && (
                                  <div className="flex gap-1">
                                    {result.features.slice(0, 2).map(feature => (
                                      <Badge key={feature} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Fil d'Ariane */}
                              {result.breadcrumbs && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {result.breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && <span>›</span>}
                                      <span>{crumb}</span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                              
                              {/* Titre */}
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <h3 className="font-medium text-blue-600 hover:underline cursor-pointer text-lg">
                                  {result.title}
                                </h3>
                              </a>
                              
                              {/* Métadonnées */}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {result.date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(result.date).toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                                {result.author && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {result.author}
                                  </div>
                                )}
                                {result.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {result.rating}/5 ({result.reviews?.toLocaleString()} avis)
                                  </div>
                                )}
                              </div>
                              
                              {/* Description */}
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {result.description}
                              </p>
                              
                              {/* Snippet enrichi */}
                              {result.snippet && (
                                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">Extrait enrichi</span>
                                  </div>
                                  {result.snippet.content.map((line, index) => (
                                    <p key={index} className="text-sm text-muted-foreground">
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              )}
                              
                              {/* Sitelinks */}
                              {result.sitelinks && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                                  {result.sitelinks.map((sitelink, index) => (
                                    <a
                                      key={index}
                                      href={sitelink.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-muted/30 rounded text-xs hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="font-medium text-blue-600">{sitelink.title}</div>
                                      <div className="text-muted-foreground">{sitelink.description}</div>
                                    </a>
                                  ))}
                                </div>
                              )}
                              
                              {/* URL */}
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline font-mono bg-muted px-2 py-1 rounded inline-block"
                              >
                                {result.url}
                              </a>
                            </div>
                            
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Recherches associées */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          Recherches associées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {relatedSearches.map((search, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div className="flex items-center gap-2">
                                {getTrendIcon(search.trend)}
                                <span className="text-sm">{search.query}</span>
                              </div>
                              <Badge variant="outline">
                                {search.volume.toLocaleString()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={copyRelatedSearches} className="mt-3">
                          <Copy className="h-4 w-4 mr-2" />
                          Copier recherches associées
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Questions relatives */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5" />
                          Questions relatives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {peopleAlsoAsk.map((question, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded">
                              <p className="text-sm font-medium">{question}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Onglet Analyse */}
                {activeTab === 'analysis' && serpAnalysis && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Analyse SERP Détaillée</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {serpAnalysis.totalResults.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Résultats totaux</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">
                            {serpAnalysis.difficulty}/100
                          </div>
                          <div className="text-sm text-muted-foreground">Difficulté SEO</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {serpAnalysis.avgTitleLength}
                          </div>
                          <div className="text-sm text-muted-foreground">Titre moyen (chars)</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-purple-600 capitalize">
                            {serpAnalysis.intent}
                          </div>
                          <div className="text-sm text-muted-foreground">Intention de recherche</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Domaines dominants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {serpAnalysis.topDomains.map((domain, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="font-medium">{domain.domain}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${domain.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {domain.percentage}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Onglet Fonctionnalités */}
                {activeTab === 'features' && serpAnalysis && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Fonctionnalités SERP Détectées</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serpAnalysis.features.map((feature, index) => (
                        <Card key={index} className={feature.present ? 'border-green-500' : 'border-muted'}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${feature.present ? 'bg-green-500' : 'bg-muted'}`} />
                              <div className="flex-1">
                                <div className="font-medium">{feature.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {feature.description}
                                </div>
                              </div>
                              {feature.present && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Présent
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Onglet Export */}
                {activeTab === 'export' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Options d'Export</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" onClick={copyUrls} className="h-auto p-4">
                        <div className="text-center">
                          <Copy className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Copier URLs</div>
                          <div className="text-sm text-muted-foreground">
                            {serpResults.length} URLs des résultats
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" onClick={copyRelatedSearches} className="h-auto p-4">
                        <div className="text-center">
                          <Brain className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Copier Recherches</div>
                          <div className="text-sm text-muted-foreground">
                            {relatedSearches.length} recherches associées
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" onClick={exportAdvancedData} className="h-auto p-4">
                        <div className="text-center">
                          <Download className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Export Complet JSON</div>
                          <div className="text-sm text-muted-foreground">
                            Analyse complète avec métadonnées
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" onClick={() => {
                        const csv = [
                          'Position,Titre,URL,Domaine,Type,Rating,Reviews',
                          ...serpResults.map(r => 
                            `${r.position},"${r.title}","${r.url}","${r.domain}","${r.type}","${r.rating || ''}","${r.reviews || ''}"`
                          )
                        ].join('\n');
                        
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `serp-${keyword.replace(/\s+/g, '-')}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('CSV exporté');
                      }} className="h-auto p-4">
                        <div className="text-center">
                          <FileText className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">Export CSV</div>
                          <div className="text-sm text-muted-foreground">
                            Données principales en CSV
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SerpGenerator;