import { useNavigate } from 'react-router-dom';
import { COVER_FORMAT_LIST, type CoverFormatId } from '@/config/coverFormats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Layers, Square, BookCopy, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const FORMAT_ICONS: Record<CoverFormatId, typeof BookOpen> = {
  'ebook-kindle': BookOpen,
  'broche-wrap': Layers,
  'kids-square': Square,
  hardcover: BookCopy,
};

export default function CoverStudioProHubPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/v3/hub')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour au hub V3
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Page précédente
        </Button>
      </div>
      <header className="text-center space-y-3">
        <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" /> COVER STUDIO PRO
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Créez des couvertures dignes d'une maison d'édition</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Éditeur multi-calques type Canva, templates KDP prêts à l'emploi, IA intégrée pour les visuels de fond,
          export PDF print-ready avec bleed 3 mm.
        </p>
      </header>

      <IdeogramKeyCard />



      <section>
        <h2 className="text-lg font-semibold mb-4">Choisis un format</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {COVER_FORMAT_LIST.map((format) => {
            const Icon = FORMAT_ICONS[format.id];
            return (
              <Card
                key={format.id}
                className="cursor-pointer hover:border-primary hover:shadow-md transition group"
                onClick={() => navigate(`/v3/cover-studio-pro/edit?format=${format.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{format.label}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{format.displayCm}</p>
                      </div>
                    </div>
                    <Badge variant={format.category === 'print' ? 'default' : 'secondary'}>
                      {format.category === 'print' ? 'Impression KDP' : 'Ebook'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{format.description}</p>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition">
                    Ouvrir l'éditeur <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 rounded-lg p-6">
        <h3 className="font-semibold mb-2">🎨 Ce que Cover Studio Pro sait faire</h3>
        <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li>✓ Calques (texte, formes, images) avec undo/redo</li>
          <li>✓ Génération de fond par IA (Gemini)</li>
          <li>✓ Templates KDP par catégorie (romance, thriller, jeunesse…)</li>
          <li>✓ Calcul automatique de la tranche broché</li>
          <li>✓ Export PDF print-ready avec bleed 3 mm</li>
          <li>✓ Export PNG haute résolution 300 DPI</li>
          <li>✓ Auto-save cloud toutes les 30 s</li>
          <li>✓ Bibliothèque de polices premium</li>
        </ul>
      </section>
    </div>
  );
}
