import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Image as ImageIcon, Download, Upload, Type, Move, ArrowUp, ArrowDown, AlignCenterHorizontal, ArrowRight, Sun } from "lucide-react";
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
  const [titlePosition, setTitlePosition] = useState<"top" | "center" | "bottom">("center");
  const [titleFont, setTitleFont] = useState("font-sans");
  const [authorFont, setAuthorFont] = useState("font-sans");
  const [titleShadow, setTitleShadow] = useState("shadow-none");
  const [authorShadow, setAuthorShadow] = useState("shadow-none");
  const [bookRotation, setBookRotation] = useState(15);
  const [stackSpacing, setStackSpacing] = useState(15);
  const [coverOpacity, setCoverOpacity] = useState(1);
  const [backgroundGradient, setBackgroundGradient] = useState("from-black/60");
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

  const renderMockup = () => {
    if (!coverImage) return null;

    const getPositionClasses = () => {
      switch (titlePosition) {
        case "top": return "items-start pt-16";
        case "center": return "items-center";
        case "bottom": return "items-end pb-16";
        default: return "items-center";
      }
    };

    const bookContent = (
      <div 
        className={`absolute inset-0 bg-gradient-to-t ${backgroundGradient} to-transparent flex ${getPositionClasses()} justify-center p-6`}
        style={{ opacity: coverOpacity }}
      >
        <div 
          className="text-center space-y-2 relative w-full"
          style={{
            transform: `rotate(${titleRotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <h3 
            className={`font-bold text-center break-words max-w-[80%] mx-auto ${titleFont} ${titleShadow} drop-shadow-2xl`}
            style={{
              color: titleColor,
              fontSize: `${titleSize}px`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5), -2px -2px 4px rgba(255,255,255,0.5)'
            }}
          >
            {title}
          </h3>
          <p 
            className={`absolute bottom-0 left-0 right-0 text-center mt-8 ${authorFont} ${authorShadow}`}
            style={{ 
              color: authorColor,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {author}
          </p>
        </div>
      </div>
    );

    const renderBookSpine = (offset: number) => (
      <div
        className="absolute right-0 top-0 bottom-0 w-[20px] bg-gray-200 transform-preserve"
        style={{
          transform: `translateX(${offset}px) rotateY(90deg)`,
          transformOrigin: 'right',
          background: 'linear-gradient(to right, #e5e7eb, #d1d5db)'
        }}
      />
    );

    if (template === 'stack') {
      return (
        <div id="preview-container" className="relative w-[300px] h-[400px] perspective-1000">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative"
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: `translate(${i * stackSpacing}px, ${-i * (stackSpacing/2)}px)`,
                zIndex: 2 - i
              }}
            >
              <div
                className="book-cover absolute inset-0 rounded-lg shadow-xl overflow-hidden bg-white"
                style={{
                  transform: `perspective(2000px) rotateY(-${bookRotation}deg)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                <img
                  src={coverImage}
                  alt={`Book cover ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && bookContent}
                {renderBookSpine(0)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'single') {
      return (
        <div id="preview-container" className="relative w-[300px] h-[400px] perspective-1000">
          <div
            className="book-cover absolute inset-0 rounded-lg shadow-xl overflow-hidden bg-white"
            style={{
              transform: `perspective(2000px) rotateY(-${bookRotation}deg)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <img
              src={coverImage}
              alt="Book cover"
              className="w-full h-full object-cover"
            />
            {bookContent}
            {renderBookSpine(0)}
          </div>
        </div>
      );
    }

    return (
      <div id="preview-container" className="relative w-[300px] h-[400px]">
        <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden bg-white">
          <img
            src={coverImage}
            alt="Book cover"
            className="w-full h-full object-cover"
          />
          {bookContent}
        </div>
      </div>
    );
  };

  const downloadMockup = async () => {
    if (!previewRef.current || !coverImage) {
      toast.error("Erreur: Veuillez d'abord ajouter une image de couverture");
      return;
    }

    toast.loading("Génération du mockup en cours...");

    try {
      const previewContainer = previewRef.current.querySelector('#preview-container');
      if (!previewContainer) {
        throw new Error("Élément de prévisualisation introuvable");
      }

      const tempContainer = previewContainer.cloneNode(true) as HTMLElement;
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '300px';
      tempContainer.style.height = '400px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.zIndex = '-1000';
      document.body.appendChild(tempContainer);

      const books = tempContainer.querySelectorAll('.book-cover');
      books.forEach((book, index) => {
        const originalBook = previewContainer.querySelectorAll('.book-cover')[index];
        const computedStyle = window.getComputedStyle(originalBook);
        const transformStyle = computedStyle.transform;
        const bookElement = book as HTMLElement;
        
        bookElement.style.transform = transformStyle;
        bookElement.style.transformStyle = 'preserve-3d';
        bookElement.style.backfaceVisibility = 'hidden';
        bookElement.style.perspective = '2000px';
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: 300,
        height: 400,
        foreignObjectRendering: true,
        removeContainer: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('#preview-container') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            const books = clonedElement.querySelectorAll('.book-cover');
            books.forEach((book) => {
              const bookElement = book as HTMLElement;
              bookElement.style.transformStyle = 'preserve-3d';
            });
          }
        }
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-mockup.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.dismiss();
      toast.success("Mockup téléchargé avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors de la génération du mockup");
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

  const fontOptions = [
    { value: "font-sans", label: "Sans Serif" },
    { value: "font-serif", label: "Serif" },
    { value: "font-mono", label: "Monospace" },
    { value: "font-playfair", label: "Playfair" },
    { value: "font-poppins", label: "Poppins" },
    { value: "font-roboto", label: "Roboto" }
  ];

  const shadowOptions = [
    { value: "shadow-none", label: "Aucun" },
    { value: "shadow-sm", label: "Léger" },
    { value: "shadow-md", label: "Moyen" },
    { value: "shadow-lg", label: "Large" },
    { value: "drop-shadow-md", label: "Drop Shadow" },
    { value: "text-shadow-sm", label: "Text Shadow" }
  ];

  const colorOptions = [
    { value: "#1a1f2c", label: "Noir" },
    { value: "#9b87f5", label: "Violet" },
    { value: "#7E69AB", label: "Violet foncé" },
    { value: "#F97316", label: "Orange" },
    { value: "#0EA5E9", label: "Bleu" },
    { value: "#ea384c", label: "Rouge" },
    { value: "#D946EF", label: "Rose" },
    { value: "#ffffff", label: "Blanc" },
    { value: "#fde68a", label: "Doré" },
    { value: "#a7f3d0", label: "Menthe" },
    { value: "#bfdbfe", label: "Bleu clair" },
    { value: "#fecaca", label: "Corail" }
  ];

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
                <Label>Police du titre</Label>
                <Select value={titleFont} onValueChange={setTitleFont}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ombre du titre</Label>
                <Select value={titleShadow} onValueChange={setTitleShadow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un effet d'ombre" />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((shadow) => (
                      <SelectItem key={shadow.value} value={shadow.value}>
                        {shadow.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Position du titre</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={titlePosition === "top" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTitlePosition("top")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={titlePosition === "center" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTitlePosition("center")}
                  >
                    <AlignCenterHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={titlePosition === "bottom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTitlePosition("bottom")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
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
                <Label>Police de l'auteur</Label>
                <Select value={authorFont} onValueChange={setAuthorFont}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ombre de l'auteur</Label>
                <Select value={authorShadow} onValueChange={setAuthorShadow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un effet d'ombre" />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((shadow) => (
                      <SelectItem key={shadow.value} value={shadow.value}>
                        {shadow.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                            className="w-4 h-4 rounded-full border border-gray-200" 
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

              <div>
                <Label>Rotation 3D</Label>
                <div className="flex items-center gap-4">
                  <Move className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[bookRotation]}
                    onValueChange={(value) => setBookRotation(value[0])}
                    min={0}
                    max={45}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{bookRotation}°</span>
                </div>

                <Label>Espacement</Label>
                <div className="flex items-center gap-4">
                  <ArrowRight className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[stackSpacing]}
                    onValueChange={(value) => setStackSpacing(value[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{stackSpacing}px</span>
                </div>

                <Label>Opacité du gradient</Label>
                <div className="flex items-center gap-4">
                  <Sun className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[coverOpacity * 100]}
                    onValueChange={(value) => setCoverOpacity(value[0] / 100)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{Math.round(coverOpacity * 100)}%</span>
                </div>

                <Label>Style du gradient</Label>
                <Select value={backgroundGradient} onValueChange={setBackgroundGradient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-black/60">Standard</SelectItem>
                    <SelectItem value="from-blue-500/60">Bleu</SelectItem>
                    <SelectItem value="from-purple-500/60">Violet</SelectItem>
                    <SelectItem value="from-red-500/60">Rouge</SelectItem>
                    <SelectItem value="from-green-500/60">Vert</SelectItem>
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
        </TabsContent>

        <TabsContent value="preview" className="min-h-[600px] bg-gray-50 rounded-lg p-8">
          <div ref={previewRef} className="w-full h-full flex items-center justify-center">
            {coverImage ? renderMockup() : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <BookOpen className="h-12 w-12 mb-4" />
                <p>Téléchargez une image de couverture pour voir l'aperçu</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              variant="default"
              onClick={downloadMockup}
              className="gap-2"
              disabled={!coverImage}
            >
              <Download className="h-4 w-4" />
              Télécharger le mockup
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <style>{`
        .text-shadow-sm {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .transform-none {
          transform: none !important;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-preserve {
          transform-style: preserve-3d;
        }
      `}</style>
    </Card>
  );
};

export default EbookMockupGenerator;
