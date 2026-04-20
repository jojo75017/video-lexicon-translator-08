import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Wand2, Rocket } from "lucide-react";

const ONBOARDING_KEY = "ebookstudio_first_ebook_onboarding_done";

/**
 * Onboarding modal shown ONCE after first login.
 * Directs user straight to the P1→P15 workflow (the main creation path).
 */
export const FirstEbookOnboarding = ({ subscriberEmail }: { subscriberEmail?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subscriberEmail) return;
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (done) return;
    // Show after a small delay so user perceives the dashboard first
    const t = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(t);
  }, [subscriberEmail]);

  const markDone = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setIsOpen(false);
  };

  const startWorkflow = () => {
    markDone();
    navigate("/ebook-planner");
  };

  const skip = () => {
    markDone();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && skip()}>
      <DialogContent className="max-w-lg">
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
      </DialogContent>
    </Dialog>
  );
};
