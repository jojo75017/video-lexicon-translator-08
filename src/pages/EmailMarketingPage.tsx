import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mail, 
  Zap, 
  Layout, 
  Shield, 
  FileText, 
  Copy, 
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const EmailMarketingPage = () => {
  const [subjectLine, setSubjectLine] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [spamScore, setSpamScore] = useState(0);
  const [generatedSubjects, setGeneratedSubjects] = useState<string[]>([]);

  const subjectLineTemplates = [
    "🔥 [Prénom], votre guide SEO arrive !",
    "⚡ Dernières heures : -50% sur votre formation",
    "📈 [Prénom], doublez votre trafic en 30 jours",
    "🚀 URGENT : Votre place est réservée jusqu'à minuit",
    "💡 [Prénom], la méthode secrète des pros SEO",
    "🎯 Comment [concurrent] génère 10k visiteurs/mois",
    "📊 Vos 3 erreurs SEO les plus coûteuses",
    "⭐ [Prénom], votre audit gratuit est prêt",
    "🔑 La stratégie que Google ne veut pas que vous connaissiez",
    "💰 [Prénom], transformez vos visiteurs en clients"
  ];

  const generateSubjectLines = (niche: string) => {
    const subjects = subjectLineTemplates.map(template => 
      template.replace('[concurrent]', niche).replace('SEO', niche)
    );
    setGeneratedSubjects(subjects);
    toast.success('Subject lines générés avec succès !');
  };

  const analyzeSpamScore = (content: string) => {
    let score = 0;
    const spamWords = ['gratuit', 'urgent', 'offre limitée', 'argent', 'promotion'];
    const exclamationCount = (content.match(/!/g) || []).length;
    const capsCount = (content.match(/[A-Z]/g) || []).length;
    
    spamWords.forEach(word => {
      if (content.toLowerCase().includes(word)) score += 2;
    });
    
    if (exclamationCount > 3) score += 3;
    if (capsCount > content.length * 0.3) score += 4;
    
    setSpamScore(Math.min(score, 10));
    toast.success('Analyse spam terminée !');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            📧 Email Marketing SEO
          </h1>
          <p className="text-xl text-gray-600">
            Créez des campagnes email qui convertissent et passent les filtres anti-spam
          </p>
        </div>

        <Tabs defaultValue="subject-lines" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subject-lines" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Subject Lines
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="spam-audit" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Audit Spam
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Newsletter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subject-lines">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Générateur de Subject Lines Optimisés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Votre niche/secteur</label>
                    <Input
                      placeholder="Ex: SEO, Marketing Digital, E-commerce..."
                      value={subjectLine}
                      onChange={(e) => setSubjectLine(e.target.value)}
                    />
                    <Button 
                      onClick={() => generateSubjectLines(subjectLine)}
                      className="w-full mt-4"
                      disabled={!subjectLine}
                    >
                      Générer 10 Subject Lines
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">✨ Bonnes pratiques :</h3>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• Utilisez le prénom pour personnaliser</li>
                      <li>• Créez de l'urgence sans être spammy</li>
                      <li>• Posez des questions intrigantes</li>
                      <li>• Utilisez des emojis avec modération</li>
                      <li>• Testez A/B vos subject lines</li>
                    </ul>
                  </div>
                </div>

                {generatedSubjects.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Subject Lines Générés :</h3>
                    <div className="grid gap-3">
                      {generatedSubjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 border rounded-lg">
                          <span className="flex-1">{subject}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(subject)}
                            className="ml-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-green-600" />
                    Newsletter SEO Pro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Template responsive HTML avec sections optimisées SEO</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-green-600" />
                    Email Promotionnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Template pour campagnes promotionnelles avec CTA optimisés</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="spam-audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Audit Score Spam
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Contenu de votre email</label>
                  <Textarea
                    placeholder="Collez ici le contenu de votre email pour analyser le score spam..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="min-h-32"
                  />
                  <Button 
                    onClick={() => analyzeSpamScore(emailContent)}
                    className="mt-4"
                    disabled={!emailContent}
                  >
                    Analyser le Score Spam
                  </Button>
                </div>

                {spamScore > 0 && (
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${spamScore <= 3 ? 'text-green-600' : spamScore <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {spamScore}/10
                        </div>
                        <div className="text-sm text-gray-600">Score Spam</div>
                      </div>
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${spamScore <= 3 ? 'text-green-600' : spamScore <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {spamScore <= 3 ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          <span className="font-semibold">
                            {spamScore <= 3 ? 'Excellent' : spamScore <= 6 ? 'Attention' : 'Risque élevé'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {spamScore <= 3 
                            ? 'Votre email a de bonnes chances de passer les filtres' 
                            : spamScore <= 6 
                            ? 'Quelques améliorations recommandées'
                            : 'Révision nécessaire pour éviter le dossier spam'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Recommandations :</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Évitez les mots "gratuit", "urgent", "promotion"</li>
                        <li>• Limitez les exclamations (max 2-3 par email)</li>
                        <li>• Équilibrez majuscules et minuscules</li>
                        <li>• Incluez du texte ET des images</li>
                        <li>• Ajoutez un lien de désinscription visible</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Générateur de Newsletter SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">📈 Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Taux d'ouverture</span>
                          <Badge variant="outline">24.5%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Taux de clic</span>
                          <Badge variant="outline">3.2%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Désabonnements</span>
                          <Badge variant="outline">0.8%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">🎯 Segmentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge className="block text-center">Débutants SEO</Badge>
                        <Badge className="block text-center" variant="secondary">Experts</Badge>
                        <Badge className="block text-center" variant="outline">E-commerce</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">⚡ A/B Testing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Version A</span>
                            <span>67%</span>
                          </div>
                          <div className="bg-green-200 h-2 rounded-full">
                            <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Version B</span>
                            <span>33%</span>
                          </div>
                          <div className="bg-gray-200 h-2 rounded-full">
                            <div className="bg-gray-600 h-2 rounded-full w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Optimisations Newsletter SEO
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">✅ Best Practices :</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Subject line inférieur à 50 caractères</li>
                        <li>• Preview text optimisé</li>
                        <li>• Images avec alt text</li>
                        <li>• Links vers contenu SEO</li>
                        <li>• Call-to-action clairs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Contenu SEO :</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Articles de blog récents</li>
                        <li>• Guides et tutoriels</li>
                        <li>• Mots-clés trending</li>
                        <li>• Updates algorithme</li>
                        <li>• Études de cas clients</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmailMarketingPage;