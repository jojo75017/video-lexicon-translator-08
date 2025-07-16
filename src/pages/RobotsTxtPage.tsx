import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, CheckCircle, XCircle, AlertTriangle, Search, Bot, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface RobotsTestResult {
  url: string;
  isIndexable: boolean;
  isAiBotAllowed: boolean;
  isSeoToolAllowed: boolean;
  matchedRule?: string;
  botType: 'search' | 'ai' | 'seo';
}

const RobotsTxtPage: React.FC = () => {
  const [robotsTxt, setRobotsTxt] = useState('');
  const [urlsToTest, setUrlsToTest] = useState('');
  const [testResults, setTestResults] = useState<RobotsTestResult[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🤖 Test Robots.txt
          </h1>
          <p className="text-lg text-muted-foreground">
            Testez votre robots.txt - Bloquez les mauvais bots, autorisez les bons
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Configuration du robots.txt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Contenu du robots.txt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={loadSampleRobotsTxt} variant="outline" size="sm">
                  Charger un exemple
                </Button>
              </div>
              <Textarea
                placeholder="User-agent: *&#10;Disallow: /admin/&#10;Allow: /public/"
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* URLs à tester */}
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
                className="min-h-[250px]"
              />
              <Button 
                onClick={handleTest} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Test en cours...' : 'Tester les URLs'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
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
                      {/* Indexable par moteurs de recherche */}
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

                      {/* Bots IA autorisés */}
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

                      {/* Outils SEO autorisés */}
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
      </div>
    </div>
  );
};

export default RobotsTxtPage;