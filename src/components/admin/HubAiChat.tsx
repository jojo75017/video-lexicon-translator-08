import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import EbookbotChat from '@/components/ebookbot/EbookbotChat';

/**
 * Panneau IA du Hub V3 — reprend exactement l'assistant conversationnel de la V2
 * (EbookbotChat, réponses en streaming), ouvert depuis le bouton « Parler avec l'IA ».
 */
const HubAiChat: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-hub-ai', handleOpen);
    return () => window.removeEventListener('open-hub-ai', handleOpen);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9998] w-[calc(100vw-2rem)] sm:w-[420px] animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute -top-2 -right-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white text-[#2A2118] shadow-lg border border-[#eadfc9] hover:bg-[#FFF3DF]"
        >
          <X className="h-4 w-4" />
        </button>
        <EbookbotChat variant="floating" />
      </div>
    </div>
  );
};

export default HubAiChat;
