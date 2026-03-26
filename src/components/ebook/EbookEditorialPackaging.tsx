import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Package, Copy, FileText, User, Megaphone, ShieldCheck, Twitter, Linkedin, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface PackagingResult {
  descriptionPersuasive: {
    courte: string;
    moyenne: string;
    longue: string;
  };
  texteCouverture: {
    quatriemeCouverture: string;
    bandeauPromo: string;
  };
  presentationAuteur: {
    courte: string;
    complete: string;
  };
  accroches: {
    principale: string;
    alternatives: string[];
    reseauxSociaux: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  argumentsVente: string[];
  objectionsBrisees: Array<{
    objection: string;
    reponse: string;
  }>;
}

const EbookEditorialPackaging = () => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PackagingResult | null>(null);

  const generatePackaging = async () => {
    if (!bookTitle.trim()) {
      toast.error("Veuillez entrer le titre du livre");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('editorial-packaging', {
        body: { userApiKey: userGeminiKey, 
          bookTitle, 
          bookSummary: `Livre complet sur "${bookTitle}" - génération automatique du résumé`,
          authorName: authorName || 'Auteur expert',
          targetAudience: 'Grand public passionné par le sujet',
          genre: 'Non-fiction / Guide pratique'
        }
      });

      if (error) throw error;
      setResult(data);
      toast.success("Packaging marketing généré !");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié !");
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Packaging Éditorial
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Entrez le titre et l'auteur - tout le marketing est généré automatiquement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="book-title">Titre du livre *</Label>
              <Input
                id="book-title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Ex: Les secrets de la productivité"
                onKeyDown={(e) => e.key === 'Enter' && generatePackaging()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-name">Nom de l'auteur</Label>
              <Input
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Jean Dupont (optionnel)"
              />
            </div>
          </div>

          <Button 
            onClick={generatePackaging} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Générer tout le packaging
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Tabs defaultValue="descriptions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
            <TabsTrigger value="couverture">Couverture</TabsTrigger>
            <TabsTrigger value="auteur">Auteur</TabsTrigger>
            <TabsTrigger value="accroches">Accroches</TabsTrigger>
            <TabsTrigger value="vente">Vente</TabsTrigger>
          </TabsList>

          <TabsContent value="descriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descriptions persuasives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.descriptionPersuasive?.courte && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge>Courte (150 car.)</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.descriptionPersuasive.courte)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{result.descriptionPersuasive.courte}</p>
                  </div>
                )}
                {result.descriptionPersuasive?.moyenne && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Moyenne (500 car.)</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.descriptionPersuasive.moyenne)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{result.descriptionPersuasive.moyenne}</p>
                  </div>
                )}
                {result.descriptionPersuasive?.longue && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Longue (1500 car.)</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.descriptionPersuasive.longue)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{result.descriptionPersuasive.longue}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="couverture">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Textes de couverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.texteCouverture?.quatriemeCouverture && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge>4ème de couverture</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.texteCouverture.quatriemeCouverture)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{result.texteCouverture.quatriemeCouverture}</p>
                  </div>
                )}
                {result.texteCouverture?.bandeauPromo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Bandeau promo</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.texteCouverture.bandeauPromo)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-primary/10 p-3 rounded-md font-medium">{result.texteCouverture.bandeauPromo}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auteur">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Présentation de l'auteur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.presentationAuteur?.courte && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge>Bio courte (50 mots)</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.presentationAuteur.courte)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{result.presentationAuteur.courte}</p>
                  </div>
                )}
                {result.presentationAuteur?.complete && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Bio complète (150 mots)</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.presentationAuteur.complete)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{result.presentationAuteur.complete}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accroches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Accroches commerciales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.accroches?.principale && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary">Accroche principale</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.accroches.principale)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-lg font-semibold bg-primary/10 p-4 rounded-md">{result.accroches.principale}</p>
                  </div>
                )}
                
                {result.accroches?.alternatives && result.accroches.alternatives.length > 0 && (
                  <div className="space-y-2">
                    <Label>Alternatives</Label>
                    <div className="space-y-2">
                      {result.accroches.alternatives.map((alt, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <span className="text-sm">{alt}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(alt)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.accroches?.reseauxSociaux && (
                  <div className="space-y-3">
                    <Label>Réseaux sociaux</Label>
                    <div className="grid gap-3">
                      {result.accroches.reseauxSociaux.twitter && (
                        <div className="flex items-start gap-2 bg-blue-500/10 p-3 rounded-md">
                          <Twitter className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-sm flex-1">{result.accroches.reseauxSociaux.twitter}</p>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.accroches.reseauxSociaux.twitter!)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {result.accroches.reseauxSociaux.linkedin && (
                        <div className="flex items-start gap-2 bg-blue-700/10 p-3 rounded-md">
                          <Linkedin className="h-4 w-4 text-blue-700 mt-0.5" />
                          <p className="text-sm flex-1">{result.accroches.reseauxSociaux.linkedin}</p>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.accroches.reseauxSociaux.linkedin!)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {result.accroches.reseauxSociaux.instagram && (
                        <div className="flex items-start gap-2 bg-pink-500/10 p-3 rounded-md">
                          <Instagram className="h-4 w-4 text-pink-500 mt-0.5" />
                          <p className="text-sm flex-1">{result.accroches.reseauxSociaux.instagram}</p>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.accroches.reseauxSociaux.instagram!)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vente">
            <div className="space-y-4">
              {result.argumentsVente && result.argumentsVente.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Arguments de vente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.argumentsVente.map((arg, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                          <span className="text-sm">{arg}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {result.objectionsBrisees && result.objectionsBrisees.length > 0 && (
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Objections brisées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.objectionsBrisees.map((obj, index) => (
                      <div key={index} className="border-l-2 border-green-500/50 pl-4 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">❓ {obj.objection}</p>
                        <p className="text-sm">✅ {obj.reponse}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EbookEditorialPackaging;
