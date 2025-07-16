
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, Copy, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface PromptHistoryProps {
  history: { prompt: string; date: Date }[];
  onSelectPrompt: (prompt: string) => void;
  onClearHistory: () => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({
  history,
  onSelectPrompt,
  onClearHistory,
}) => {
  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copié !');
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>Aucun historique de prompts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Historique des prompts</h3>
        <Button variant="ghost" size="sm" onClick={onClearHistory}>
          <Trash className="h-4 w-4 mr-2" />
          Effacer
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {history.map((item, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm mb-2 line-clamp-2">{item.prompt}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {item.date.toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyPrompt(item.prompt)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copier
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onSelectPrompt(item.prompt)}
                  >
                    Utiliser
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PromptHistory;
