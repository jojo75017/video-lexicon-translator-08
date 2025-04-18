
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PinterestPin } from '@/types/pinterest';
import { pinterestDesigns, callToActions } from '@/data/pinterestImages';
import { Switch } from '@/components/ui/switch';

interface DesignTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
}

const DesignTab: React.FC<DesignTabProps> = ({ pin, updatePin }) => {
  const handleSelectDesign = (designId: string) => {
    const selectedDesign = pinterestDesigns.find(d => d.id === designId);
    if (selectedDesign) {
      updatePin('design', selectedDesign);
    }
  };
  
  const handleTextColorChange = (color: string) => {
    const updatedDesign = {
      ...pin.design,
      textColor: color
    };
    updatePin('design', updatedDesign);
  };
  
  const handlePrimaryColorChange = (color: string) => {
    const updatedDesign = {
      ...pin.design,
      primaryColor: color
    };
    updatePin('design', updatedDesign);
  };
  
  const handleSecondaryColorChange = (color: string) => {
    const updatedDesign = {
      ...pin.design,
      secondaryColor: color
    };
    updatePin('design', updatedDesign);
  };
  
  const handleAccentColorChange = (color: string) => {
    const updatedDesign = {
      ...pin.design,
      accentColor: color
    };
    updatePin('design', updatedDesign);
  };
  
  const handleOverlayStyleChange = (style: 'none' | 'gradient' | 'solid' | 'frame') => {
    const updatedDesign = {
      ...pin.design,
      overlayStyle: style
    };
    updatePin('design', updatedDesign);
  };

  return (
    <div className="space-y-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="text-color">Couleur du texte</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="text-color"
              type="color" 
              value={pin.design.textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text" 
              value={pin.design.textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="flex-1"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primary-color">Couleur principale (boutons, bordures)</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="primary-color"
              type="color" 
              value={pin.design.primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text" 
              value={pin.design.primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="flex-1"
              placeholder="#FF0000"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Couleur secondaire (badges, fond)</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="secondary-color"
              type="color" 
              value={pin.design.secondaryColor}
              onChange={(e) => handleSecondaryColorChange(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text" 
              value={pin.design.secondaryColor}
              onChange={(e) => handleSecondaryColorChange(e.target.value)}
              className="flex-1"
              placeholder="#00FF00"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accent-color">Couleur d'accent (surlignage)</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="accent-color"
              type="color" 
              value={pin.design.accentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text" 
              value={pin.design.accentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="flex-1"
              placeholder="#0000FF"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="overlay-style">Style de superposition</Label>
          <Select 
            value={pin.design.overlayStyle} 
            onValueChange={(val) => handleOverlayStyleChange(val as 'none' | 'gradient' | 'solid' | 'frame')}
          >
            <SelectTrigger id="overlay-style">
              <SelectValue placeholder="Choisir un style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              <SelectItem value="gradient">Dégradé</SelectItem>
              <SelectItem value="solid">Couleur pleine</SelectItem>
              <SelectItem value="frame">Cadre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="call-to-action">Appel à l'action</Label>
          <Select 
            value={pin.callToAction} 
            onValueChange={val => updatePin('callToAction', val)}
          >
            <SelectTrigger id="call-to-action">
              <SelectValue placeholder="Choisir un appel à l'action" />
            </SelectTrigger>
            <SelectContent>
              {callToActions.map(cta => (
                <SelectItem key={cta} value={cta}>{cta}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-hashtags"
            checked={pin.showHashtags === undefined ? true : pin.showHashtags}
            onCheckedChange={(checked) => updatePin('showHashtags', checked)}
          />
          <Label htmlFor="show-hashtags">Afficher les hashtags sur l'image</Label>
        </div>
        <p className="text-sm text-gray-500 mt-1">Les hashtags seront affichés sur l'image</p>
      </div>
    </div>
  );
};

export default DesignTab;
