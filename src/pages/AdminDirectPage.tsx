import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { Loader2, Mail, Shield, AlertCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminDirectPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "idle" | "sending" | "sent" | "authenticating" | "error">("checking");
  const [message, setMessage] = useState("Vérification de la session...");
  const [email, setEmail] = useState("");

  const checkAdminAndRedirect = useCallback(async () => {
    try {
      const isAdmin = await getIsCurrentSessionAdmin();
      if (isAdmin) {
        sessionStorage.setItem('is_admin', 'true');
        navigate("/admin", { replace: true });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Admin check error:", err);
      return false;
    }
  }, [navigate]);

  const sendMagicLink = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    setStatus("sending");
    setMessage("Envoi du lien magique...");

    const redirectTo = 'https://video-lexicon-translator-08.lovable.app/admin-direct';

    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo }
    });

    if (magicLinkError) {
      if (magicLinkError.status === 429) {
        setStatus("sent");
        setMessage("⚠️ Rate limit atteint. Attendez quelques minutes puis réessayez.");
        return;
      }
      setStatus("error");
      setMessage(`Erreur: ${magicLinkError.message || "Erreur inconnue"}`);
      return;
    }

    setStatus("sent");
    setMessage("Lien magique envoyé ! Vérifiez votre boîte mail.");
  };

  useEffect(() => {
    const processAuthenticatedSession = async () => {
      setStatus("authenticating");
      setMessage("Authentification en cours...");

      const success = await checkAdminAndRedirect();
      if (!success) {
        setStatus("error");
        setMessage("Accès refusé — Vous n'êtes pas administrateur.");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        setTimeout(() => { void processAuthenticatedSession(); }, 0);
      }
    });

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const success = await checkAdminAndRedirect();
          if (success) return;
        }
        setStatus("idle");
        setMessage("Entrez votre email admin pour recevoir un lien de connexion.");
      } catch (err) {
        console.error("[AdminDirect] Init error:", err);
        setStatus("error");
        setMessage("Une erreur est survenue");
      }
    };

    init();
    return () => subscription.unsubscribe();
  }, [navigate, checkAdminAndRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Accès Admin</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {(status === "checking" || status === "sending" || status === "authenticating") && (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
            {status === "sent" && <Mail className="w-5 h-5 text-green-500" />}
            {status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
            <p className="text-muted-foreground">{message}</p>
          </div>

          {status === "idle" && (
            <div className="space-y-3 mt-4">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
              />
              <Button onClick={sendMagicLink} className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Envoyer le lien de connexion
              </Button>
            </div>
          )}

          {status === "sent" && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  📧 Cliquez sur le lien dans l'email pour vous connecter.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ N'actualisez pas cette page avant d'avoir cliqué sur le lien.
                </p>
              </div>
              <Button variant="outline" onClick={() => { setStatus("idle"); setMessage("Entrez votre email admin."); }} size="sm">
                Renvoyer un nouveau lien
              </Button>
            </div>
          )}

          {status === "error" && (
            <Button onClick={() => { setStatus("idle"); setMessage("Entrez votre email admin."); }} variant="outline" className="mt-4">
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDirectPage;
