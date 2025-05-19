
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface WordCounterProps {
  initialText?: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  onChange?: (text: string) => void;
}

const WordCounter: React.FC<WordCounterProps> = ({
  initialText = '',
  label = 'Texte',
  placeholder = 'Saisissez votre texte ici...',
  maxLength,
  className = '',
  onChange
}) => {
  const [text, setText] = useState(initialText);
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    paragraphs: 0,
    sentences: 0
  });

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (text: string) => {
    // Count characters (with and without spaces)
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Count words (split by any whitespace)
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    // Count paragraphs (split by double newlines)
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
    
    // Count sentences (roughly split by ., !, or ?)
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== '').length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      paragraphs,
      sentences
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    if (maxLength && newText.length > maxLength) {
      return;
    }
    
    setText(newText);
    
    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">{label}</h3>
        </div>
        
        <Textarea
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          className="min-h-[200px] font-mono text-sm"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-lg font-bold">{stats.characters}</div>
            <div className="text-xs text-gray-500">Caractères</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-lg font-bold">{stats.charactersNoSpaces}</div>
            <div className="text-xs text-gray-500">Sans espaces</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-lg font-bold">{stats.words}</div>
            <div className="text-xs text-gray-500">Mots</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-lg font-bold">{stats.sentences}</div>
            <div className="text-xs text-gray-500">Phrases</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-lg font-bold">{stats.paragraphs}</div>
            <div className="text-xs text-gray-500">Paragraphes</div>
          </div>
        </div>
        
        {maxLength && (
          <div className="text-right text-sm">
            <span className={text.length > maxLength * 0.9 ? "text-amber-600" : "text-gray-500"}>
              {text.length} / {maxLength}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordCounter;
