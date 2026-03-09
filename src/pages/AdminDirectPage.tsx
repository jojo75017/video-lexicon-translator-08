import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Shield, AlertCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "boubetgeorges@gmail.com";

const AdminDirectPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "idle" | "sending" | "sent" | "authenticating" | "error">("checking");
  const [message, setMessage] = useState("Vérification de la session...");

  const checkAdminAndRedirect = useCallback(async (session: any) => {
    try {
      const { data: isAdmin, error: rpcError } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin"
      });

      if (rpcError) {
        console.warn("RPC has_role error:", rpcError);
        if (session.user.email === ADMIN_EMAIL) {
          sessionStorage.setItem('is_admin', 'true');
          localStorage.setItem('permanent_admin_email', session.user.email);
          navigate("/admin", { replace: true });
          return true;
        }
        return false;
      }

      if (isAdmin || session.user.email === ADMIN_EMAIL) {
        sessionStorage.setItem('is_admin', 'true');
        localStorage.setItem('permanent_admin_email', session.user.email || ADMIN_EMAIL);
        navigate("/admin", { replace: true });
        return true;
      }

      return false;
    } catch (err) {
      console.error("Admin check error:", err);
      if (session.user.email === ADMIN_EMAIL) {
        sessionStorage.setItem('is_admin', 'true');
        localStorage.setItem('permanent_admin_email', session.user.email);
        navigate("/admin", { replace: true });
        return true;
      }
      return false;
    }
  }, [navigate]);

  const sendMagicLink = async () => {
    setStatus("sending");
    setMessage(`Envoi du lien magique à ${ADMIN_EMAIL}...`);

    const redirectTo = typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : '/admin-direct';

    console.log("[AdminDirect] Sending OTP to:", ADMIN_EMAIL, "redirectTo:", redirectTo);
    const { data: otpData, error: magicLinkError } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        emailRedirectTo: redirectTo
      }
    });
    console.log("[AdminDirect] OTP response:", { data: otpData, error: magicLinkError });

    if (magicLinkError) {
      if (magicLinkError.status === 429) {
        setStatus("sent");
        setMessage("⚠️ Rate limit atteint. Attendez quelques minutes puis réessayez. Vérifiez aussi vos spams.");
        return;
      }
      console.error("Magic link error:", JSON.stringify(magicLinkError));
      setStatus("error");
      setMessage(`Erreur: ${magicLinkError.message || "Erreur inconnue"}`);
      return;
    }

    setStatus("sent");
    setMessage("Lien magique envoyé ! Vérifiez votre boîte mail.");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setStatus("authenticating");
        setMessage("Authentification en cours...");

        const success = await checkAdminAndRedirect(session);
        if (!success) {
          setStatus("error");
          setMessage("Accès refusé - Vous n'êtes pas administrateur");
        }
      }
    });

    // Only check existing session, do NOT auto-send a new link
    const init = async () => {
      try {
        console.log("[AdminDirect] Checking existing session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("[AdminDirect] Session result:", { 
          hasSession: !!session, 
          email: session?.user?.email,
          error: sessionError?.message 
        });

        if (session) {
          const success = await checkAdminAndRedirect(session);
          console.log("[AdminDirect] Admin check result:", success);
          if (success) return;
        }

        // No session - show button to send link manually
        setStatus("idle");
        setMessage("Cliquez ci-dessous pour recevoir votre lien de connexion admin.");
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
            <Button onClick={sendMagicLink} className="w-full mt-4" size="lg">
              <Send className="w-4 h-4 mr-2" />
              Envoyer le lien de connexion
            </Button>
          )}

          {status === "sent" && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  📧 Cliquez sur le lien dans l'email pour vous connecter.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ N'actualisez pas cette page avant d'avoir cliqué sur le lien, sinon il sera invalidé.
                </p>
              </div>
              <Button variant="outline" onClick={sendMagicLink} size="sm">
                Renvoyer un nouveau lien
              </Button>
            </div>
          )}

          {status === "error" && (
            <Button onClick={() => { setStatus("idle"); setMessage(""); }} variant="outline" className="mt-4">
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDirectPage;
