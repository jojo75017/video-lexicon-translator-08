import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, BookOpen, Wand2, Rocket, KeyRound, ExternalLink, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useOpenAIConfig } from "@/hooks/useOpenAIConfig";

const ONBOARDING_KEY = "ebookstudio_first_ebook_onboarding_done";

/**
 * Onboarding modal shown ONCE after first login.
 * Step 0: BYOK Gemini key validation (mandatory — without it, P1-P15 fail).
 * Step 1: Quick overview of the 3-step ebook creation flow.
 */
export const FirstEbookOnboarding = ({ subscriberEmail }: { subscriberEmail?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);
  const [keyInput, setKeyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { apiKey, updateApiKey } = useOpenAIConfig();

  useEffect(() => {
    if (!subscriberEmail) return;
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (done) return;
    const t = setTimeout(() => {
      // If a key already exists, skip directly to step 1
      setStep(apiKey && apiKey.trim().length > 0 ? 1 : 0);
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(t);
  }, [subscriberEmail, apiKey]);

  const markDone = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setIsOpen(false);
  };

  const saveKeyAndContinue = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed.startsWith("AIza")) {
      toast.error("Format de clé invalide", {
        description: "Une clé Gemini commence toujours par 'AIza'.",
      });
      return;
    }
    setSaving(true);
    try {
      await updateApiKey(trimmed);
      toast.success("Clé Gemini enregistrée");
      setStep(1);
    } catch (e) {
      toast.error("Impossible de sauvegarder la clé. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const startWorkflow = () => {
    markDone();
    navigate("/ebook-planner");
  };

  const skip = () => {
    // Allow skipping only from step 1 (already had key) or as escape hatch
    markDone();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && skip()}>
      <DialogContent className="max-w-lg">
        {step === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <KeyRound className="h-5 w-5 text-primary" />
                Étape 0 — Connectez votre IA
              </DialogTitle>
              <DialogDescription>
                EbookStudio utilise Gemini de Google pour rédiger vos livres.
                C'est gratuit et prend 2 minutes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  Sans clé Gemini, les 15 agents IA ne peuvent pas générer votre ebook.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="onboarding-gemini-key" className="text-sm font-medium">
                  Votre clé API Gemini
                </Label>
                <Input
                  id="onboarding-gemini-key"
                  type="password"
                  placeholder="AIza..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="h-11"
                  autoComplete="off"
                />
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Obtenir ma clé gratuite sur Google AI Studio
                </a>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between pt-2">
              <Button variant="ghost" onClick={skip} size="sm">
                Plus tard
              </Button>
              <Button
                onClick={saveKeyAndContinue}
                size="sm"
                disabled={saving || keyInput.trim().length === 0}
                className="gap-2"
              >
                {saving ? "Enregistrement..." : "Valider et continuer"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Bienvenue sur EbookStudio Pro !
              </DialogTitle>
              <DialogDescription>
                Créez votre premier ebook professionnel en suivant 3 étapes simples.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">1. Choisissez un sujet</p>
                  <p className="text-xs text-muted-foreground">
                    Un thème qui passionne vos futurs lecteurs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">2. Laissez l'IA travailler</p>
                  <p className="text-xs text-muted-foreground">
                    15 agents IA structurent, rédigent et optimisent votre livre.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Rocket className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">3. Exportez et publiez sur KDP</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, EPUB et couverture prêts pour Amazon Kindle.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
              <Button variant="ghost" onClick={skip} size="sm">
                Plus tard
              </Button>
              <Button onClick={startWorkflow} size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Créer mon 1er ebook
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
