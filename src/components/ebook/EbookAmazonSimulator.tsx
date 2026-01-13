import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Eye, 
  BookOpen,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Package
} from 'lucide-react';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

interface EbookAmazonSimulatorProps {
  title?: string;
  authorName?: string;
  coverUrl?: string;
  description?: string;
  price?: number;
  categories?: string[];
  keywords?: string[];
}

const EbookAmazonSimulator: React.FC<EbookAmazonSimulatorProps> = ({
  title: propTitle,
  authorName: propAuthor,
  coverUrl: propCover,
  description: propDescription,
  price: propPrice,
  categories: propCategories,
  keywords: propKeywords
}) => {
  const { getStepResult } = useWorkflowResults();
  
  // États du simulateur
  const [bookTitle, setBookTitle] = useState(propTitle || '');
  const [author, setAuthor] = useState(propAuthor || '');
  const [coverImage, setCoverImage] = useState(propCover || '');
  const [bookDescription, setBookDescription] = useState(propDescription || '');
  const [bookPrice, setBookPrice] = useState(propPrice || 4.99);
  const [bookCategories, setBookCategories] = useState<string[]>(propCategories || []);
  const [bookKeywords, setBookKeywords] = useState<string[]>(propKeywords || []);
  const [rating, setRating] = useState(4.5);
  const [reviewCount, setReviewCount] = useState(127);
  const [bsrRank, setBsrRank] = useState(1234);
  const [pageCount, setPageCount] = useState(250);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showLookInside, setShowLookInside] = useState(false);

  // Charger les données du workflow
  useEffect(() => {
    const p1Result = getStepResult('p1');
    const p2Result = getStepResult('p2');
    
    if (p1Result) {
      const p1Data = p1Result as Record<string, any>;
      if (p1Data.optimizedTitle) setBookTitle(p1Data.optimizedTitle);
      if (p1Data.bookDescription) setBookDescription(p1Data.bookDescription);
    }
    
    if (p2Result) {
      const p2Data = p2Result as Record<string, any>;
      if (p2Data.kdpKeywords) {
        const keywords = Array.isArray(p2Data.kdpKeywords) 
          ? p2Data.kdpKeywords.map((k: any) => typeof k === 'string' ? k : k.keyword)
          : [];
        setBookKeywords(keywords.slice(0, 7));
      }
      if (p2Data.categories) {
        setBookCategories(Array.isArray(p2Data.categories) ? p2Data.categories.slice(0, 3) : []);
      }
      if (p2Data.recommendedPrice) {
        setBookPrice(p2Data.recommendedPrice);
      }
    }
  }, [getStepResult]);

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
      <text x="150" y="200" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" font-weight="bold">${bookTitle || 'Votre Titre'}</text>
      <text x="150" y="240" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.8">${author || 'Votre Nom'}</text>
    </svg>
  `)}`;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-orange-700">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            Simulateur Page Amazon KDP
            <Badge className="bg-orange-500 text-white">Prévisualisation</Badge>
          </CardTitle>
          <p className="text-sm text-orange-600">
            Visualisez exactement comment votre livre apparaîtra sur Amazon avant publication
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Titre du livre</label>
              <Input
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Titre de votre ebook"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Auteur</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nom de l'auteur"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">URL de la couverture</label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Prix (€)</label>
              <Input
                type="number"
                step="0.01"
                value={bookPrice}
                onChange={(e) => setBookPrice(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Nombre de pages</label>
              <Input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Note (1-5)</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 4.5)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Nombre d'avis</label>
              <Input
                type="number"
                value={reviewCount}
                onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Classement BSR</label>
              <Input
                type="number"
                value={bsrRank}
                onChange={(e) => setBsrRank(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
                placeholder="Description du livre..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Mots-clés (séparés par virgule)</label>
              <Input
                value={bookKeywords.join(', ')}
                onChange={(e) => setBookKeywords(e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                placeholder="mot-clé1, mot-clé2..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Catégories (séparées par virgule)</label>
              <Input
                value={bookCategories.join(', ')}
                onChange={(e) => setBookCategories(e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                placeholder="Catégorie1, Catégorie2..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu Amazon */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aperçu Amazon
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
          <CardContent className="p-0">
            {/* Simulation de la page Amazon */}
            <div className={`bg-white transition-all duration-300 ${getViewModeStyles()}`}>
              {/* Header Amazon */}
              <div className="bg-[#131921] text-white p-3">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-[#FF9900]">amazon</div>
                  <div className="flex-1 flex items-center bg-[#FEBD69] rounded-md overflow-hidden">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 text-black text-sm outline-none"
                      placeholder="Rechercher sur Amazon.fr"
                      readOnly
                    />
                    <div className="bg-[#FEBD69] p-2">
                      <svg className="w-5 h-5 text-[#131921]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="px-4 py-2 text-xs text-gray-600 border-b">
                Livres › eBooks Kindle › {bookCategories[0] || 'Littérature et fiction'}
              </div>

              {/* Contenu principal */}
              <div className={`p-4 ${viewMode === 'mobile' ? 'space-y-4' : 'flex gap-6'}`}>
                {/* Colonne gauche - Couverture */}
                <div className={`${viewMode === 'mobile' ? 'w-full' : 'w-1/3'} space-y-4`}>
                  <div className="relative group">
                    <img
                      src={coverImage || defaultCover}
                      alt={bookTitle}
                      className="w-full max-w-[300px] mx-auto rounded shadow-lg border"
                      onError={(e) => {
                        e.currentTarget.src = defaultCover;
                      }}
                    />
                    <button 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium"
                      onClick={() => setShowLookInside(true)}
                    >
                      <BookOpen className="w-6 h-6 mr-2" />
                      Feuilleter
                    </button>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                      <Award className="w-3 h-3 mr-1" />
                      Best-seller
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      Kindle Unlimited
                    </Badge>
                  </div>
                </div>

                {/* Colonne droite - Détails */}
                <div className={`${viewMode === 'mobile' ? 'w-full' : 'flex-1'} space-y-4`}>
                  {/* Titre */}
                  <div>
                    <h1 className="text-xl md:text-2xl font-medium text-[#0F1111] leading-tight">
                      {bookTitle || 'Titre de votre livre'}
                    </h1>
                    <p className="text-sm text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer mt-1">
                      de {author || 'Nom de l\'auteur'} (Auteur)
                    </p>
                  </div>

                  {/* Notes et avis */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer">
                      {rating.toFixed(1)} sur 5
                    </span>
                    <span className="text-sm text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer">
                      {reviewCount.toLocaleString()} évaluations
                    </span>
                  </div>

                  {/* BSR */}
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">
                      Classement des ventes Amazon : n°{bsrRank.toLocaleString()} en Boutique Kindle
                    </span>
                  </div>

                  {/* Séparateur */}
                  <hr className="border-gray-200" />

                  {/* Formats disponibles */}
                  <div className="space-y-2">
                    <Tabs defaultValue="kindle" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="kindle" className="text-xs">Format Kindle</TabsTrigger>
                        <TabsTrigger value="paperback" className="text-xs">Broché</TabsTrigger>
                        <TabsTrigger value="hardcover" className="text-xs">Relié</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="kindle" className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#B12704]">
                            {bookPrice.toFixed(2)} €
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {(bookPrice * 1.5).toFixed(2)} €
                          </span>
                          <Badge className="bg-red-600 text-white text-xs">
                            -{Math.round((1 - bookPrice / (bookPrice * 1.5)) * 100)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          TVA incluse (le cas échéant)
                        </p>
                      </TabsContent>
                      
                      <TabsContent value="paperback" className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#B12704]">
                            {(bookPrice * 2.5).toFixed(2)} €
                          </span>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="hardcover" className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#B12704]">
                            {(bookPrice * 4).toFixed(2)} €
                          </span>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Kindle Unlimited */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-medium">📚 Gratuit avec Kindle Unlimited</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Lisez ce livre gratuitement et plus d'un million d'autres avec un abonnement Kindle Unlimited.
                    </p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-2">
                    <Button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-medium rounded-full py-2">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Acheter en 1-Click®
                    </Button>
                    <Button variant="outline" className="w-full rounded-full py-2 border-gray-300">
                      <Heart className="w-4 h-4 mr-2" />
                      Ajouter à la liste
                    </Button>
                  </div>

                  {/* Livraison */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Téléchargement immédiat</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Smartphone className="w-4 h-4" />
                      <span>Lisez sur n'importe quel appareil</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Download className="w-4 h-4" />
                      <span>Whispersync activé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description du produit */}
              <div className="p-4 border-t">
                <h2 className="text-lg font-medium text-[#0F1111] mb-3">Description du produit</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {bookDescription || 'Ajoutez une description captivante pour votre livre...'}
                </div>
              </div>

              {/* Détails du produit */}
              <div className="p-4 border-t bg-gray-50">
                <h2 className="text-lg font-medium text-[#0F1111] mb-3">Détails sur le produit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">ASIN :</span>
                    <span className="text-gray-600">B0{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">Éditeur :</span>
                    <span className="text-gray-600">Auto-édition</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">Date de publication :</span>
                    <span className="text-gray-600">{new Date().toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">Langue :</span>
                    <span className="text-gray-600">Français</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">Taille du fichier :</span>
                    <span className="text-gray-600">{Math.floor(pageCount * 0.05 + Math.random() * 2)} Mo</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-40">Nombre de pages :</span>
                    <span className="text-gray-600">{pageCount} pages</span>
                  </div>
                </div>
              </div>

              {/* Mots-clés et catégories */}
              {(bookKeywords.length > 0 || bookCategories.length > 0) && (
                <div className="p-4 border-t">
                  {bookCategories.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories :</h3>
                      <div className="flex flex-wrap gap-2">
                        {bookCategories.map((cat, idx) => (
                          <Badge key={idx} variant="outline" className="text-[#007185] border-[#007185]">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {bookKeywords.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Mots-clés :</h3>
                      <div className="flex flex-wrap gap-2">
                        {bookKeywords.map((kw, idx) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section avis simulée */}
              <div className="p-4 border-t">
                <h2 className="text-lg font-medium text-[#0F1111] mb-3">Commentaires client</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#0F1111]">{rating.toFixed(1)}</div>
                    <div className="flex justify-center">{renderStars(rating)}</div>
                    <div className="text-sm text-gray-600 mt-1">{reviewCount} évaluations</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percentage = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-16 text-[#007185] hover:underline cursor-pointer">{star} étoiles</span>
                          <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                            <div 
                              className="h-full bg-[#FFA41C]" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-[#007185]">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avis exemple */}
                <div className="space-y-4 border-t pt-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                        ML
                      </div>
                      <span className="font-medium text-sm">Marie L.</span>
                      <Badge variant="outline" className="text-xs">Achat vérifié</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(5)}
                      <span className="font-medium text-sm">Excellent livre !</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Commenté en France le {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm text-gray-700">
                      Un livre vraiment captivant du début à la fin. L'auteur maîtrise parfaitement son sujet et nous transmet sa passion avec clarté. Je recommande vivement !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Look Inside */}
      {showLookInside && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Feuilleter ce livre
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowLookInside(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <h3 className="text-center text-lg font-bold mb-4">{bookTitle}</h3>
                <p className="text-center text-gray-600 mb-6">par {author}</p>
                <hr className="my-4" />
                <h4>Table des matières</h4>
                <ul className="list-none space-y-1">
                  <li>Introduction</li>
                  <li>Chapitre 1 - Les fondamentaux</li>
                  <li>Chapitre 2 - Mise en pratique</li>
                  <li>Chapitre 3 - Cas d'études</li>
                  <li>...</li>
                  <li>Conclusion</li>
                </ul>
                <hr className="my-4" />
                <p className="text-sm text-gray-500 italic text-center">
                  Aperçu limité - Achetez le livre pour accéder au contenu complet
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EbookAmazonSimulator;
