
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, UserCircle, Building } from "lucide-react";

interface IconSelectorProps {
  type: 'name' | 'company';
  selected: string;
  onChange: (value: any) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ type, selected, onChange }) => {
  return (
    <div className="mt-2">
      <Label className="text-xs text-muted-foreground mb-1 block">
        {type === 'name' ? 'Icône de nom' : 'Icône d\'entreprise'}
      </Label>
      <RadioGroup
        value={selected}
        onValueChange={onChange}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="none" id={`${type}-none`} />
          <Label htmlFor={`${type}-none`} className="text-xs">Aucun</Label>
        </div>

        {type === 'name' && (
          <>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="user" id={`${type}-user`} />
              <Label htmlFor={`${type}-user`} className="text-xs flex items-center">
                <User className="h-4 w-4 mr-1" />
                User
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="userRound" id={`${type}-userRound`} />
              <Label htmlFor={`${type}-userRound`} className="text-xs flex items-center">
                <UserCircle className="h-4 w-4 mr-1" />
                User Circle
              </Label>
            </div>
          </>
        )}

        {type === 'company' && (
          <div className="flex items-center gap-2">
            <RadioGroupItem value="building" id={`${type}-building`} />
            <Label htmlFor={`${type}-building`} className="text-xs flex items-center">
              <Building className="h-4 w-4 mr-1" />
              Building
            </Label>
          </div>
        )}

        <div className="flex items-center gap-2">
          <RadioGroupItem value="emoji" id={`${type}-emoji`} />
          <Label htmlFor={`${type}-emoji`} className="text-xs flex items-center">
            {type === 'name' ? '👤' : '🏢'} Emoji
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default IconSelector;
