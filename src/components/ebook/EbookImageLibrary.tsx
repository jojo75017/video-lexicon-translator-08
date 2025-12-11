import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  Plus, 
  ArrowLeft,
  Upload,
  Search,
  Grid3X3,
  List,
  Copy,
  Check,
  Loader2,
  FolderPlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EbookFolder {
  id: string;
  name: string;
  imageCount: number;
}

interface StoredImage {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size?: number;
}

interface EbookImageLibraryProps {
  ebookId?: string;
  ebookTitle?: string;
  onImageSelect?: (url: string) => void;
}

export const EbookImageLibrary: React.FC<EbookImageLibraryProps> = ({
  ebookId,
  ebookTitle,
  onImageSelect
}) => {
  const [folders, setFolders] = useState<EbookFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [images, setImages] = useState<StoredImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (currentFolder) {
      loadImages(currentFolder);
    }
  }, [currentFolder]);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return;
      }

      const { data, error } = await supabase.storage
        .from('ebook-images')
        .list(user.id, { limit: 100 });

      if (error) throw error;

      // Get folders (directories)
      const folderList: EbookFolder[] = [];
      const seenFolders = new Set<string>();

      for (const item of data || []) {
        if (item.name && !seenFolders.has(item.name)) {
          seenFolders.add(item.name);
          
          // Count images in folder
          const { data: folderImages } = await supabase.storage
            .from('ebook-images')
            .list(`${user.id}/${item.name}`);
          
          folderList.push({
            id: item.name,
            name: item.name,
            imageCount: folderImages?.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))?.length || 0
          });
        }
      }

      setFolders(folderList);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setIsLoading(false);
    }
  };

  const loadImages = async (folderId: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from('ebook-images')
        .list(`${user.id}/${folderId}`, { limit: 100 });

      if (error) throw error;

      const imageList: StoredImage[] = [];
      for (const file of data || []) {
        if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const { data: urlData } = supabase.storage
            .from('ebook-images')
            .getPublicUrl(`${user.id}/${folderId}/${file.name}`);

          imageList.push({
            id: file.id || file.name,
            name: file.name,
            url: urlData.publicUrl,
            createdAt: file.created_at || new Date().toISOString(),
            size: file.metadata?.size
          });
        }
      }

      setImages(imageList);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Erreur lors du chargement des images');
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Nom de dossier requis');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create a placeholder file to create the folder
      const placeholderContent = new Blob([''], { type: 'text/plain' });
      const { error } = await supabase.storage
        .from('ebook-images')
        .upload(`${user.id}/${newFolderName}/.placeholder`, placeholderContent);

      if (error && !error.message.includes('already exists')) throw error;

      toast.success('Dossier créé !');
      setNewFolderName('');
      setShowNewFolderInput(false);
      loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Erreur lors de la création du dossier');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentFolder) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return;
      }

      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('ebook-images')
          .upload(`${user.id}/${currentFolder}/${fileName}`, file);

        if (error) throw error;
      }

      toast.success(`${files.length} image(s) uploadée(s) !`);
      loadImages(currentFolder);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageName: string) => {
    if (!currentFolder) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.storage
        .from('ebook-images')
        .remove([`${user.id}/${currentFolder}/${imageName}`]);

      if (error) throw error;

      toast.success('Image supprimée');
      loadImages(currentFolder);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // List all files in folder
      const { data: files } = await supabase.storage
        .from('ebook-images')
        .list(`${user.id}/${folderId}`);

      if (files && files.length > 0) {
        const filePaths = files.map(f => `${user.id}/${folderId}/${f.name}`);
        await supabase.storage.from('ebook-images').remove(filePaths);
      }

      toast.success('Dossier supprimé');
      loadFolders();
    } catch (error) {
      console.error('Delete folder error:', error);
      toast.error('Erreur lors de la suppression du dossier');
    }
  };

  const copyImageUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copiée !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentFolder && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentFolder(null);
                  setImages([]);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              {currentFolder ? `📁 ${currentFolder}` : '🖼️ Bibliothèque d\'images'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {currentFolder ? (
            <div className="flex gap-2">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="outline" disabled={isUploading} asChild>
                  <span className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Uploader
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="flex gap-2">
              {showNewFolderInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom du dossier..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-40"
                    onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                  />
                  <Button size="sm" onClick={createFolder}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowNewFolderInput(false)}>
                    ✕
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowNewFolderInput(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Nouveau dossier
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Folders View */}
        {!currentFolder && !isLoading && (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            {filteredFolders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun dossier. Créez-en un pour organiser vos images !</p>
              </div>
            ) : (
              filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`group relative bg-muted/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center p-4 gap-4' : 'p-6'
                  }`}
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <div className={viewMode === 'grid' ? 'text-center' : ''}>
                    <FolderOpen className={`h-12 w-12 text-primary/70 ${viewMode === 'grid' ? 'mx-auto mb-3' : ''}`} />
                  </div>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <p className="font-medium truncate">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.imageCount} image(s)</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Images View */}
        {currentFolder && !isLoading && (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            {filteredImages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune image dans ce dossier</p>
              </div>
            ) : (
              filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`group relative bg-muted/30 rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all ${
                    viewMode === 'list' ? 'flex items-center p-3 gap-4' : ''
                  }`}
                >
                  <div className={viewMode === 'grid' ? 'aspect-square' : 'w-16 h-16 flex-shrink-0'}>
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-3'}>
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(image.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-1 ${
                    viewMode === 'grid' 
                      ? 'absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center' 
                      : ''
                  }`}>
                    {onImageSelect && (
                      <Button
                        size="sm"
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        onClick={() => onImageSelect(image.url)}
                      >
                        <Plus className="h-4 w-4" />
                        {viewMode === 'list' && <span className="ml-1">Utiliser</span>}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      onClick={() => copyImageUrl(image.url, image.id)}
                    >
                      {copiedId === image.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      onClick={() => downloadImage(image.url, image.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      onClick={() => deleteImage(image.name)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EbookImageLibrary;
