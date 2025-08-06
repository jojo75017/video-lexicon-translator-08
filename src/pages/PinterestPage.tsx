import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Image, Palette, Download, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PinterestPage: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [pins, setPins] = useState<any[]>([]);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generatePins = () => {
    if (!topic.trim()) {
      toast.error('Veuillez entrer un sujet');
      return;
    }

    setIsLoading(true);

    // Simulation de génération d'épingles Pinterest
    setTimeout(() => {
      const mockPins = [
        {
          title: `Guide ultime ${topic} 2024`,
          description: `Découvrez tout ce qu'il faut savoir sur ${topic}`,
          category: 'Guide',
          hashtags: [`#${topic}`, '#guide', '#conseils', '#2024'],
          format: 'Infographie verticale',
          colors: ['#E74C3C', '#F39C12', '#FFFFFF']
        },
        {
          title: `10 conseils ${topic} pour débutants`,
          description: `Commencez ${topic} avec ces astuces simples`,
          category: 'Liste',
          hashtags: [`#${topic}`, '#débutant', '#astuces', '#facile'],
          format: 'Liste numérotée',
          colors: ['#3498DB', '#2ECC71', '#FFFFFF']
        },
        {
          title: `Inspiration ${topic} - Idées créatives`,
          description: `Sources d'inspiration pour votre ${topic}`,
          category: 'Inspiration',
          hashtags: [`#${topic}`, '#inspiration', '#créatif', '#idées'],
          format: 'Moodboard',
          colors: ['#9B59B6', '#E67E22', '#FFFFFF']
        },
        {
          title: `${topic} : erreurs à éviter`,
          description: `Évitez ces erreurs courantes en ${topic}`,
          category: 'Conseils',
          hashtags: [`#${topic}`, '#erreurs', '#conseils', '#amélioration'],
          format: 'Checklist',
          colors: ['#E74C3C', '#34495E', '#FFFFFF']
        },
        {
          title: `DIY ${topic} - Tutoriel pas à pas`,
          description: `Créez votre propre ${topic} facilement`,
          category: 'DIY',
          hashtags: [`#${topic}`, '#DIY', '#tutoriel', '#facile'],
          format: 'Étapes illustrées',
          colors: ['#F1C40F', '#E67E22', '#FFFFFF']
        }
      ];

      setPins(mockPins);
      setIsLoading(false);
      toast.success(`${mockPins.length} épingles générées !`);
    }, 1500);
  };

  const generateDescription = (pin: any) => {
    const description = `🌟 ${pin.title}

${pin.description}. Ce guide complet vous accompagne étape par étape pour maîtriser ${topic}.

✨ Ce que vous découvrirez :
• Les techniques essentielles
• Les erreurs à éviter
• Des conseils d'experts
• Des exemples concrets

💡 Parfait pour les débutants comme les experts !

Enregistrez cette épingle pour ne pas la perdre et partagez-la avec vos amis ! 📌

${pin.hashtags.join(' ')} #inspiration #guide #conseils`;

    setGeneratedDescription(description);
    setSelectedPin(pin);
    toast.success('Description générée !');
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(generatedDescription);
    toast.success('Description copiée !');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Liste': 'bg-green-100 text-green-800',
      'Inspiration': 'bg-purple-100 text-purple-800',
      'Conseils': 'bg-yellow-100 text-yellow-800',
      'DIY': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-rose-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            📌 Pinterest Generator Pro
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Génération d'Épingles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sujet / Thématique</label>
                <Input
                  placeholder="cuisine, décoration, voyage, fitness..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generatePins()}
                />
              </div>

              <Button onClick={generatePins} disabled={isLoading} className="w-full">
                {isLoading ? 'Génération...' : 'Générer des idées d\'épingles'}
              </Button>

              {pins.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Idées d'épingles ({pins.length})</h4>
                  {pins.map((pin, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">{pin.title}</span>
                        <Badge variant="outline" className={getCategoryColor(pin.category)}>
                          {pin.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{pin.description}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="h-3 w-3 text-gray-400" />
                        <div className="flex gap-1">
                          {pin.colors.map((color: string, i: number) => (
                            <div 
                              key={i}
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{pin.format}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {pin.hashtags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateDescription(pin)}
                        className="w-full"
                      >
                        Générer la description
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Description optimisée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPin ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Épingle sélectionnée</label>
                    <div className="p-3 bg-pink-50 rounded border">
                      <div className="font-medium">{selectedPin.title}</div>
                      <div className="text-sm text-gray-600">{selectedPin.category} • {selectedPin.format}</div>
                    </div>
                  </div>

                  {generatedDescription && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Description générée</label>
                        <Button variant="outline" size="sm" onClick={copyDescription}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                      </div>
                      <Textarea
                        value={generatedDescription}
                        onChange={(e) => setGeneratedDescription(e.target.value)}
                        rows={10}
                        className="text-sm"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Caractères: {generatedDescription.length}/500
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Conseils Pinterest</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Utilisez un format vertical (2:3 ou 1000x1500px)</div>
                      <div>• Ajoutez du texte lisible sur l'image</div>
                      <div>• Utilisez des couleurs vives et contrastées</div>
                      <div>• Incluez votre logo discrètement</div>
                      <div>• Optimisez pour mobile</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Sélectionnez une épingle à gauche pour générer sa description optimisée
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PinterestPage;