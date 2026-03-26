import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, ExternalLink, BookOpen, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormationVideosPage = () => {
  const navigate = useNavigate();
  const formationUrl = 'https://www.trafic-affiliation.com/school/course/formation-ebookstudio';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/ebook-planner')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Générateur
          </Button>

          <div className="text-center mb-6">
            <Badge className="mb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 px-4 py-1.5 text-sm font-bold">
              <Gift className="w-4 h-4 mr-1.5" />
              Offerte avec votre accès
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Formation EbookStudio Pro
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              15 modules vidéo pour maîtriser chaque fonctionnalité et publier votre premier ebook rapidement.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Valeur : <span className="line-through">147€</span> — <span className="font-bold text-primary">Offerte</span> avec votre accès à 67€
            </p>
          </div>
        </div>

        {/* Iframe formation */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-primary/5 border-b border-border">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Accès à la formation</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(formationUrl, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir en plein écran
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src={formationUrl}
              title="Formation EbookStudio Pro — 15 modules vidéo"
              className="w-full border-0"
              style={{ height: '80vh', minHeight: '600px' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              loading="lazy"
            />
          </CardContent>
        </Card>

        {/* CTA bottom */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-bold mb-2">Besoin d'aide ?</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Réservez un Zoom gratuit pour une démonstration personnalisée.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => window.open('https://calendly.com/boubetgeorges/nouvelle-reunion', '_blank')} className="gap-2">
                <Play className="h-4 w-4" />
                Réserver un Zoom
              </Button>
              <Button variant="outline" onClick={() => navigate('/ebook-planner')} className="gap-2">
                <BookOpen className="h-4 w-4" />
                Accéder au générateur
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormationVideosPage;
