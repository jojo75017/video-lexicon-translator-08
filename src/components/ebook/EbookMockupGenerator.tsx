
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Image as ImageIcon, Download, Upload, Type, Move } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';

const EbookMockupGenerator: React.FC = () => {
  const [title, setTitle] = useState("Mon eBook");
  const [author, setAuthor] = useState("Auteur");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [template, setTemplate] = useState("stack");
  const [titleColor, setTitleColor] = useState("#1a1f2c");
  const [titleRotation, setTitleRotation] = useState(0);
  const [titleSize, setTitleSize] = useState(24);
  const [authorColor, setAuthorColor] = useState("#1a1f2c");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        toast.success("Image de couverture téléchargée avec succès!");
      };
      reader.readAsDataURL(file);
    }
  };

  const mockupTemplates = [
    { 
      id: "stack", 
      name: "Stack 3D", 
      description: "Pile de livres en 3D avec perspective" 
    },
    { 
      id: "single", 
      name: "Single 3D", 
      description: "Livre unique en 3D avec ombre" 
    },
    { 
      id: "flat", 
      name: "Flat Design", 
      description: "Design plat moderne avec overlay" 
    }
  ];

  const downloadMockup = async () => {
    if (!previewRef.current) {
      toast.error("Erreur: Impossible de générer l'aperçu");
      return;
    }
    
    try {
      console.log("Début de la génération du mockup...");
      
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        onclone: (document, element) => {
          console.log("Clonage de l'élément pour la capture...");
          // Assurez-vous que les styles sont bien appliqués
          const titleElement = element.querySelector('.book-title');
          const authorElement = element.querySelector('.book-author');
          if (titleElement) {
            console.log("Styles du titre appliqués");
          }
          if (authorElement) {
            console.log("Styles de l'auteur appliqués");
          }
        }
      });
      
      console.log("Canvas généré avec succès");
      
      // Création d'un nouveau canvas avec fond blanc
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) {
        toast.error("Erreur: Contexte de canvas invalide");
        return;
      }
      
      // Fond blanc
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Dessin du mockup
      ctx.drawImage(canvas, 0, 0);
      
      // Création du lien de téléchargement
      const link = document.createElement('a');
      const filename = title ? 
        `${title.toLowerCase().replace(/\s+/g, '-')}-mockup.png` : 
        'ebook-mockup.png';
      
      link.download = filename;
      link.href = finalCanvas.toDataURL('image/png', 1.0);
      
      console.log("Lien de téléchargement créé");
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Mockup téléchargé avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du mockup");
    }
  };

  const colorOptions = [
    { value: "#1a1f2c", label: "Noir" },
    { value: "#9b87f5", label: "Violet" },
    { value: "#7E69AB", label: "Violet foncé" },
    { value: "#F97316", label: "Orange" },
    { value: "#0EA5E9", label: "Bleu" },
    { value: "#ea384c", label: "Rouge" },
    { value: "#D946EF", label: "Rose" }
  ];

  const renderMockup = () => {
    if (!coverImage) return null;

    const mockupStyle = {
      position: 'relative' as const,
      maxWidth: '400px',
      margin: '0 auto'
    };

    const titleStyle = {
      color: titleColor,
      fontSize: `${titleSize}px`,
      transform: `rotate(${titleRotation}deg)`,
      transformOrigin: 'left bottom',
      transition: 'all 0.3s ease',
      marginBottom: '0.5rem',
      fontWeight: 'bold' as const
    };

    const authorStyle = {
      color: authorColor,
      fontSize: '16px',
      transition: 'all 0.3s ease'
    };

    switch (template) {
      case 'stack':
        return (
          <div style={mockupStyle}>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="absolute w-full aspect-[3/4] rounded-lg shadow-2xl overflow-hidden"
                style={{
                  transform: `translate(${index * 20}px, ${-index * 10}px) rotate(${index * 2}deg)`,
                  zIndex: 3 - index
                }}
              >
                <img
                  src={coverImage}
                  alt={`Book stack ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="book-title" style={titleStyle}>{title}</h3>
                      <p className="book-author" style={authorStyle}>{author}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'single':
        return (
          <div style={mockupStyle} className="transform hover:scale-105 transition-transform duration-300">
            <div className="relative aspect-[3/4] rounded-lg shadow-2xl overflow-hidden">
              <img
                src={coverImage}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="book-title" style={titleStyle}>{title}</h3>
                  <p className="book-author" style={authorStyle}>{author}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default: // flat
        return (
          <div style={mockupStyle}>
            <div className="relative aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
              <img
                src={coverImage}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="book-title" style={titleStyle}>{title}</h3>
                  <p className="book-author" style={authorStyle}>{author}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        Générateur de Mockup eBook
      </h2>

      <Tabs defaultValue="design" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-64">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'eBook</Label>
                <Input
                  id="title"
                  placeholder="Entrez le titre..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Couleur du titre</Label>
                <Select value={titleColor} onValueChange={setTitleColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Taille du titre</Label>
                <div className="flex items-center gap-4">
                  <Type className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[titleSize]}
                    onValueChange={(value) => setTitleSize(value[0])}
                    min={16}
                    max={48}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{titleSize}px</span>
                </div>
              </div>

              <div>
                <Label>Rotation du titre</Label>
                <div className="flex items-center gap-4">
                  <Move className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[titleRotation]}
                    onValueChange={(value) => setTitleRotation(value[0])}
                    min={-45}
                    max={45}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{titleRotation}°</span>
                </div>
              </div>

              <div>
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  placeholder="Nom de l'auteur..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div>
                <Label>Couleur de l'auteur</Label>
                <Select value={authorColor} onValueChange={setAuthorColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockupTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="space-y-1">
                          <div className="font-medium">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Image de couverture</Label>
              <Card className="p-4 border-dashed border-2 text-center space-y-4">
                {coverImage ? (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => setCoverImage(null)}
                    >
                      Changer
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-500">
                      Glissez une image ou
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <label>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        Choisir un fichier
                      </label>
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="default"
              onClick={downloadMockup}
              className="gap-2"
              disabled={!title || !coverImage}
            >
              <Download className="h-4 w-4" />
              Télécharger le mockup
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="min-h-[400px]">
          <div ref={previewRef} className="flex justify-center items-center p-8 bg-white">
            {coverImage ? renderMockup() : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <BookOpen className="h-12 w-12 mb-4" />
                <p>Téléchargez une image de couverture pour voir l'aperçu</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EbookMockupGenerator;
