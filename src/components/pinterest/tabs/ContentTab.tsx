import React, { useState, useRef } from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Smile, Sparkles, ThumbsUp, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import EmojiPicker from './EmojiPicker';

interface ContentTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
  onGenerateContent?: () => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ pin, updatePin, onGenerateContent }) => {
  const [autoEmojis, setAutoEmojis] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<'title' | 'description'>('title');
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Fonction pour insérer un emoji à la position du curseur
  const insertEmoji = (emoji: string) => {
    if (emojiTarget === 'title' && titleRef.current) {
      const input = titleRef.current;
      const start = input.selectionStart || input.value.length;
      const end = input.selectionEnd || input.value.length;
      const newValue = input.value.substring(0, start) + emoji + input.value.substring(end);
      updatePin('title', newValue);
      
      // Rétablir la position du curseur après l'emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 10);
    } else if (emojiTarget === 'description' && descriptionRef.current) {
      const textarea = descriptionRef.current;
      const start = textarea.selectionStart || textarea.value.length;
      const end = textarea.selectionEnd || textarea.value.length;
      const newValue = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
      updatePin('description', newValue);
      
      // Rétablir la position du curseur après l'emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 10);
    }
  };

  // Fonction pour activer le sélecteur d'emoji
  const activateEmojiPicker = (target: 'title' | 'description') => {
    setEmojiTarget(target);
    setShowEmojiPicker(true);
  };

  // Fonction pour ajouter des emojis automatiquement au titre
  const addAutoEmojisToTitle = () => {
    const titleText = pin.title;
    let newTitle = titleText;
    
    // Vérifier si des emojis sont déjà présents
    const hasEmojis = /[\p{Emoji}]/u.test(titleText);
    
    if (!hasEmojis) {
      if (titleText.toLowerCase().includes('paris') || titleText.toLowerCase().includes('france')) {
        newTitle = `🇫🇷 ${titleText} 🗼`;
      } else if (titleText.toLowerCase().includes('voyage') || titleText.toLowerCase().includes('découvr')) {
        newTitle = `✈️ ${titleText} 🌍`;
      } else if (titleText.toLowerCase().includes('recette') || titleText.toLowerCase().includes('cuisine')) {
        newTitle = `👨‍🍳 ${titleText} 🍽️`;
      } else if (titleText.toLowerCase().includes('jardin') || titleText.toLowerCase().includes('plante')) {
        newTitle = `🌱 ${titleText} 🪴`;
      } else if (titleText.toLowerCase().includes('maison') || titleText.toLowerCase().includes('déco')) {
        newTitle = `🏠 ${titleText} ✨`;
      } else {
        newTitle = `✨ ${titleText} ✨`;
      }
      
      updatePin('title', newTitle);
      toast.success('Emojis ajoutés au titre');
    } else {
      toast.info('Le titre contient déjà des emojis');
    }
  };

  // Fonction pour copier le texte dans le presse-papier
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${type} copié dans le presse-papier`))
      .catch(() => toast.error(`Erreur lors de la copie du ${type.toLowerCase()}`));
  };

  // Fonction générer du contenu est maintenant correctement typée
  // Cette fonction peut être appelée depuis un composant parent ou définie ici
  const generateContent = () => {
    if (onGenerateContent) {
      onGenerateContent();
    } else {
      // Génération simple de contenu par défaut
      const newTitle = "Découvrez cette destination incroyable ✨";
      const newDescription = "Un lieu magique qui vous transportera dans un univers de découvertes. Parfait pour les amoureux de voyage et d'aventure. #voyage #découverte #aventure";
      
      updatePin('title', newTitle);
      updatePin('description', newDescription);
      toast.success('Contenu généré avec succès');
    }
  };

  // Fonction pour valider la longueur du texte
  const validateTextLength = (text: string, maxLength: number) => {
    return text.slice(0, maxLength);
  };

  // Gestion du changement de titre avec limite
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = validateTextLength(e.target.value, 60);
    updatePin('title', newTitle);
  };

  // Gestion du changement de description avec limite
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = validateTextLength(e.target.value, 400);
    updatePin('description', newDescription);
  };

  // Fonction pour valider la longueur du texte global
  const handleGlobalDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value.slice(0, 400);
    updatePin('globalDescription', newDescription);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="title">Titre</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {pin.title.length}/60
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => activateEmojiPicker('title')}
                type="button"
              >
                <Smile className="h-4 w-4 mr-1" />
                Emojis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(pin.title, 'Titre')}
                type="button"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
            </div>
          </div>
        </div>
        <Input
          id="title"
          ref={titleRef}
          value={pin.title}
          onChange={handleTitleChange}
          className="font-medium"
          placeholder="Titre de votre pin (max 60 caractères)"
          maxLength={60}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Description (dans l'image)</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {pin.description.length}/400
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => activateEmojiPicker('description')}
                type="button"
              >
                <Smile className="h-4 w-4 mr-1" />
                Emojis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(pin.description, 'Description')}
                type="button"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
            </div>
          </div>
        </div>
        <Textarea
          id="description"
          ref={descriptionRef}
          value={pin.description}
          onChange={handleDescriptionChange}
          rows={4}
          className="resize-none"
          placeholder="Description affichée sur l'image (max 400 caractères)"
          maxLength={400}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="globalDescription">Description globale</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {pin.globalDescription?.length || 0}/400
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => pin.globalDescription && navigator.clipboard.writeText(pin.globalDescription).then(
                () => toast.success('Description globale copiée'),
                () => toast.error('Erreur lors de la copie')
              )}
              type="button"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
          </div>
        </div>
        <Textarea
          id="globalDescription"
          value={pin.globalDescription || ''}
          onChange={handleGlobalDescriptionChange}
          rows={4}
          className="resize-none"
          placeholder="Description globale du pin (max 400 caractères)"
          maxLength={400}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="callToAction">Call to Action</Label>
        <Input
          id="callToAction"
          value={pin.callToAction}
          onChange={(e) => updatePin('callToAction', e.target.value)}
          placeholder="Ex: En savoir plus, Découvrir, Acheter..."
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-emojis"
          checked={autoEmojis}
          onCheckedChange={setAutoEmojis}
        />
        <Label htmlFor="auto-emojis" className="cursor-pointer">Ajouter des emojis automatiquement</Label>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addAutoEmojisToTitle}
          className="ml-auto"
          type="button"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Ajouter emojis au titre
        </Button>
      </div>
      
      <Button 
        variant="default" 
        onClick={generateContent}
        className="mt-4"
        type="button"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Générer du contenu
      </Button>
      
      {/* Sélecteur d'emoji */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Choisir un emoji</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEmojiPicker(false)}
              >
                ✕
              </Button>
            </div>
            <EmojiPicker onEmojiSelect={(emoji) => {
              insertEmoji(emoji);
              setShowEmojiPicker(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTab;
