import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  ShoppingCart, 
  Eye, 
  BookOpen,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Palette,
  BookMarked,
  Calendar,
  FileText,
  Sparkles
} from 'lucide-react';

type ProductType = 'coloring' | 'comic' | 'diary' | 'documentary' | 'atlas' | 'encyclopedia';

interface SpecializedAmazonPreviewProps {
  productType: ProductType;
  title: string;
  authorName?: string;
  coverUrl?: string;
  pageCount?: number;
  description?: string;
  targetAudience?: string;
  theme?: string;
  price?: number;
}

const productTypeConfig: Record<ProductType, {
  label: string;
  icon: React.ReactNode;
  defaultCategories: string[];
  badgeColor: string;
  defaultPrice: { min: number; optimal: number; max: number };
  amazonCategory: string;
}> = {
  coloring: {
    label: 'Livre de Coloriage',
    icon: <Palette className="w-4 h-4" />,
    defaultCategories: ['Loisirs créatifs', 'Coloriage pour adultes', 'Art-thérapie'],
    badgeColor: 'bg-pink-100 text-pink-800',
    defaultPrice: { min: 5.99, optimal: 8.99, max: 12.99 },
    amazonCategory: 'Livres › Arts, Musique et Cinéma › Coloriage'
  },
  comic: {
    label: 'Bande Dessinée',
    icon: <Sparkles className="w-4 h-4" />,
    defaultCategories: ['Bandes dessinées', 'Comics', 'Manga'],
    badgeColor: 'bg-purple-100 text-purple-800',
    defaultPrice: { min: 9.99, optimal: 14.99, max: 24.99 },
    amazonCategory: 'Livres › Bandes dessinées › Albums'
  },
  diary: {
    label: 'Agenda / Journal Intime',
    icon: <Calendar className="w-4 h-4" />,
    defaultCategories: ['Agendas', 'Journaux intimes', 'Développement personnel'],
    badgeColor: 'bg-emerald-100 text-emerald-800',
    defaultPrice: { min: 7.99, optimal: 12.99, max: 19.99 },
    amazonCategory: 'Fournitures de bureau › Agendas et calendriers'
  },
  documentary: {
    label: 'Livre Documentaire',
    icon: <FileText className="w-4 h-4" />,
    defaultCategories: ['Documentaires', 'Sciences', 'Histoire'],
    badgeColor: 'bg-blue-100 text-blue-800',
    defaultPrice: { min: 12.99, optimal: 19.99, max: 34.99 },
    amazonCategory: 'Livres › Sciences, Techniques et Médecine'
  },
  atlas: {
    label: 'Atlas',
    icon: <BookMarked className="w-4 h-4" />,
    defaultCategories: ['Géographie', 'Cartes', 'Voyages'],
    badgeColor: 'bg-teal-100 text-teal-800',
    defaultPrice: { min: 19.99, optimal: 29.99, max: 49.99 },
    amazonCategory: 'Livres › Tourisme et Voyages › Atlas'
  },
  encyclopedia: {
    label: 'Encyclopédie',
    icon: <BookOpen className="w-4 h-4" />,
    defaultCategories: ['Encyclopédies', 'Références', 'Savoir'],
    badgeColor: 'bg-amber-100 text-amber-800',
    defaultPrice: { min: 24.99, optimal: 39.99, max: 59.99 },
    amazonCategory: 'Livres › Encyclopédies et Dictionnaires'
  }
};

const SpecializedAmazonPreview: React.FC<SpecializedAmazonPreviewProps> = ({
  productType,
  title,
  authorName = 'Votre Nom',
  coverUrl,
  pageCount = 50,
  description,
  targetAudience,
  theme,
  price
}) => {
  const config = productTypeConfig[productType];
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [customPrice, setCustomPrice] = useState(price || config.defaultPrice.optimal);
  const [rating] = useState(4.5);
  const [reviewCount] = useState(0);
  const [bsrRank] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-gray-300" />
            <div className="absolute overflow-hidden w-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      default:
        return 'w-full';
    }
  };

  const defaultCover = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="450" fill="url(#grad)"/>
      <text x="150" y="180" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" font-weight="bold">${title || 'Votre Titre'}</text>
      <text x="150" y="210" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.8">${authorName}</text>
      <text x="150" y="280" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" opacity="0.6">${config.label}</text>
    </svg>
  `)}`;

  const autoDescription = description || `Découvrez ce magnifique ${config.label.toLowerCase()} ${theme ? `sur le thème "${theme}"` : ''} ! ${
    targetAudience ? `Parfait pour ${targetAudience}.` : ''
  } Avec ${pageCount} pages de contenu de qualité, ce livre vous accompagnera dans vos moments de créativité et de découverte.`;

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-3 text-orange-700">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-lg">Aperçu Amazon KDP</span>
            <Badge className={config.badgeColor}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Prix simulé */}
        <div className="mb-4 flex items-center gap-4 p-3 bg-white/80 rounded-lg border">
          <span className="text-sm font-medium text-foreground">Prix simulé :</span>
          <Input
            type="number"
            step="0.01"
            value={customPrice}
            onChange={(e) => setCustomPrice(parseFloat(e.target.value) || config.defaultPrice.optimal)}
            className="w-24"
          />
          <span className="text-xs text-muted-foreground">
            Recommandé : {config.defaultPrice.min}€ - {config.defaultPrice.max}€
          </span>
        </div>

        {/* Simulation Amazon */}
        <div className={`bg-white rounded-lg border shadow-sm transition-all duration-300 overflow-hidden ${getViewModeStyles()}`}>
          {/* Header Amazon */}
          <div className="bg-[#131921] text-white p-3">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-[#FF9900]">amazon</div>
              <div className="flex-1 flex items-center bg-[#FEBD69] rounded overflow-hidden">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-1.5 text-black text-sm outline-none bg-white"
                  placeholder="Rechercher..."
                  readOnly
                />
                <div className="bg-[#FEBD69] p-1.5">
                  <svg className="w-4 h-4 text-[#131921]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-4 py-2 text-xs text-gray-600 border-b bg-gray-50">
            {config.amazonCategory}
          </div>

          {/* Contenu principal */}
          <div className={`p-4 ${viewMode === 'mobile' ? 'space-y-4' : 'flex gap-6'}`}>
            {/* Couverture */}
            <div className={`${viewMode === 'mobile' ? 'w-full flex justify-center' : 'w-1/3'}`}>
              <div className="space-y-3">
                <img
                  src={coverUrl || defaultCover}
                  alt={title}
                  className="w-full max-w-[200px] rounded shadow-lg border"
                  onError={(e) => {
                    e.currentTarget.src = defaultCover;
                  }}
                />
                
                {/* Badges produit */}
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Best-seller
                  </Badge>
                  {productType === 'coloring' && (
                    <Badge className="bg-pink-100 text-pink-800 text-xs">Anti-stress</Badge>
                  )}
                  {productType === 'comic' && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">Illustré</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Détails */}
            <div className={`${viewMode === 'mobile' ? 'w-full' : 'flex-1'} space-y-3`}>
              {/* Titre */}
              <div>
                <h1 className="text-lg md:text-xl font-medium text-[#0F1111] leading-tight">
                  {title || 'Titre de votre livre'}
                </h1>
                <p className="text-sm text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer mt-1">
                  de {authorName} (Auteur)
                </p>
              </div>

              {/* Notes */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-[#007185]">
                  {rating.toFixed(1)} sur 5
                </span>
                <span className="text-sm text-[#007185]">
                  {reviewCount > 0 ? `(${reviewCount} évaluations)` : '(Nouveau)'}
                </span>
              </div>

              {/* BSR */}
              {bsrRank && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">
                    n°{bsrRank.toLocaleString()} en {config.defaultCategories[0]}
                  </span>
                </div>
              )}

              <hr className="border-gray-200" />

              {/* Format et prix */}
              <Tabs defaultValue="paperback" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-xs">
                  <TabsTrigger value="paperback" className="text-xs">Broché</TabsTrigger>
                  <TabsTrigger value="hardcover" className="text-xs">Relié</TabsTrigger>
                </TabsList>
                
                <TabsContent value="paperback" className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-[#B12704]">
                      {customPrice.toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {(customPrice * 1.3).toFixed(2)} €
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      En stock
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      Livraison GRATUITE dès 25€
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      {pageCount} pages
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hardcover" className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium text-[#B12704]">
                      {(customPrice * 1.8).toFixed(2)} €
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      En stock
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      {pageCount} pages • Couverture rigide
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Bouton achat */}
              <div className="space-y-2 pt-2">
                <Button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-medium rounded-full">
                  Ajouter au panier
                </Button>
                <Button className="w-full bg-[#FFA41C] hover:bg-[#FF8F00] text-black font-medium rounded-full">
                  Acheter maintenant
                </Button>
              </div>

              {/* Description */}
              <div className="pt-3 border-t">
                <h3 className="font-medium text-sm mb-2">Description du produit</h3>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {autoDescription}
                </p>
              </div>

              {/* Catégories */}
              <div className="pt-2">
                <h4 className="text-xs font-medium text-gray-500 mb-1">Catégories :</h4>
                <div className="flex flex-wrap gap-1">
                  {config.defaultCategories.map((cat, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 text-sm mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Conseils pour optimiser votre fiche produit
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Utilisez un titre descriptif avec des mots-clés pertinents</li>
            <li>• La couverture est cruciale : elle doit être visible même en miniature</li>
            <li>• Ajoutez 5-7 mots-clés ciblés dans les métadonnées KDP</li>
            <li>• Rédigez une description qui met en valeur les bénéfices pour le lecteur</li>
            <li>• Prix recommandé pour {config.label.toLowerCase()} : {config.defaultPrice.optimal}€</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecializedAmazonPreview;
