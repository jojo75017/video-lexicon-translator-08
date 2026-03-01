import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gift, Mail, Loader2, Sparkles, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackFormSubmit } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";

interface ScrollIntentPopupProps {
  scrollThreshold?: number; // Percentage of page scroll (default 50%)
}

const ScrollIntentPopup = ({ scrollThreshold = 50 }: ScrollIntentPopupProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem("scroll_popup_shown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    const handleScroll = () => {
      if (hasShown) return;

      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= scrollThreshold) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("scroll_popup_shown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown, scrollThreshold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Email invalide");
      return;
    }

    setIsSubmitting(true);
    try {
      const emailLower = email.trim().toLowerCase();
      
      // Add to email sequence
      await supabase.functions.invoke("add-to-email-sequence", {
        body: { email: emailLower }
      });

      trackFormSubmit('scroll_intent_popup', emailLower);
      toast.success("🎁 Votre guide arrive dans votre boîte mail !");
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipToOffer = () => {
    setIsOpen(false);
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-violet-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <span>🎯</span> Vous êtes au bon endroit !
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base mt-2">
            Recevez gratuitement notre guide PDF exclusif pour démarrer sur Amazon KDP.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
              📚 10 niches rentables
            </Badge>
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
              💰 Plan d'action
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              🚀 40+ pages
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 h-11"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Recevoir le guide gratuit
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={handleSkipToOffer}
              className="text-sm text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
            >
              Non merci, voir l'offre directement
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScrollIntentPopup;
