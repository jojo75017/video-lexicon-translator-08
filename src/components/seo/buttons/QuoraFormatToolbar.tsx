
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, ImageIcon, ListOrdered, ListIcon, Quote } from 'lucide-react';

interface FormatToolbarProps {
  fieldType: 'details' | 'answer' | 'sources';
  onFormat: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
}

const QuoraFormatToolbar = ({ fieldType, onFormat }: FormatToolbarProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'bold')}
        title="Gras"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'italic')}
        title="Italique"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'underline')}
        title="Souligné"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'link')}
        title="Lien affilié"
        className="bg-[#f0f8ff] border-[#b92b27]/30 hover:bg-[#b92b27]/10"
      >
        <LinkIcon className="h-4 w-4 text-[#b92b27]" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'image')}
        title="Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'list')}
        title="Liste à puces"
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'numbered-list')}
        title="Liste numérotée"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => onFormat(fieldType, 'quote')}
        title="Citation"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="text-xs text-gray-500 flex items-center ml-2">
        <span className="hidden sm:inline">Formatage:</span> **gras**, *italique*, [lien](url)
      </div>
    </div>
  );
};

export default QuoraFormatToolbar;
