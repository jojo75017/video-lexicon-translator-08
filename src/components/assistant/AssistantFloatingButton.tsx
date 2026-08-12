import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import AssistantChat from './AssistantChat';

/** Bouton flottant de l'assistant, disponible sur tout le site. */
const AssistantFloatingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] w-[min(400px,calc(100vw-2rem))]">
          <AssistantChat variant="floating" />
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Ebookstudio"}
        className="fixed bottom-5 right-4 z-[60] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl grid place-items-center hover:scale-105 transition"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </>
  );
};

export default AssistantFloatingButton;
