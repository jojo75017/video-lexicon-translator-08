import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, CheckCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ADMIN_EMAIL = "boubetgeorges@gmail.com";

const AdminDirectPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "sending" | "sent" | "authenticating" | "error">("checking");
  const [message, setMessage] = useState("Vérification de la session...");

  useEffect(() => {
    // Listen for auth state changes (magic link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStatus("authenticating");
        setMessage("Authentification en cours...");

        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin"
        });

        if (isAdmin) {
          sessionStorage.setItem('is_admin', 'true');
          localStorage.setItem('permanent_admin_email', session.user.email || ADMIN_EMAIL);
          navigate("/ebook-planner", { replace: true });
        } else {
          setStatus("error");
          setMessage("Accès refusé - Vous n'êtes pas administrateur");
        }
      }
    });

    // Check existing session or send magic link
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin"
          });

          if (isAdmin) {
            sessionStorage.setItem('is_admin', 'true');
            localStorage.setItem('permanent_admin_email', session.user.email || ADMIN_EMAIL);
            navigate("/ebook-planner", { replace: true });
            return;
          }
        }

        // No active session - send magic link
        setStatus("sending");
        setMessage(`Envoi du lien magique à ${ADMIN_EMAIL}...`);

        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: ADMIN_EMAIL,
          options: {
            emailRedirectTo: `${window.location.origin}/admin-direct`
          }
        });

        if (magicLinkError) {
          if (magicLinkError.status === 429) {
            setStatus("sent");
            setMessage("Lien déjà envoyé récemment. Vérifiez votre boîte mail.");
            return;
          }
          console.error("Magic link error:", magicLinkError);
          setStatus("error");
          setMessage("Erreur lors de l'envoi du lien");
          return;
        }

        setStatus("sent");
        setMessage("Lien magique envoyé ! Vérifiez votre boîte mail.");
      } catch (err) {
        console.error("Admin direct error:", err);
        setStatus("error");
        setMessage("Une erreur est survenue");
      }
    };

    init();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Accès Admin Direct</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {status === "checking" && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
            {status === "sending" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            {status === "sent" && <Mail className="w-5 h-5 text-green-500" />}
            {status === "authenticating" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            {status === "error" && <CheckCircle className="w-5 h-5 text-destructive" />}
            <p className="text-muted-foreground">{message}</p>
          </div>

          {status === "sent" && (
            <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-300">
                Cliquez sur le lien dans l'email pour vous connecter automatiquement.
              </p>
            </div>
          )}

          {status === "error" && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDirectPage;
