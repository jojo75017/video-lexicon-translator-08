import React from 'react';
import { Lock, Sparkles, BookOpen, Download, Image, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface DemoPaywallProps {
  feature: 'chapters' | 'export' | 'cover' | 'advanced';
  onClose?: () => void;
}

const featureDetails = {
  chapters: {
    icon: BookOpen,
    title: 'Contenu des chapitres',
    description: 'Générez le contenu complet de vos chapitres avec l\'IA',
  },
  export: {
    icon: Download,
    title: 'Export PDF/Word',
    description: 'Exportez votre ebook dans tous les formats professionnels',
  },
  cover: {
    icon: Image,
    title: 'Couverture IA',
    description: 'Créez des couvertures professionnelles avec l\'intelligence artificielle',
  },
  advanced: {
    icon: Zap,
    title: 'Fonctionnalités avancées',
    description: 'Accédez à tous les outils professionnels d\'édition',
  },
};

export const DemoPaywall: React.FC<DemoPaywallProps> = ({ feature, onClose }) => {
  const navigate = useNavigate();
  const details = featureDetails[feature];
  const Icon = details.icon;

  const handleUpgrade = () => {
    navigate('/sales');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-background to-muted border-primary/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Fonctionnalité Premium</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{details.title}</h3>
              <p className="text-sm text-muted-foreground">{details.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-center">Débloquez tout pour seulement</h4>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">67€</span>
              <span className="text-muted-foreground ml-2 line-through">147€</span>
              <p className="text-sm text-muted-foreground mt-1">Accès à vie • Paiement unique</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              'Génération illimitée de chapitres',
              'Export PDF, Word, ePub',
              'Couvertures IA professionnelles',
              'Tous les outils d\'édition',
              'Support prioritaire',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Plus tard
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              onClick={handleUpgrade}
            >
              Débloquer maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
