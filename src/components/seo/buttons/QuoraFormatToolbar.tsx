
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, ImageIcon, ListOrdered, ListIcon, Quote, ExternalLink, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormatToolbarProps {
  fieldType: 'details' | 'answer' | 'sources';
  onFormat: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
}

const QuoraFormatToolbar = ({ fieldType, onFormat }: FormatToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border rounded-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'bold')}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Gras</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'italic')}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italique</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'underline')}
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Souligné</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'link')}
              className="h-8 w-8 p-0 bg-[#f0f8ff] border-[#b92b27]/30 hover:bg-[#b92b27]/10"
            >
              <LinkIcon className="h-4 w-4 text-[#b92b27]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Lien affilié</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'image')}
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Image</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'list')}
              className="h-8 w-8 p-0"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Liste à puces</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'numbered-list')}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Liste numérotée</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onFormat(fieldType, 'quote')}
              className="h-8 w-8 p-0"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Citation</TooltipContent>
        </Tooltip>
        
        <div className="border-l border-gray-300 h-8 mx-1"></div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-gray-500 gap-1.5"
              asChild
            >
              <a href="https://fr.quora.com/q/blogformatting" target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5" />
                <span>Guide</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Guide de formatage Quora</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default QuoraFormatToolbar;
