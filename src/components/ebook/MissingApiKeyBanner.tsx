import { AlertTriangle, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MissingApiKeyBannerProps {
  apiKey: string;
  onScrollToKeyField?: () => void;
}

/**
 * Persistent warning banner shown at the top of the Ebook Planner
 * when no Gemini API key is configured. Without it, every P1-P15
 * agent invocation will fail. Bring Your Own Key (BYOK) policy.
 */
export const MissingApiKeyBanner = ({ apiKey, onScrollToKeyField }: MissingApiKeyBannerProps) => {
  if (apiKey && apiKey.trim().length > 0) return null;

  return (
    <div
      className="border-b border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30"
      role="alert"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-sm">
            <strong className="text-amber-900 dark:text-amber-200 font-semibold">
              Clé Gemini manquante.
            </strong>{" "}
            <span className="text-amber-800 dark:text-amber-300">
              Sans clé, les 15 agents IA (P1 → P15) ne peuvent pas générer votre ebook.
              C'est gratuit en moins de 2 minutes.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 border-amber-400 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200"
          >
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Obtenir ma clé
            </a>
          </Button>
          {onScrollToKeyField && (
            <Button
              size="sm"
              onClick={onScrollToKeyField}
              className="h-8 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Coller ma clé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
