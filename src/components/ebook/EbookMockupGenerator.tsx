
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';

const EbookMockupGenerator: React.FC = () => {
  const [title, setTitle] = useState("Mon eBook");
  const [coverImage, setCoverImage] = useState<string | null>(null);
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

    return (
      <div className="book-container">
        <div className="book">
          <img
            src={coverImage}
            alt="Couverture"
            className="cover"
          />
          <div className="spine"></div>
          <div className="shadow"></div>
        </div>
        <style jsx>{`
          .book-container {
            width: 300px;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 2000px;
            perspective-origin: 50% 50%;
          }

          .book {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transform: rotateY(-30deg);
            transition: transform 0.5s;
          }

          .cover {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform-origin: left;
            transform: translateZ(0);
            box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
          }

          .spine {
            position: absolute;
            left: 0;
            width: 40px;
            height: 100%;
            transform-origin: left;
            transform: rotateY(90deg) translateX(-20px);
            background: linear-gradient(to right, #e0e0e0, #f5f5f5);
            box-shadow: inset -5px 0 10px rgba(0, 0, 0, 0.1);
          }

          .shadow {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 10px;
            left: 20px;
            transform: translateZ(-10px);
            background: rgba(0, 0, 0, 0.1);
            filter: blur(10px);
          }
        `}</style>
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
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      });

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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
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
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir une image
                  </label>
                </Button>
              )}
            </Card>
          </div>

          <div 
            ref={previewRef}
            className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-white rounded-lg p-12"
            style={{
              perspective: '2000px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {renderMockup()}
          </div>

          <div className="flex justify-center">
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
        </div>
      </div>
    </Card>
  );
};

export default EbookMockupGenerator;
