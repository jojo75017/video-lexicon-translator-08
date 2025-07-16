import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Info, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CrawlerPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({
    analyzeExternal: false,
    followRedirects: false,
    followNofollow: false,
    checkFileLinks: false,
    crawlQueryString: false,
    ignoreRobots: false,
    sendEmail: false
  });
  const [userAgent, setUserAgent] = useState('alyze-mobile');
  const [language, setLanguage] = useState('auto');
  const [maxLevel, setMaxLevel] = useState('6');
  const [maxPages, setMaxPages] = useState('50');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Veuillez saisir une URL à analyser');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Veuillez saisir une URL valide');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('Analyse terminée ! Les résultats ont été générés.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tableau de bord
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crawler SEO par Alyze</h1>
              <p className="text-gray-600">Analyseur de site web SEO</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Crédit restant */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Crédit disponible</span>
                </div>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                  50 pages restantes ce mois-ci
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Configuration du crawl */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration du crawler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  L'adresse de la page d'accueil du site
                </label>
                <Input
                  placeholder="https://exemple.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Options */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Options :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="external"
                      checked={options.analyzeExternal}
                      onChange={() => handleOptionChange('analyzeExternal')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="external" className="text-sm">
                      Analyser les pages externes?
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="redirects"
                      checked={options.followRedirects}
                      onChange={() => handleOptionChange('followRedirects')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="redirects" className="text-sm">
                      Suivre automatiquement les redirections sur les pages externes?
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="nofollow"
                      checked={options.followNofollow}
                      onChange={() => handleOptionChange('followNofollow')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="nofollow" className="text-sm">
                      Suivre les liens en nofollow?
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="files"
                      checked={options.checkFileLinks}
                      onChange={() => handleOptionChange('checkFileLinks')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="files" className="text-sm">
                      Vérifier les liens vers des fichiers?
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="query"
                      checked={options.crawlQueryString}
                      onChange={() => handleOptionChange('crawlQueryString')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="query" className="text-sm">
                      Crawler les pages avec une query string (?)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="robots"
                      checked={options.ignoreRobots}
                      onChange={() => handleOptionChange('ignoreRobots')}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="robots" className="text-sm">
                      Ignorer le fichier robots.txt
                    </label>
                  </div>
                </div>
              </div>

              {/* Agent utilisateur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agent utilisateur :
                  </label>
                  <select 
                    value={userAgent} 
                    onChange={(e) => setUserAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="alyze-mobile">Alyze (mobile)</option>
                    <option value="alyze-desktop">Alyze (desktop)</option>
                    <option value="googlebot">Googlebot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Langue préférée :
                  </label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="auto">Automatique</option>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </select>
                </div>
              </div>

              {/* Limites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Limiter l'analyse au niveau :
                    <Info className="inline h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <select 
                    value={maxLevel} 
                    onChange={(e) => setMaxLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="unlimited">Illimité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Limiter le nombre de pages analysées :
                    <Info className="inline h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <Input
                    type="number"
                    value={maxPages}
                    onChange={(e) => setMaxPages(e.target.value)}
                    max={50}
                    min={1}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email"
                  checked={options.sendEmail}
                  onChange={() => handleOptionChange('sendEmail')}
                  className="rounded border-gray-300"
                />
                <label htmlFor="email" className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Envoyez un email à la fin du crawl
                </label>
              </div>

              {/* Bouton d'analyse */}
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse'}
              </Button>
            </CardContent>
          </Card>

          {/* À propos d'Alyze */}
          <Card>
            <CardHeader>
              <CardTitle>La puissance d'Alyze dans un crawler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Le crawler SEO d'Alyze s'appuie sur une version enrichie de l'analyseur de pages d'Alyze 
                largement utilisé dans la communauté SEO depuis 2008. À la différence de l'analyseur de pages, 
                le crawler est capable de suivre l'ensemble des liens de votre site comme le ferait le robot 
                d'un moteur de recherche. Il produit une analyse de l'ensemble de votre site où sont facilement 
                détectables les problèmes techniques, les faiblesses SEO, les structures mal adaptées, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrawlerPage;