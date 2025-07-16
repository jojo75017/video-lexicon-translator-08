
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, Link as LinkIcon, ImageIcon, ListOrdered, ListIcon, 
  Quote, ExternalLink, FileText, AlignLeft, AlignCenter, AlignRight, Heading1,
  Heading2, Code, Table, Smile, PenTool, Clock, LayoutGrid, Table2, FileImage, 
  Highlighter, Type 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Tabs, 
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface FormatToolbarProps {
  fieldType: 'details' | 'answer' | 'sources';
  onFormat: (fieldType: 'details' | 'answer' | 'sources', 
    format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote' | 
    'heading1' | 'heading2' | 'code' | 'table' | 'emoji' | 'highlight' | 'align-left' | 'align-center' | 
    'align-right' | 'insert-template' | 'insert-citation' | 'insert-time'
  ) => void;
}

const QuoraFormatToolbar = ({ fieldType, onFormat }: FormatToolbarProps) => {
  return (
    <TooltipProvider>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-2 bg-gray-50 justify-start">
          <TabsTrigger value="basic" className="text-xs px-3">Basique</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs px-3">Avancé</TabsTrigger>
          <TabsTrigger value="layout" className="text-xs px-3">Mise en page</TabsTrigger>
          <TabsTrigger value="insert" className="text-xs px-3">Insertion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="p-0 mt-0">
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
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'heading1')}
                  className="h-8 w-8 p-0"
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Titre principal</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'heading2')}
                  className="h-8 w-8 p-0"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sous-titre</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
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
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
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
                  onClick={() => onFormat(fieldType, 'quote')}
                  className="h-8 w-8 p-0"
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Citation</TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="p-0 mt-0">
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border rounded-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'code')}
                  className="h-8 w-8 p-0"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bloc de code</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'table')}
                  className="h-8 w-8 p-0"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tableau</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'highlight')}
                  className="h-8 w-8 p-0"
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Surligner</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'emoji')}
                  className="h-8 w-8 p-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'insert-citation')}
                  className="h-8 w-auto px-3 text-xs gap-1"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Citation</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer une citation</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'insert-time')}
                  className="h-8 w-auto px-3 text-xs gap-1"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Horodatage</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer l'heure actuelle</TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="p-0 mt-0">
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border rounded-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'align-left')}
                  className="h-8 w-8 p-0"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aligner à gauche</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'align-center')}
                  className="h-8 w-8 p-0"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Centrer</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'align-right')}
                  className="h-8 w-8 p-0"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aligner à droite</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onFormat(fieldType, 'image')}
                  className="h-8 w-auto px-3 text-xs gap-1"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Image</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer une image</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-auto px-3 text-xs gap-1"
                  onClick={() => onFormat(fieldType, 'insert-template')}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Modèle</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer un modèle</TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>
        
        <TabsContent value="insert" className="p-0 mt-0">
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border rounded-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs gap-1"
                >
                  <FileImage className="h-3.5 w-3.5" />
                  <span>Gallerie</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer gallerie d'images</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs gap-1"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Signature</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insérer votre signature</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs gap-1"
                >
                  <Type className="h-3.5 w-3.5" />
                  <span>Style personnalisé</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Appliquer un style personnalisé</TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">Formatage {fieldType === 'details' ? 'des détails' : fieldType === 'answer' ? 'de la réponse' : 'des sources'}</div>
        
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-gray-500 gap-1"
            asChild
          >
            <a href="https://fr.quora.com/q/blogformatting" target="_blank" rel="noopener noreferrer">
              <FileText className="h-3.5 w-3.5" />
              <span>Guide</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QuoraFormatToolbar;
