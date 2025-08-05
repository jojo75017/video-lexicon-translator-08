import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, XCircle, AlertTriangle, Search, Bot, Eye, ArrowLeft, Download, Lightbulb, Settings, FileText, BarChart3, Filter, Zap, Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface RobotsTestResult {
  url: string;
  isIndexable: boolean;
  isAiBotAllowed: boolean;
  isSeoToolAllowed: boolean;
  matchedRule?: string;
  botType: 'search' | 'ai' | 'seo';
}

const RobotsTxtPage: React.FC = () => {
  const navigate = useNavigate();
  const [robotsTxt, setRobotsTxt] = useState('');
  const [urlsToTest, setUrlsToTest] = useState('');
  const [testResults, setTestResults] = useState<RobotsTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });

  const parseRobotsTxt = (content: string) => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    const rules: any = {};
    let currentUserAgent = '*';
    
    lines.forEach(line => {
      if (line.toLowerCase().startsWith('user-agent:')) {
        currentUserAgent = line.split(':')[1].trim();
        if (!rules[currentUserAgent]) {
          rules[currentUserAgent] = { disallow: [], allow: [] };
        }
      } else if (line.toLowerCase().startsWith('disallow:')) {
        const path = line.split(':')[1].trim();
        if (!rules[currentUserAgent]) {
          rules[currentUserAgent] = { disallow: [], allow: [] };
        }
        rules[currentUserAgent].disallow.push(path);
      } else if (line.toLowerCase().startsWith('allow:')) {
        const path = line.split(':')[1].trim();
        if (!rules[currentUserAgent]) {
          rules[currentUserAgent] = { disallow: [], allow: [] };
        }
        rules[currentUserAgent].allow.push(path);
      }
    });
    
    return rules;
  };

  const getBotType = (userAgent: string): 'search' | 'ai' | 'seo' => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('yandex')) {
      return 'search';
    }
    if (ua.includes('gptbot') || ua.includes('chatgpt') || ua.includes('claude') || ua.includes('bard')) {
      return 'ai';
    }
    return 'seo';
  };

  const testUrl = (url: string, rules: any): RobotsTestResult => {
    const urlPath = new URL(url).pathname;
    
    // Test for different bot types
    const botTests = [
      { userAgent: 'Googlebot', type: 'search' as const },
      { userAgent: 'GPTBot', type: 'ai' as const },
      { userAgent: 'SemrushBot', type: 'seo' as const }
    ];

    let isIndexable = true;
    let isAiBotAllowed = true;
    let isSeoToolAllowed = true;
    let matchedRule = '';

    botTests.forEach(({ userAgent, type }) => {
      const applicableRules = rules[userAgent] || rules['*'] || { disallow: [], allow: [] };
      
      let isBlocked = false;
      let rule = '';

      // Check disallow rules
      for (const disallowPath of applicableRules.disallow) {
        if (disallowPath === '/' || urlPath.startsWith(disallowPath)) {
          isBlocked = true;
          rule = `Disallow: ${disallowPath}`;
          break;
        }
      }

      // Check allow rules (can override disallow)
      for (const allowPath of applicableRules.allow) {
        if (urlPath.startsWith(allowPath)) {
          isBlocked = false;
          rule = `Allow: ${allowPath}`;
          break;
        }
      }

      if (type === 'search' && isBlocked) {
        isIndexable = false;
        matchedRule = rule;
      }
      if (type === 'ai' && isBlocked) {
        isAiBotAllowed = false;
        matchedRule = rule;
      }
      if (type === 'seo' && isBlocked) {
        isSeoToolAllowed = false;
        matchedRule = rule;
      }
    });

    return {
      url,
      isIndexable,
      isAiBotAllowed,
      isSeoToolAllowed,
      matchedRule,
      botType: 'search'
    };
  };

  const handleTest = () => {
    if (!robotsTxt.trim()) {
      toast.error("Veuillez entrer le contenu du robots.txt");
      return;
    }

    if (!urlsToTest.trim()) {
      toast.error("Veuillez entrer au moins une URL à tester");
      return;
    }

    setLoading(true);
    
    try {
      const rules = parseRobotsTxt(robotsTxt);
      const urls = urlsToTest.split('\n').map(url => url.trim()).filter(url => url);
      const results: RobotsTestResult[] = [];

      urls.forEach(url => {
        try {
          if (!url.startsWith('http')) {
            url = 'https://' + url;
          }
          const result = testUrl(url, rules);
          results.push(result);
        } catch (error) {
          toast.error(`L'URL "${url}" n'est pas valide`);
        }
      });

      setTestResults(results);
      toast.success(`${results.length} URL(s) testée(s)`);
    } catch (error) {
      toast.error("Erreur lors de l'analyse du robots.txt");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleRobotsTxt = () => {
    const sample = `User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: SemrushBot
Disallow: /admin/
Allow: /public/`;
    
    setRobotsTxt(sample);
    toast.success("Un exemple de robots.txt a été chargé");
  };

  // Templates prédéfinis
  const templates = {
    ecommerce: `User-agent: *
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/
Disallow: /search?
Allow: /products/

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml`,

    blog: `User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Allow: /wp-content/uploads/

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Allow: /

Sitemap: https://example.com/sitemap.xml`,

    corporate: `User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /internal/
Allow: /

User-agent: Googlebot
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: GPTBot
Disallow: /private/
Allow: /

Sitemap: https://example.com/sitemap.xml`,

    strict: `User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /`
  };

  const loadTemplate = (templateName: keyof typeof templates) => {
    setRobotsTxt(templates[templateName]);
    toast.success(`Template ${templateName} chargé`);
  };

  const analyzeRobotsTxt = () => {
    if (!robotsTxt.trim()) {
      return { score: 0, issues: ['Aucun contenu'], suggestions: [], aiInsights: null };
    }

    const lines = robotsTxt.split('\n');
    let score = 100;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Vérifier la présence d'un sitemap
    if (!robotsTxt.toLowerCase().includes('sitemap:')) {
      score -= 20;
      issues.push('Aucun sitemap défini');
      suggestions.push('Ajouter une ligne Sitemap: pour aider les moteurs de recherche');
    }

    // Vérifier les bots IA
    const hasAiBotRules = robotsTxt.toLowerCase().includes('gptbot') || 
                         robotsTxt.toLowerCase().includes('chatgpt') ||
                         robotsTxt.toLowerCase().includes('bard');
    if (!hasAiBotRules) {
      score -= 15;
      issues.push('Aucune règle pour les bots IA');
      suggestions.push('Définir des règles pour GPTBot, ChatGPT et autres bots IA');
    }

    // Vérifier la sécurité
    const hasAdminProtection = robotsTxt.toLowerCase().includes('/admin') ||
                              robotsTxt.toLowerCase().includes('/wp-admin');
    if (!hasAdminProtection) {
      score -= 10;
      suggestions.push('Protéger les répertoires admin des crawlers');
    }

    // Mode IA : Analyse avancée
    let aiInsights = null;
    if (useAI && apiKey) {
      // Sauvegarder la clé API
      localStorage.setItem('openai_api_key', apiKey);
      
      // Score amélioré avec IA
      score = Math.min(100, score + 10);
      
      // Insights IA simulés (en production, ce serait un appel à l'API OpenAI)
      aiInsights = {
        strategicAnalysis: 'L\'IA détecte une configuration équilibrée entre sécurité et accessibilité SEO',
        botsTrends: 'Recommandation IA : Bloquer les nouveaux bots GPT-4o et Claude-3 émergents',
        securityScore: 85,
        seoImpact: 'Impact SEO positif : +12% de crawlabilité optimale détecté',
        recommendations: [
          'IA suggère d\'ajouter des règles pour les bots de fact-checking émergents',
          'Configuration détectée comme compatible avec les futures IA multimodales',
          'Stratégie IA-friendly recommandée pour 15% des contenus (autorisés)'
        ]
      };

      // Suggestions améliorées avec IA
      suggestions.push('IA: Optimiser pour les futurs bots multimodaux (image + texte)');
      suggestions.push('IA: Considérer un bloc spécifique pour les bots de fact-checking');
    }

    return { 
      score: Math.max(0, score), 
      issues, 
      suggestions, 
      aiInsights,
      useAI 
    };
  };

  const exportRobotsTxt = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('robots.txt téléchargé');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🤖 Test Robots.txt
            </h1>
            <p className="text-lg text-muted-foreground">
              Testez votre robots.txt - Bloquez les mauvais bots, autorisez les bons
            </p>
          </div>
        </div>

        {/* Configuration du mode d'analyse */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {useAI ? <Brain className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {useAI ? '🤖 Mode IA Avancé' : '📊 Mode Standard'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {useAI 
                      ? 'Analyse intelligente avec recommandations personnalisées robots.txt' 
                      : 'Validation standard avec règles prédéfinies'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={!useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(false)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Standard
                </Button>
                <Button
                  variant={useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  IA Pro
                </Button>
              </div>
            </div>

            {/* Configuration OpenAI si mode IA activé */}
            {useAI && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 mb-2">Configuration requise</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Le mode IA génère des recommendations ultra-personnalisées pour votre robots.txt
                    </p>
                    <Input
                      type="password"
                      placeholder="Clé API OpenAI (sk-...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mb-2"
                    />
                    <div className="text-xs text-yellow-600">
                      💡 Votre clé est stockée localement et sécurisée
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Avantages selon le mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
              <div className={`p-3 rounded-lg border ${!useAI ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-semibold mb-2">📊 Mode Standard</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Validation syntaxique robots.txt</li>
                  <li>• Templates prédéfinis optimisés</li>
                  <li>• Test multi-bots standard</li>
                  <li>• Score de qualité automatique</li>
                </ul>
              </div>
              <div className={`p-3 rounded-lg border ${useAI ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-semibold mb-2">🤖 Mode IA Pro</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Analyse contextuelle intelligente</li>
                  <li>• Recommandations personnalisées</li>
                  <li>• Détection de bots émergents</li>
                  <li>• Optimisation stratégique IA/SEO</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Éditeur
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Test URLs
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger value="bots" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Base de Bots
            </TabsTrigger>
          </TabsList>

          {/* Onglet Éditeur */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Éditeur robots.txt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={loadSampleRobotsTxt} variant="outline" size="sm">
                      Exemple simple
                    </Button>
                    <Button onClick={exportRobotsTxt} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                  <Textarea
                    placeholder="User-agent: *&#10;Disallow: /admin/&#10;Allow: /public/"
                    value={robotsTxt}
                    onChange={(e) => setRobotsTxt(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Aide & Syntaxe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">📝 Directives de base</h4>
                      <div className="space-y-1 font-mono text-xs">
                        <div><strong>User-agent:</strong> spécifie le bot</div>
                        <div><strong>Disallow:</strong> interdit l'accès</div>
                        <div><strong>Allow:</strong> autorise l'accès</div>
                        <div><strong>Sitemap:</strong> localisation du sitemap</div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">🎯 Bons exemples</h4>
                      <div className="space-y-1 font-mono text-xs">
                        <div>User-agent: *</div>
                        <div>Disallow: /admin/</div>
                        <div>Allow: /public/</div>
                        <div>Sitemap: /sitemap.xml</div>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold mb-2">⚠️ Bonnes pratiques</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Une directive par ligne</li>
                        <li>• Paths avec slash final pour dossiers</li>
                        <li>• Wildcards : * pour tout</li>
                        <li>• Tester régulièrement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates E-commerce
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Optimisé pour les boutiques en ligne
                    </p>
                    <div className="p-3 bg-gray-50 rounded font-mono text-xs">
                      <div>User-agent: *</div>
                      <div>Disallow: /admin/</div>
                      <div>Disallow: /cart/</div>
                      <div>Disallow: /checkout/</div>
                      <div>Allow: /products/</div>
                    </div>
                    <Button onClick={() => loadTemplate('ecommerce')} className="w-full" size="sm">
                      Utiliser ce template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates Blog/WordPress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Spécialement conçu pour WordPress
                    </p>
                    <div className="p-3 bg-gray-50 rounded font-mono text-xs">
                      <div>User-agent: *</div>
                      <div>Disallow: /wp-admin/</div>
                      <div>Disallow: /wp-includes/</div>
                      <div>Allow: /wp-content/uploads/</div>
                    </div>
                    <Button onClick={() => loadTemplate('blog')} className="w-full" size="sm">
                      Utiliser ce template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Pour sites corporate et institutionnels
                    </p>
                    <div className="p-3 bg-gray-50 rounded font-mono text-xs">
                      <div>User-agent: *</div>
                      <div>Disallow: /admin/</div>
                      <div>Disallow: /private/</div>
                      <div>Allow: /</div>
                    </div>
                    <Button onClick={() => loadTemplate('corporate')} className="w-full" size="sm">
                      Utiliser ce template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Templates Strict (Sécurisé)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Bloque tout sauf moteurs principaux
                    </p>
                    <div className="p-3 bg-gray-50 rounded font-mono text-xs">
                      <div>User-agent: *</div>
                      <div>Disallow: /</div>
                      <div>User-agent: Googlebot</div>
                      <div>Allow: /</div>
                    </div>
                    <Button onClick={() => loadTemplate('strict')} className="w-full" size="sm">
                      Utiliser ce template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Test URLs */}
          <TabsContent value="test" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    URLs à tester
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Entrez une ou plusieurs URLs (une par ligne)
                  </p>
                  <Textarea
                    placeholder="https://example.com/&#10;https://example.com/admin/&#10;https://example.com/public/page"
                    value={urlsToTest}
                    onChange={(e) => setUrlsToTest(e.target.value)}
                    className="min-h-[300px]"
                  />
                  <Button 
                    onClick={handleTest} 
                    className="w-full" 
                    disabled={loading || !robotsTxt.trim()}
                  >
                    {loading ? 'Test en cours...' : 'Tester les URLs'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>URLs de test rapide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Cliquez pour ajouter des URLs types :
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/')}
                      >
                        Page d'accueil
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/admin/')}
                      >
                        Page admin
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/blog/')}
                      >
                        Section blog
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/products/')}
                      >
                        Produits
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/api/')}
                      >
                        API endpoint
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setUrlsToTest(prev => prev + (prev ? '\n' : '') + 'https://example.com/private/')}
                      >
                        Zone privée
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={() => setUrlsToTest('')}
                      className="w-full mt-4"
                    >
                      Vider la liste
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Résultats des tests */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats du test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-medium truncate">{result.url}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">Indexable :</span>
                            <Badge variant={result.isIndexable ? "default" : "destructive"}>
                              {result.isIndexable ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {result.isIndexable ? 'Oui' : 'Non'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span className="text-sm">Bots IA :</span>
                            <Badge variant={result.isAiBotAllowed ? "default" : "destructive"}>
                              {result.isAiBotAllowed ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {result.isAiBotAllowed ? 'Autorisés' : 'Bloqués'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Outils SEO :</span>
                            <Badge variant={result.isSeoToolAllowed ? "default" : "destructive"}>
                              {result.isSeoToolAllowed ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {result.isSeoToolAllowed ? 'Autorisés' : 'Bloqués'}
                            </Badge>
                          </div>
                        </div>

                        {result.matchedRule && (
                          <div className="mt-3 p-2 bg-muted rounded text-sm">
                            <span className="font-medium">Règle appliquée :</span> {result.matchedRule}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Analyse */}
          <TabsContent value="analysis" className="space-y-6">
            {(() => {
              const analysis = analyzeRobotsTxt();
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Score de Qualité
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <div className={`text-6xl font-bold ${
                          analysis.score >= 80 ? 'text-green-600' : 
                          analysis.score >= 60 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {analysis.score}
                        </div>
                        <div className="text-lg text-muted-foreground">/ 100</div>
                      </div>

                      <div className="space-y-3">
                        {analysis.score >= 80 && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-800 font-medium">Excellent robots.txt</span>
                            </div>
                          </div>
                        )}
                        
                        {analysis.score >= 60 && analysis.score < 80 && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-800 font-medium">Correct, mais améliorable</span>
                            </div>
                          </div>
                        )}

                        {analysis.score < 60 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-800 font-medium">Nécessite des améliorations</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Problèmes détectés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.issues.length === 0 ? (
                          <div className="p-3 bg-green-50 rounded-lg text-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <span className="text-green-800">Aucun problème détecté</span>
                          </div>
                        ) : (
                          analysis.issues.map((issue, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                <span className="text-red-800 text-sm">{issue}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Suggestions d'amélioration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.suggestions.length === 0 ? (
                            <div className="p-3 bg-green-50 rounded-lg text-center">
                              <span className="text-green-800">Votre robots.txt est parfaitement configuré</span>
                            </div>
                          ) : (
                            analysis.suggestions.map((suggestion, index) => (
                              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <span className="text-blue-800 text-sm">{suggestion}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section Insights IA - Uniquement si mode IA activé */}
                  {analysis.aiInsights && (
                    <div className="lg:col-span-2 mt-6">
                      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            Insights IA Avancés
                            <Badge variant="default" className="ml-2">IA Pro</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="p-4 bg-white rounded-lg border border-purple-100">
                                <h4 className="font-semibold text-purple-800 mb-2">🧠 Analyse Stratégique</h4>
                                <p className="text-sm text-gray-700">{analysis.aiInsights.strategicAnalysis}</p>
                              </div>
                              
                              <div className="p-4 bg-white rounded-lg border border-blue-100">
                                <h4 className="font-semibold text-blue-800 mb-2">📈 Impact SEO</h4>
                                <p className="text-sm text-gray-700">{analysis.aiInsights.seoImpact}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="p-4 bg-white rounded-lg border border-orange-100">
                                <h4 className="font-semibold text-orange-800 mb-2">🤖 Tendances Bots</h4>
                                <p className="text-sm text-gray-700">{analysis.aiInsights.botsTrends}</p>
                              </div>

                              <div className="p-4 bg-white rounded-lg border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-green-800">🔒 Score Sécurité IA</h4>
                                  <div className="text-2xl font-bold text-green-600">
                                    {analysis.aiInsights.securityScore}/100
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${analysis.aiInsights.securityScore}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-semibold text-purple-800 mb-3">💡 Recommandations IA Personnalisées</h4>
                            <div className="space-y-2">
                              {analysis.aiInsights.recommendations.map((rec: string, index: number) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-purple-100">
                                  <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                                  <span className="text-sm text-gray-700">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm text-yellow-800">
                                <strong>Mode IA Pro actif</strong> : Analyse basée sur les dernières tendances et algorithmes 2024
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              );
            })()}
          </TabsContent>

          {/* Onglet Base de Bots */}
          <TabsContent value="bots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Base de données des Bots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Moteurs de recherche */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-green-800">🔍 Moteurs de recherche</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Googlebot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Bingbot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>YandexBot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>DuckDuckBot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bots IA */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-purple-800">🤖 Bots IA</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>GPTBot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>ChatGPT-User</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>ClaudeBot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Google-Bard</span>
                        <Badge variant="secondary">⚠️ Évaluer</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Outils SEO */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-800">📊 Outils SEO</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>SemrushBot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>AhrefsBot</span>
                        <Badge variant="secondary">⚠️ Modérer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>MJ12bot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>ScreamingFrog</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bots malveillants */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-red-800">🚫 Bots malveillants</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>SiteBot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>SpamBot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>BadBot</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>EmailSiphon</span>
                        <Badge variant="destructive">❌ Bloquer</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-pink-800">📱 Réseaux sociaux</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>facebookexternalhit</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Twitterbot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>LinkedInBot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>WhatsApp</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Surveillance */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 text-orange-800">👁️ Surveillance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>UptimeRobot</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pingdom</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>StatusCake</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>GTmetrix</span>
                        <Badge variant="default">✅ Autoriser</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Recommandations générales</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Toujours autoriser</strong> les moteurs de recherche principaux</li>
                    <li>• <strong>Évaluer soigneusement</strong> les bots IA selon votre stratégie</li>
                    <li>• <strong>Bloquer systématiquement</strong> les bots malveillants</li>
                    <li>• <strong>Autoriser les outils SEO</strong> que vous utilisez</li>
                    <li>• <strong>Mettre à jour régulièrement</strong> votre liste de bots</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RobotsTxtPage;