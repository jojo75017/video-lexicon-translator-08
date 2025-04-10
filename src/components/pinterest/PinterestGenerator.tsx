
import React, { useState, useRef, ChangeEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Image, Download, UploadCloud, Search, Palette, Tag, PenTool, RefreshCw, ImagePlus, Copy, Camera, Heart } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { PinterestPin, PinterestImage, PinterestDesign } from '@/types/pinterest';
import { allImages, worldImages, europeImages, franceImages, pinterestDesigns, callToActions, popularHashtags } from '@/data/pinterestImages';
import PinterestPreview from './PinterestPreview';
import ImageGallery from './ImageGallery';

const PinterestGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [customHashtag, setCustomHashtag] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [pin, setPin] = useState<PinterestPin>({
    title: 'Découvrez les merveilles de Paris',
    description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
    hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
    callToAction: 'Découvrir',
    image: franceImages[1], // Paris image
    uploadedImage: null,
    design: pinterestDesigns[0]
  });

  const updatePin = (field: keyof PinterestPin, value: any) => {
    setPin({ ...pin, [field]: value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limiter à 40 caractères
    if (value.length <= 40) {
      updatePin('title', value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limiter à ~50 mots (environ 300 caractères)
    if (value.length <= 300) {
      updatePin('description', value);
    }
  };

  const handleAddHashtag = () => {
    if (customHashtag && !pin.hashtags.includes(customHashtag)) {
      const updatedHashtags = [...pin.hashtags, customHashtag];
      updatePin('hashtags', updatedHashtags);
      setCustomHashtag('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    const updatedHashtags = pin.hashtags.filter(t => t !== tag);
    updatePin('hashtags', updatedHashtags);
  };

  const handleSelectHashtag = (tag: string) => {
    if (!pin.hashtags.includes(tag)) {
      const updatedHashtags = [...pin.hashtags, tag];
      updatePin('hashtags', updatedHashtags);
    }
  };

  const handleSelectDesign = (designId: string) => {
    const selectedDesign = pinterestDesigns.find(d => d.id === designId);
    if (selectedDesign) {
      updatePin('design', selectedDesign);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePin('uploadedImage', reader.result as string);
        updatePin('image', null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImage = (image: PinterestImage) => {
    updatePin('image', image);
    updatePin('uploadedImage', null);
    toast.success(`Image "${image.title}" sélectionnée`);
  };

  const getFilteredImages = () => {
    let images = allImages;
    
    if (selectedImageCategory === 'monde') {
      images = worldImages;
    } else if (selectedImageCategory === 'europe') {
      images = europeImages;
    } else if (selectedImageCategory === 'france') {
      images = franceImages;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return images.filter(
        img => 
          img.title.toLowerCase().includes(query) || 
          img.country?.toLowerCase().includes(query) || 
          img.region?.toLowerCase().includes(query)
      );
    }
    
    return images;
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      toast.info("Génération de l'image en cours...");
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `pinterest-${pin.title.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = image;
      link.click();
      
      toast.success("Image téléchargée avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors de la génération de l'image");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-6">
        <Tabs 
          defaultValue="design" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="design" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              <span className="hidden sm:inline">Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Hashtags</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-4">
            <h2 className="text-lg font-medium">Style et apparence</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pinterestDesigns.map(design => (
                <Card
                  key={design.id}
                  className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${pin.design.id === design.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectDesign(design.id)}
                  style={{
                    background: design.primaryColor,
                    color: design.textColor
                  }}
                >
                  <div className="flex flex-col h-24 justify-between">
                    <div className="font-semibold truncate" style={{ fontFamily: design.titleFont }}>{design.name}</div>
                    <div 
                      className="mt-2 text-xs rounded p-1" 
                      style={{ 
                        background: design.secondaryColor,
                        color: design.textColor,
                        fontFamily: design.descriptionFont
                      }}
                    >
                      Aperçu du texte
                    </div>
                    <div 
                      className="mt-1 h-4 rounded-full" 
                      style={{ background: design.accentColor }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="call-to-action">Appel à l'action</Label>
              <Select 
                value={pin.callToAction} 
                onValueChange={val => updatePin('callToAction', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un appel à l'action" />
                </SelectTrigger>
                <SelectContent>
                  {callToActions.map(cta => (
                    <SelectItem key={cta} value={cta}>{cta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="flex justify-between">
                  <span>Titre (max 40 caractères)</span>
                  <span className={`text-xs ${pin.title.length > 35 ? 'text-orange-500' : ''}`}>
                    {pin.title.length}/40
                  </span>
                </Label>
                <Input
                  id="title"
                  placeholder="Titre accrocheur"
                  value={pin.title}
                  onChange={handleTitleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="flex justify-between">
                  <span>Description (environ 50 mots)</span>
                  <span className={`text-xs ${pin.description.length > 270 ? 'text-orange-500' : ''}`}>
                    {pin.description.length}/300
                  </span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre épingle en 50 mots environ"
                  value={pin.description}
                  onChange={handleDescriptionChange}
                  className="mt-1 min-h-24"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md">
                    <UploadCloud className="h-4 w-4" />
                    <span>Charger une image</span>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" type="button">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Format optimal: 1000x1500 pixels (ratio 2:3)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {pin.uploadedImage && (
                <div className="relative group border rounded-md overflow-hidden h-[200px]">
                  <img 
                    src={pin.uploadedImage} 
                    alt="Image chargée"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => updatePin('uploadedImage', null)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Select 
                    value={selectedImageCategory} 
                    onValueChange={(val: 'monde' | 'europe' | 'france' | 'all') => setSelectedImageCategory(val)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les images</SelectItem>
                      <SelectItem value="monde">Pays du monde</SelectItem>
                      <SelectItem value="europe">Pays d'Europe</SelectItem>
                      <SelectItem value="france">Régions de France</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une image..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <ImageGallery 
                  images={getFilteredImages()} 
                  onSelectImage={handleSelectImage}
                  selectedImage={pin.image}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hashtags" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un hashtag"
                  value={customHashtag}
                  onChange={(e) => setCustomHashtag(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddHashtag} type="button" disabled={!customHashtag}>
                  Ajouter
                </Button>
              </div>
              
              <div>
                <Label className="mb-2 block">Hashtags populaires</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {popularHashtags.slice(0, 15).map(tag => (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleSelectHashtag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Hashtags sélectionnés</Label>
                <div className="flex flex-wrap gap-2">
                  {pin.hashtags.map(tag => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      #{tag}
                      <button 
                        onClick={() => handleRemoveHashtag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === 'design') setActiveTab('hashtags');
              else if (activeTab === 'content') setActiveTab('design');
              else if (activeTab === 'images') setActiveTab('content');
              else if (activeTab === 'hashtags') setActiveTab('images');
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Changer d'onglet
          </Button>
          
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 sticky top-4">
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Aperçu Pinterest</h2>
          <div className="flex justify-center">
            <div ref={previewRef}>
              <PinterestPreview pin={pin} />
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                toast.success("Lien copié!");
                // Simuler la copie d'un lien
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PinterestGenerator;
