import React from 'react';
import EbookbotChat from '@/components/ebookbot/EbookbotChat';

/**
 * Assistant IA du Hub V3 — reprend l'assistant conversationnel de la V2 (EbookbotChat),
 * affiché en pleine largeur dans l'onglet « Parler avec l'IA ».
 */
const HubAiChat: React.FC = () => {
  return (
    <div className="w-full">
      <EbookbotChat variant="page" />
    </div>
  );
};

export default HubAiChat;
