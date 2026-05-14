import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, KeyRound, RefreshCw, X } from 'lucide-react';
import { onAIError, classifyAIError, PROVIDER_CONSOLE_URL, type AIErrorEventDetail } from '@/lib/aiErrorBus';
import { PROVIDER_LABELS } from '@/services/aiWritingService';

const HUMAN_HINTS: Record<string, { title: string; steps: string[] }> = {
  'key-missing': {
    title: 'Ta clé API n\'est pas configurée',
    steps: [
      'Ouvre le bouton flottant "Clés API" en bas à droite.',
      'Colle ta clé du provider sélectionné.',
      'Relance l\'agent — ça repart en 5 secondes.',
    ],
  },
  'key-invalid': {
    title: 'Ta clé API semble invalide ou expirée',
    steps: [
      'Va sur la console du provider (lien ci-dessous).',
      'Vérifie qu\'elle est active, sinon génère-en une nouvelle.',
      'Recolle-la dans "Clés API" — le format doit matcher (AIza..., sk-..., sk-ant-..., sk-or-...).',
    ],
  },
  quota: {
    title: 'Tu as atteint la limite de ton compte',
    steps: [
      'Ajoute du crédit sur le provider (lien ci-dessous).',
      'Ou bascule sur un autre provider (Gemini / Claude / OpenAI / OpenRouter) dans les réglages.',
      'Patiente 60 secondes si c\'est juste un rate-limit court.',
    ],
  },
  timeout: {
    title: 'La requête a pris trop de temps',
    steps: [
      'Réduis la longueur du chapitre demandé.',
      'Réessaie — le provider est peut-être surchargé temporairement.',
      'Si ça persiste, change de modèle (Flash plutôt que Pro).',
    ],
  },
  network: {
    title: 'Problème de connexion au provider',
    steps: [
      'Vérifie ta connexion internet.',
      'Désactive un VPN si tu en as un actif.',
      'Réessaie dans 30 secondes.',
    ],
  },
  unknown: {
    title: 'Erreur inattendue côté IA',
    steps: [
      'Relance la même action (la plupart du temps ça passe au 2e essai).',
      'Si ça persiste, change de provider dans les réglages.',
      'Consulte la console du provider pour un détail technique.',
    ],
  },
};

const AISosModal: React.FC = () => {
  const [event, setEvent] = useState<AIErrorEventDetail | null>(null);

  useEffect(() => {
    const off = onAIError((detail) => {
      // Anti-spam : on ne ré-ouvre pas si déjà ouvert depuis moins de 2s
      setEvent((prev) => {
        if (prev && Date.now() - prev.timestamp < 2000) return prev;
        return detail;
      });
    });
    return off;
  }, []);

  if (!event) return null;
  const kind = classifyAIError(event.message);
  const hint = HUMAN_HINTS[kind] || HUMAN_HINTS.unknown;
  const providerLabel = PROVIDER_LABELS[event.provider];
  const consoleUrl = PROVIDER_CONSOLE_URL[event.provider];

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && setEvent(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#232F3E]">
            <AlertTriangle className="h-5 w-5 text-[#FF9E2D]" />
            SOS — {hint.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Provider concerné : <strong>{providerLabel}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md bg-[#FAFAFA] border border-border p-3 text-xs text-muted-foreground font-mono break-words">
            {event.message}
          </div>

          <div>
            <p className="text-sm font-semibold mb-2 text-[#232F3E]">Que faire ?</p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#232F3E]">
              {hint.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-[#008296] text-[#008296] hover:bg-[#008296] hover:text-white"
              onClick={() => window.open(consoleUrl, '_blank', 'noopener')}
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir la console {providerLabel}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setEvent(null);
                  // Ouvre le bouton clés API si dispo
                  document.querySelector<HTMLButtonElement>('[data-api-keys-button]')?.click();
                }}
              >
                <KeyRound className="h-4 w-4" />
                Mes clés
              </Button>
              <Button
                className="gap-2 bg-[#008296] hover:bg-[#FF9E2D] text-white"
                onClick={() => setEvent(null)}
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISosModal;
