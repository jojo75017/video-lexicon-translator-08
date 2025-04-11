
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PinterestPin } from '@/types/pinterest';
import { pinterestDesigns, callToActions } from '@/data/pinterestImages';

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
    </div>
  );
};

export default DesignTab;
