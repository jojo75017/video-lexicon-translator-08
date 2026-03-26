import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-12">
      {/* AI Chat CTA - Premier */}
      <div className="mb-12 p-8 bg-gradient-to-r from-royal-purple/10 via-coral-pink/10 to-vibrant-blue/10 rounded-3xl border-2 border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Parlez avec l'IA
          </h2>
        </div>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Découvrez les meilleures idées d'ebook avec notre assistant IA. 
          Recherchez dans le <strong>top 50 Amazon</strong> et obtenez des conseils personnalisés.
        </p>
        <Button 
          onClick={() => navigate('/ai-chat')}
          size="lg"
          className="bg-gradient-primary text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Commencer à discuter avec l'IA
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          💡 Utilisez votre propre clé API OpenAI
        </p>
      </div>

      {/* Original Hero Content */}
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
        🚀 Obtenez <span className="text-primary">100+ Prompts</span>
        <br />
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          Professionnels GRATUITS
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Téléchargez instantanément notre collection exclusive de prompts optimisés pour 
        <strong> booster votre productivité et multiplier vos résultats</strong> avec l'IA.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Badge className="bg-vibrant-blue/10 text-vibrant-blue border-vibrant-blue/20 px-4 py-2">
          ✨ 100+ Prompts Prêts à l'emploi
        </Badge>
        <Badge className="bg-vibrant-green/10 text-vibrant-green border-vibrant-green/20 px-4 py-2">
          🎯 Testés & Optimisés
        </Badge>
        <Badge className="bg-vibrant-purple/10 text-vibrant-purple border-vibrant-purple/20 px-4 py-2">
          💎 Valeur 147€ - GRATUIT
        </Badge>
      </div>
    </div>
  );
};