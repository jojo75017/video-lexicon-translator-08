import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { trackFormSubmit } from '@/utils/analytics';
import { clearAdminCache, getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

export const AuthPage = () => {
  const [email, setEmail] = useState('boubetgeorges@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [usePasswordMode, setUsePasswordMode] = useState(false);
  const navigate = useNavigate();

  // En mode édition/dev, on évite les toasts (popups) qui deviennent vite envahissants.
  const shouldToast = !import.meta.env.DEV;

  useEffect(() => {
    // Redirection silencieuse si déjà admin avec session active
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('AuthPage: Pas de session, affichage du formulaire');
          return;
        }

        if (await getIsCurrentSessionAdmin()) {
          navigate(ADMIN_HOME_PATH, { replace: true });
        }
      } catch (error) {
        // Ignorer les erreurs silencieusement
        console.log('AuthPage: Exception checkAuth ignorée');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast.success("Email envoyé", {
        description: "Vérifiez votre boîte email pour réinitialiser votre mot de passe"
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error("Erreur", {
        description: error.message || "Impossible d'envoyer l'email"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordlessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        if (shouldToast) {
          toast.error('Email requis', { description: "Entrez votre email pour recevoir un lien de connexion." });
        }
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      toast.success('Lien envoyé', {
        description: 'Ouvrez le lien reçu par email pour vous connecter en admin.',
      });
    } catch (error: any) {
      console.error('Passwordless login error:', error);
      toast.error('Erreur', {
        description: error.message || "Impossible d'envoyer le lien",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Tentative de connexion administrateur');

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (signInError) {
          console.error('Erreur de connexion:', signInError);
          throw signInError;
        }

        if (!signInData.session) throw new Error('La session administrateur n’a pas pu être créée.');
        clearAdminCache();

        console.log('Connexion réussie, vérification du rôle admin...');

        const isAdmin = await getIsCurrentSessionAdmin();
        if (!isAdmin) {
          console.log('Utilisateur non-admin détecté');
          toast.error('Accès refusé', {
            description: "Ce compte ne possède pas les droits administrateur.",
          });
          // Important: éviter qu'une session non-admin puisse court-circuiter l'accès par code
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        console.log('Utilisateur admin confirmé');
        if (shouldToast) toast.success('Connexion admin réussie');
        trackFormSubmit('admin_login', email);
        navigate(ADMIN_HOME_PATH, { replace: true });
    } catch (error: any) {
      console.error('Auth error:', error);
      if (shouldToast) {
        toast.error('Erreur', {
          description: error.message || 'Une erreur est survenue',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer le lien'
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsForgotPassword(false)}
                disabled={isLoading}
              >
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary hidden" />
            <span className="text-xl">🔐</span>
          </div>
          <CardTitle className="text-xl">Connexion Admin</CardTitle>
          <CardDescription>
            Connectez-vous avec vos identifiants administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Champ email commun */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="votre@email.com"
            />
          </div>

          {/* MODE CONNEXION : lien magique recommandé */}
          {!usePasswordMode && (
            <div className="space-y-3">
              <form onSubmit={handlePasswordlessLogin}>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi du lien...
                    </>
                  ) : (
                    'Recevoir mon lien d’accès admin'
                  )}
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground">
                Un lien personnel et temporaire sera envoyé à cette adresse.
              </p>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => setUsePasswordMode(true)}
                  disabled={isLoading}
                >
                  Utiliser plutôt un mot de passe
                </Button>
              </div>
            </div>
          )}

          {/* MODE MOT DE PASSE (connexion) ou création de compte */}
          {usePasswordMode && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
              {usePasswordMode && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => setUsePasswordMode(false)}
                    disabled={isLoading}
                  >
                    ← Revenir au lien par email
                  </Button>
                </div>
              )}
            </form>
          )}

          <div className="mt-2 text-center">
            <Button
              variant="link"
              onClick={() => setIsForgotPassword(true)}
              disabled={isLoading}
              className="text-sm"
            >
              Mot de passe oublié ?
            </Button>
          </div>
          <div className="mt-2 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;