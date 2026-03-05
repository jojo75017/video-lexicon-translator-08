import React, { useState, useEffect, useCallback } from 'react';
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
  FolderPlus,
  FileArchive,
  RefreshCw,
  PackageOpen,
  Eye,
  DownloadCloud,
  Maximize2,
  X,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
  chapterInfo?: {
    chapterNumber: number;
    chapterTitle: string;
  };
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
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<StoredImage | null>(null);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [totalStorageSize, setTotalStorageSize] = useState(0);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (currentFolder) {
      loadImages(currentFolder);
      setSelectedImages(new Set());
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

      const folderList: EbookFolder[] = [];
      const seenFolders = new Set<string>();
      let totalSize = 0;

      for (const item of data || []) {
        if (!item.name || item.name.startsWith('.') || item.name.includes('.')) continue;
        
        if (!seenFolders.has(item.name)) {
          seenFolders.add(item.name);
          
          const { data: folderImages, error: listError } = await supabase.storage
            .from('ebook-images')
            .list(`${user.id}/${item.name}`, { limit: 500 });
          
          if (listError) continue;

          const imageFiles = folderImages?.filter(f => 
            f.name && !f.name.startsWith('.') && f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          ) || [];

          totalSize += imageFiles.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);

          folderList.push({
            id: item.name,
            name: item.name,
            imageCount: imageFiles.length
          });
        }
      }

      setFolders(folderList);
      setTotalStorageSize(totalSize);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setIsLoading(false);
    }
  };

  const parseChapterInfo = (filename: string): { chapterNumber: number; chapterTitle: string } | undefined => {
    const match = filename.match(/chapitre-chapter-\d+-(\d+)-(.+)\.(png|jpg|jpeg|gif|webp)$/i);
    if (match) {
      const chapterNumber = parseInt(match[1], 10) + 1;
      const chapterTitle = match[2].replace(/_/g, ' ').replace(/%20/g, ' ');
      return { chapterNumber, chapterTitle };
    }
    return undefined;
  };

  const loadImages = async (folderId: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from('ebook-images')
        .list(`${user.id}/${folderId}`, { limit: 500 });

      if (error) throw error;

      const imageList: StoredImage[] = [];
      for (const file of data || []) {
        if (file.name && !file.name.startsWith('.') && file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const { data: urlData } = supabase.storage
            .from('ebook-images')
            .getPublicUrl(`${user.id}/${folderId}/${file.name}`);

          imageList.push({
            id: file.id || file.name,
            name: file.name,
            url: urlData.publicUrl,
            createdAt: file.created_at || new Date().toISOString(),
            size: file.metadata?.size,
            chapterInfo: parseChapterInfo(file.name)
          });
        }
      }

      imageList.sort((a, b) => {
        if (a.chapterInfo && b.chapterInfo) return a.chapterInfo.chapterNumber - b.chapterInfo.chapterNumber;
        if (a.chapterInfo) return -1;
        if (b.chapterInfo) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

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

      const placeholderContent = new Blob([''], { type: 'text/plain' });
      const { error } = await supabase.storage
        .from('ebook-images')
        .upload(`${user.id}/${newFolderName.trim()}/.placeholder`, placeholderContent);

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
      if (!user) { toast.error('Vous devez être connecté'); return; }

      let successCount = 0;
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('ebook-images')
          .upload(`${user.id}/${currentFolder}/${fileName}`, file);
        if (!error) successCount++;
      }

      toast.success(`${successCount}/${files.length} image(s) uploadée(s) !`);
      loadImages(currentFolder);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFolder) return;

    if (!file.name.endsWith('.zip')) {
      toast.error('Veuillez sélectionner un fichier ZIP');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Vous devez être connecté'); return; }

      toast.info('📦 Extraction du ZIP en cours...');
      const zip = await JSZip.loadAsync(file);
      const imageFiles: { name: string; blob: Blob }[] = [];

      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        if (relativePath.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          const blob = await zipEntry.async('blob');
          const fileName = relativePath.split('/').pop() || relativePath;
          imageFiles.push({ name: fileName, blob });
        }
      }

      if (imageFiles.length === 0) {
        toast.error('Aucune image trouvée dans le ZIP');
        return;
      }

      toast.info(`📤 Upload de ${imageFiles.length} image(s)...`);

      let successCount = 0;
      for (let i = 0; i < imageFiles.length; i++) {
        const img = imageFiles[i];
        const fileName = `${Date.now()}-${img.name}`;
        const { error } = await supabase.storage
          .from('ebook-images')
          .upload(`${user.id}/${currentFolder}/${fileName}`, img.blob);
        if (!error) successCount++;
        // Small delay to avoid rate limits
        if (i > 0 && i % 10 === 0) await new Promise(r => setTimeout(r, 100));
      }

      toast.success(`✅ ${successCount}/${imageFiles.length} image(s) importée(s) depuis le ZIP !`);
      loadImages(currentFolder);
    } catch (error) {
      console.error('ZIP upload error:', error);
      toast.error("Erreur lors de l'import du ZIP");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // ===== EXPORT ZIP =====
  const exportFolderAsZip = async () => {
    if (!currentFolder || images.length === 0) {
      toast.error('Aucune image à exporter');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();
      const imagesToExport = selectedImages.size > 0 
        ? images.filter(img => selectedImages.has(img.id))
        : images;

      for (let i = 0; i < imagesToExport.length; i++) {
        const img = imagesToExport[i];
        try {
          const response = await fetch(img.url);
          const blob = await response.blob();
          const ext = img.name.split('.').pop() || 'png';
          const cleanName = img.chapterInfo 
            ? `chapitre-${img.chapterInfo.chapterNumber}-${img.chapterInfo.chapterTitle}.${ext}`
            : img.name;
          zip.file(cleanName, blob);
        } catch {
          console.warn(`Impossible de télécharger: ${img.name}`);
        }
        setExportProgress(Math.round(((i + 1) / imagesToExport.length) * 100));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const zipName = `${currentFolder}-images-${new Date().toISOString().slice(0, 10)}.zip`;
      saveAs(content, zipName);
      toast.success(`📦 ZIP exporté avec ${imagesToExport.length} image(s) !`);
    } catch (error) {
      console.error('Export ZIP error:', error);
      toast.error("Erreur lors de l'export ZIP");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // ===== EXPORT ALL FOLDERS =====
  const exportAllAsZip = async () => {
    if (folders.length === 0) {
      toast.error('Aucun dossier à exporter');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const zip = new JSZip();
      let totalImages = 0;
      let processedImages = 0;
      const totalEstimate = folders.reduce((acc, f) => acc + f.imageCount, 0);

      for (const folder of folders) {
        const { data: files } = await supabase.storage
          .from('ebook-images')
          .list(`${user.id}/${folder.id}`, { limit: 500 });

        const folderZip = zip.folder(folder.name);
        if (!folderZip || !files) continue;

        for (const file of files) {
          if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) continue;

          const { data: urlData } = supabase.storage
            .from('ebook-images')
            .getPublicUrl(`${user.id}/${folder.id}/${file.name}`);

          try {
            const response = await fetch(urlData.publicUrl);
            const blob = await response.blob();
            folderZip.file(file.name, blob);
            totalImages++;
          } catch { /* skip */ }

          processedImages++;
          setExportProgress(Math.round((processedImages / Math.max(totalEstimate, 1)) * 100));
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `bibliotheque-images-${new Date().toISOString().slice(0, 10)}.zip`);
      toast.success(`📦 Export complet : ${totalImages} image(s) dans ${folders.length} dossier(s)`);
    } catch (error) {
      console.error('Export all error:', error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
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
      setSelectedImages(prev => { const n = new Set(prev); n.delete(imageName); return n; });
      loadImages(currentFolder);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteSelectedImages = async () => {
    if (!currentFolder || selectedImages.size === 0) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const paths = Array.from(selectedImages).map(id => {
        const img = images.find(i => i.id === id);
        return img ? `${user.id}/${currentFolder}/${img.name}` : null;
      }).filter(Boolean) as string[];

      const { error } = await supabase.storage.from('ebook-images').remove(paths);
      if (error) throw error;
      toast.success(`${selectedImages.size} image(s) supprimée(s)`);
      setSelectedImages(new Set());
      loadImages(currentFolder);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!confirm(`Supprimer le dossier "${folderId}" et toutes ses images ?`)) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: files } = await supabase.storage.from('ebook-images').list(`${user.id}/${folderId}`);
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
      saveAs(blob, name);
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const toggleSelectImage = (id: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(i => i.id)));
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1048576).toFixed(1)} Mo`;
  };

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.chapterInfo?.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalImagesCount = folders.reduce((acc, f) => acc + f.imageCount, 0);

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {currentFolder && (
                <Button variant="ghost" size="icon" onClick={() => { setCurrentFolder(null); setImages([]); }}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5 text-primary" />
                {currentFolder ? `📁 ${currentFolder}` : '🖼️ Bibliothèque d\'images'}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Stats */}
              {!currentFolder && (
                <Badge variant="secondary" className="text-xs">
                  {totalImagesCount} image(s) · {folders.length} dossier(s)
                  {totalStorageSize > 0 && ` · ${formatSize(totalStorageSize)}`}
                </Badge>
              )}
              {currentFolder && images.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {images.length} image(s)
                  {selectedImages.size > 0 && ` · ${selectedImages.size} sélectionnée(s)`}
                </Badge>
              )}

              <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} title="Changer la vue">
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={() => currentFolder ? loadImages(currentFolder) : loadFolders()} title="Rafraîchir">
                <RefreshCw className="h-4 w-4" />
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
                placeholder="Rechercher une image ou un dossier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {currentFolder ? (
              <div className="flex gap-2 flex-wrap">
                {/* Upload images */}
                <input type="file" id="image-upload-lib" multiple accept="image/*" className="hidden" onChange={handleUpload} />
                <label htmlFor="image-upload-lib">
                  <Button variant="outline" size="sm" disabled={isUploading} asChild>
                    <span className="cursor-pointer">
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                      Images
                    </span>
                  </Button>
                </label>

                {/* Upload ZIP */}
                <input type="file" id="zip-upload-lib" accept=".zip" className="hidden" onChange={handleZipUpload} />
                <label htmlFor="zip-upload-lib">
                  <Button variant="outline" size="sm" disabled={isUploading} asChild>
                    <span className="cursor-pointer">
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <PackageOpen className="h-4 w-4 mr-1" />}
                      Import ZIP
                    </span>
                  </Button>
                </label>

                {/* Export ZIP */}
                <Button variant="outline" size="sm" onClick={exportFolderAsZip} disabled={isExporting || images.length === 0}>
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <FileArchive className="h-4 w-4 mr-1" />}
                  Export ZIP {selectedImages.size > 0 && `(${selectedImages.size})`}
                </Button>

                {/* Select all */}
                {images.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {selectedImages.size === filteredImages.length ? 'Désélectionner' : 'Tout sélectionner'}
                  </Button>
                )}

                {/* Delete selected */}
                {selectedImages.size > 0 && (
                  <Button variant="destructive" size="sm" onClick={deleteSelectedImages}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer ({selectedImages.size})
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {showNewFolderInput ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nom du dossier..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-40"
                      onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                      autoFocus
                    />
                    <Button size="sm" onClick={createFolder}><Check className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowNewFolderInput(false)}>✕</Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setShowNewFolderInput(true)}>
                      <FolderPlus className="h-4 w-4 mr-1" />
                      Nouveau dossier
                    </Button>
                    {folders.length > 0 && (
                      <Button variant="outline" size="sm" onClick={exportAllAsZip} disabled={isExporting}>
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <DownloadCloud className="h-4 w-4 mr-1" />}
                        Exporter tout (ZIP)
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Export en cours... {exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

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
                  <p className="font-medium mb-1">Aucun dossier</p>
                  <p className="text-sm">Créez un dossier pour organiser vos images !</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowNewFolderInput(true)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Créer un dossier
                  </Button>
                </div>
              ) : (
                filteredFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`group relative bg-muted/50 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer ${
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
                      onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
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
                  <p className="font-medium mb-1">Aucune image dans ce dossier</p>
                  <p className="text-sm mb-4">Uploadez des images ou importez un fichier ZIP</p>
                  <div className="flex gap-2 justify-center">
                    <label htmlFor="image-upload-lib">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer"><Upload className="h-4 w-4 mr-1" /> Images</span>
                      </Button>
                    </label>
                    <label htmlFor="zip-upload-lib">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer"><PackageOpen className="h-4 w-4 mr-1" /> Import ZIP</span>
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                filteredImages.map((image) => {
                  const isSelected = selectedImages.has(image.id);
                  return (
                    <div
                      key={image.id}
                      className={`group relative bg-muted/30 rounded-xl border overflow-hidden transition-all ${
                        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border/50 hover:border-primary/50'
                      } ${viewMode === 'list' ? 'flex items-center p-3 gap-4' : ''}`}
                    >
                      {/* Selection checkbox */}
                      <button
                        className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background/80 border-muted-foreground/50 opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={(e) => { e.stopPropagation(); toggleSelectImage(image.id); }}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>

                      <div
                        className={`relative cursor-pointer ${viewMode === 'grid' ? 'aspect-square' : 'w-16 h-16 flex-shrink-0'}`}
                        onClick={() => setPreviewImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.chapterInfo?.chapterTitle || image.name}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                        {viewMode === 'grid' && image.chapterInfo && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                            Ch. {image.chapterInfo.chapterNumber}
                          </div>
                        )}
                        {/* Hover overlay for grid */}
                        {viewMode === 'grid' && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setPreviewImage(image); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {onImageSelect && (
                              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onImageSelect(image.url); toast.success('Image sélectionnée !'); }}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyImageUrl(image.url, image.id); }}>
                              {copiedId === image.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); downloadImage(image.url, image.name); }}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-3'}>
                        {image.chapterInfo ? (
                          <>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded">
                                Chapitre {image.chapterInfo.chapterNumber}
                              </span>
                            </div>
                            <p className="text-sm font-medium truncate capitalize">{image.chapterInfo.chapterTitle}</p>
                          </>
                        ) : (
                          <p className="text-sm font-medium truncate">{image.name}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(image.createdAt).toLocaleDateString('fr-FR')}</span>
                          {image.size && <span>· {formatSize(image.size)}</span>}
                        </div>
                      </div>

                      {/* List mode actions */}
                      {viewMode === 'list' && (
                        <div className="flex gap-1">
                          {onImageSelect && (
                            <Button size="sm" variant="ghost" onClick={() => { onImageSelect(image.url); toast.success('Image sélectionnée !'); }}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => copyImageUrl(image.url, image.id)}>
                            {copiedId === image.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => downloadImage(image.url, image.name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteImage(image.name)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}

                      {/* Grid mode delete - outside overlay */}
                      {viewMode === 'grid' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute bottom-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          onClick={(e) => { e.stopPropagation(); deleteImage(image.name); }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Help info */}
          {!currentFolder && !isLoading && folders.length > 0 && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Cliquez sur un dossier pour voir et gérer ses images. Vous pouvez importer des images individuellement 
                ou via un fichier ZIP, et exporter vos dossiers en ZIP pour les sauvegarder.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewImage?.chapterInfo ? (
                <>
                  <Badge>Chapitre {previewImage.chapterInfo.chapterNumber}</Badge>
                  <span className="capitalize">{previewImage.chapterInfo.chapterTitle}</span>
                </>
              ) : (
                <span className="truncate">{previewImage?.name}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="space-y-4">
              <div className="flex justify-center bg-muted/30 rounded-lg p-2 max-h-[60vh] overflow-auto">
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="max-w-full max-h-[58vh] object-contain rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {new Date(previewImage.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                  {previewImage.size && ` · ${formatSize(previewImage.size)}`}
                </div>
                <div className="flex gap-2">
                  {onImageSelect && (
                    <Button size="sm" onClick={() => { onImageSelect(previewImage.url); setPreviewImage(null); toast.success('Image sélectionnée !'); }}>
                      <Plus className="h-4 w-4 mr-1" /> Utiliser
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => copyImageUrl(previewImage.url, previewImage.id)}>
                    <Copy className="h-4 w-4 mr-1" /> Copier URL
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadImage(previewImage.url, previewImage.name)}>
                    <Download className="h-4 w-4 mr-1" /> Télécharger
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EbookImageLibrary;
