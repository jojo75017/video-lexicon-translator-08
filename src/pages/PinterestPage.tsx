import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Palette, Copy, Download, Hash, Image, Upload, Settings, History, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { usePinterestGenerator } from '@/hooks/usePinterestGenerator';
import { useSocialContent } from '@/hooks/useSocialContent';
import { usePinHistory } from '@/hooks/usePinHistory';

const defaultPin: PinterestPin = {
  title: '',
  description: '',
  globalDescription: '',
  hashtags: [],
  tags: [],
  callToAction: '',
  image: null,
  uploadedImage: null,
  design: null,
  showHashtags: true
};

const PinterestPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, addPin, removePin, clearHistory } = usePinHistory();
  
  const {
    pin,
    updatePin,
    activeTab,
    setActiveTab,
    historyVisible,
    setHistoryVisible,
    searchQuery,
    setSearchQuery,
    selectedImageCategory,
    setSelectedImageCategory,
    imageSource,
    setImageSource,
    images,
    loading,
    customHashtag,
    setCustomHashtag,
    instagramApiKey,
    setInstagramApiKey,
    handleSearch,
    handleFilterImages,
    handleSaveInstagramApiKey,
    handleImageUpload,
    handleSelectImage,
    resetPin,
    generateQuickContent
  } = usePinterestGenerator(defaultPin);

  const { generateSocialContent } = useSocialContent({ updatePin, setActiveTab });

  const handleSavePin = () => {
    if (!pin.title || !pin.description) {
      toast.error('Veuillez remplir au moins le titre et la description');
      return;
    }
    
    addPin(pin);
    toast.success('Pin sauvegardé dans l\'historique');
  };

  const handleLoadFromHistory = (historicalPin: PinterestPin) => {
    Object.keys(historicalPin).forEach(key => {
      updatePin(key as keyof PinterestPin, historicalPin[key as keyof PinterestPin]);
    });
    setHistoryVisible(false);
    toast.success('Pin chargé depuis l\'historique');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const addCustomHashtag = () => {
    if (customHashtag && !pin.hashtags.includes(customHashtag)) {
      const newHashtag = customHashtag.startsWith('#') ? customHashtag : `#${customHashtag}`;
      updatePin('hashtags', [...pin.hashtags, newHashtag]);
      setCustomHashtag('');
      toast.success('Hashtag ajouté');
    }
  };

  const removeHashtag = (index: number) => {
    const newHashtags = pin.hashtags.filter((_, i) => i !== index);
    updatePin('hashtags', newHashtags);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
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
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setHistoryVisible(!historyVisible)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Historique ({history.length})
            </Button>
            <Button onClick={handleSavePin} className="gap-2">
              <Download className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel principal */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Génération rapide */}
                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Génération Rapide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => generateSocialContent('pinterest')}
                          className="text-xs"
                        >
                          Pinterest
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => generateSocialContent('instagram')}
                          className="text-xs"
                        >
                          Instagram
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => generateSocialContent('facebook')}
                          className="text-xs"
                        >
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => generateSocialContent('linkedin')}
                          className="text-xs"
                        >
                          LinkedIn
                        </Button>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-sm">Templates thématiques</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQuickContent('inspiration')}
                            className="text-xs h-8"
                          >
                            ✨ Inspiration
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQuickContent('diy')}
                            className="text-xs h-8"
                          >
                            🎨 DIY
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQuickContent('cuisine')}
                            className="text-xs h-8"
                          >
                            🍴 Cuisine
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQuickContent('voyage')}
                            className="text-xs h-8"
                          >
                            ✈️ Voyage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Titre */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Titre de l'épingle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Entrez le titre de votre épingle..."
                        value={pin.title}
                        onChange={(e) => updatePin('title', e.target.value)}
                        className="text-lg font-medium"
                      />
                      <div className="text-sm text-muted-foreground">
                        {pin.title.length}/100 caractères
                      </div>
                      {pin.title && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(pin.title, 'Titre')}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copier le titre
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>📝 Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Rédigez une description engageante pour votre épingle..."
                        value={pin.description}
                        onChange={(e) => updatePin('description', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="text-sm text-muted-foreground">
                        {pin.description.length}/500 caractères
                      </div>
                      {pin.description && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(pin.description, 'Description')}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copier la description
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description globale */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌍 Description Globale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Description générale de votre contenu..."
                        value={pin.globalDescription}
                        onChange={(e) => updatePin('globalDescription', e.target.value)}
                        rows={3}
                      />
                      <div className="text-sm text-muted-foreground">
                        {pin.globalDescription.length}/300 caractères
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hashtags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ajouter un hashtag..."
                          value={customHashtag}
                          onChange={(e) => setCustomHashtag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomHashtag()}
                        />
                        <Button onClick={addCustomHashtag} size="sm">
                          Ajouter
                        </Button>
                      </div>
                      
                      {pin.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {pin.hashtags.map((hashtag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeHashtag(index)}
                            >
                              {hashtag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        {pin.hashtags.length}/30 hashtags
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                {/* Upload d'image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload votre image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      {pin.uploadedImage && (
                        <div className="relative">
                          <img
                            src={pin.uploadedImage}
                            alt="Image uploadée"
                            className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updatePin('uploadedImage', null)}
                            className="absolute top-2 right-2"
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Banque d'images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Banque d'images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Rechercher des images..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedImageCategory === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedImageCategory('all');
                            handleFilterImages('all');
                          }}
                        >
                          Toutes
                        </Button>
                        <Button
                          variant={selectedImageCategory === 'monde' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedImageCategory('monde');
                            handleFilterImages('monde');
                          }}
                        >
                          Monde
                        </Button>
                        <Button
                          variant={selectedImageCategory === 'europe' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedImageCategory('europe');
                            handleFilterImages('europe');
                          }}
                        >
                          Europe
                        </Button>
                        <Button
                          variant={selectedImageCategory === 'france' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedImageCategory('france');
                            handleFilterImages('france');
                          }}
                        >
                          France
                        </Button>
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${
                                pin.image?.id === image.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                              }`}
                              onClick={() => handleSelectImage(image)}
                            >
                              <img
                                src={image.src}
                                alt={image.title}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                                <p className="text-xs truncate">{image.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Templates de Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Templates de design à venir...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Paramètres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Clé API Instagram (optionnel)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="Votre clé API Instagram..."
                            value={instagramApiKey}
                            onChange={(e) => setInstagramApiKey(e.target.value)}
                          />
                          <Button onClick={handleSaveInstagramApiKey} size="sm">
                            Sauvegarder
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={resetPin}
                        className="w-full"
                      >
                        Réinitialiser le formulaire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Aperçu et Historique */}
          <div className="space-y-6">
            {/* Aperçu */}
            <Card>
              <CardHeader>
                <CardTitle>👁️ Aperçu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pin.image || pin.uploadedImage) && (
                    <div className="relative">
                      <img
                        src={pin.uploadedImage || pin.image?.src}
                        alt="Aperçu"
                        className="w-full rounded-lg shadow-md"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                        <h3 className="text-white font-bold text-sm">
                          {pin.title || 'Titre de l\'épingle'}
                        </h3>
                      </div>
                    </div>
                  )}
                  
                  {pin.title && (
                    <div>
                      <h3 className="font-semibold text-lg">{pin.title}</h3>
                    </div>
                  )}
                  
                  {pin.description && (
                    <p className="text-sm text-muted-foreground">{pin.description}</p>
                  )}
                  
                  {pin.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {pin.hashtags.slice(0, 10).map((hashtag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                      {pin.hashtags.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{pin.hashtags.length - 10}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            {historyVisible && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Historique
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                      disabled={history.length === 0}
                    >
                      Vider
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun pin dans l'historique
                      </p>
                    ) : (
                      history.map((historicalPin, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => handleLoadFromHistory(historicalPin)}
                        >
                          <h4 className="font-medium text-sm truncate">
                            {historicalPin.title || 'Sans titre'}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {historicalPin.description || 'Sans description'}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {historicalPin.hashtags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Conseils Pinterest Generator Pro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>• Format optimal : 1000x1500px (ratio 2:3)</div>
                  <div>• Texte lisible et contrasté</div>
                  <div>• Maximum 30 hashtags</div>
                  <div>• Titre accrocheur de 100 caractères max</div>
                  <div>• Description détaillée de 500 caractères max</div>
                  <div>• Utilisez des couleurs vives</div>
                  <div>• Ajoutez votre logo discrètement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterestPage;