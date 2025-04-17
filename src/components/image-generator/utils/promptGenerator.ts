
import { toast } from 'sonner';

export const generatePrompt = (
  title: string, 
  style: string, 
  mood: string, 
  quality: number, 
  detailLevel: number, 
  additionalElements?: string
) => {
  if (!title) {
    toast.error('Veuillez entrer un titre pour générer un prompt');
    return null;
  }

  // Enhanced prompt generation logic
  let prompt = `Une image de ${title}, style ${style}, ambiance ${mood}`;
  
  // Quality modifiers
  if (quality > 50) prompt += ', haute résolution';
  if (quality > 75) prompt += ', qualité exceptionnelle';
  
  // Detail level modifiers
  if (detailLevel > 50) prompt += ', détaillé';
  if (detailLevel > 75) prompt += ', extrêmement détaillé';
  
  // Additional elements
  if (additionalElements) {
    prompt += `, avec ${additionalElements}`;
  }
  
  // Professional touches
  prompt += ', composition professionnelle, éclairage parfait';
  
  return prompt;
};

export const copyPromptToClipboard = (prompt: string) => {
  if (prompt) {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copié dans le presse-papier');
  }
};
