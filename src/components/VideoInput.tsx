
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileVideo, Link as LinkIcon, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoInputProps {
  onVideoSubmit: (videoUrl: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [inputMethod, setInputMethod] = useState<'url' | 'upload'>('url');

  // Debug props
  useEffect(() => {
    console.log("VideoInput mounted with props:", { onVideoSubmit: !!onVideoSubmit });
  }, [onVideoSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("VideoInput form submitted:", videoUrl);
    
    if (!videoUrl) {
      toast.error("Veuillez entrer une URL vidéo ou télécharger un fichier");
      return;
    }
    
    // Call the callback explicitly
    try {
      console.log("Calling onVideoSubmit with:", videoUrl);
      onVideoSubmit(videoUrl);
      toast.success("Vidéo soumise avec succès");
    } catch (error) {
      console.error("Error submitting video URL:", error);
      toast.error("Erreur lors de la soumission de la vidéo");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File uploaded:", file?.name);
    
    if (file) {
      // Create an object URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      console.log("Created object URL:", objectUrl);
      setVideoUrl(objectUrl);
      setInputMethod('upload');
      toast.success(`Fichier "${file.name}" chargé avec succès`);
    }
  };

  // For testing - add a sample URL
  useEffect(() => {
    // Sample video URLs for testing
    const sampleUrls = [
      "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      "https://www.w3schools.com/html/mov_bbb.mp4",
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    ];
    
    // Set a random sample URL for easier testing
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    console.log("Setting sample video URL for testing:", randomUrl);
    setVideoUrl(randomUrl);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto">
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Fournir une vidéo à traduire</h3>
            <p className="text-sm text-gray-500">
              Choisissez entre entrer l'URL d'une vidéo ou télécharger un fichier de votre ordinateur
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Option 1: URL de la vidéo</span>
              </div>
              <Input
                type="text"
                placeholder="Entrez l'URL de la vidéo (YouTube, MP4, etc.)"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setInputMethod('url');
                }}
                className="w-full"
              />
              <p className="text-xs text-gray-500 italic">
                Une URL d'exemple a été ajoutée pour tester rapidement la fonctionnalité
              </p>
            </div>
            
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">OU</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Option 2: Télécharger un fichier</span>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <FileVideo className="mx-auto h-10 w-10 text-gray-400" />
                <label htmlFor="file-upload" className="mt-2 block">
                  <span className="mt-2 block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Cliquez pour sélectionner un fichier
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="video/*"
                    onChange={handleFileUpload}
                  />
                  <span className="mt-1 block text-xs text-gray-500">
                    MP4, WebM, MOV jusqu'à 100MB
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 mt-6"
            disabled={!videoUrl}
          >
            {inputMethod === 'url' ? 'Charger la vidéo depuis l\'URL' : 'Utiliser le fichier téléchargé'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default VideoInput;
