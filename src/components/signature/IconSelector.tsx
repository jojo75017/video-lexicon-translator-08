
import React from 'react';
import { Building, User, UserRound } from "lucide-react";

interface IconSelectorProps {
  type: 'name' | 'company';
  selected: string;
  onChange: (value: string) => void;
}

const IconSelector = ({ type, selected, onChange }: IconSelectorProps) => {
  return (
    <div className="mt-2 flex items-center gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name={`${type}Icon`}
          checked={selected === 'none'}
          onChange={() => onChange('none')}
        />
        <span>Aucun</span>
      </label>
      
      {type === 'name' ? (
        <>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="nameIcon"
              checked={selected === 'user'}
              onChange={() => onChange('user')}
            />
            <User className="h-4 w-4" />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="nameIcon"
              checked={selected === 'userRound'}
              onChange={() => onChange('userRound')}
            />
            <UserRound className="h-4 w-4" />
          </label>
        </>
      ) : (
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="companyIcon"
            checked={selected === 'building'}
            onChange={() => onChange('building')}
          />
          <Building className="h-4 w-4" />
        </label>
      )}
      
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name={`${type}Icon`}
          checked={selected === 'emoji'}
          onChange={() => onChange('emoji')}
        />
        <span>{type === 'name' ? '👤' : '🏢'}</span>
      </label>
    </div>
  );
};

export default IconSelector;
