import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  // En mode édition/dev, on évite les toasts (popups) qui deviennent vite envahissants.
  const shouldToast = !import.meta.env.DEV;

  const checkAdmin = async (accessToken?: string) => {
    // Important: after sign-in, the client token can take a tick to propagate.
    // Passing the access token explicitly avoids false "non-admin" results.
    return supabase.functions.invoke(
      'check-admin',
      accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
    );
  };

  useEffect(() => {
    // Si l'admin est déjà reconnu côté client (sessionStorage) ou via email admin permanent,
    // on évite d'afficher cette page et on renvoie directement vers le générateur.
    const storedPermanentAdminEmail = (localStorage.getItem('permanent_admin_email') || '').toLowerCase();
    if (sessionStorage.getItem('is_admin') === 'true' || storedPermanentAdminEmail === 'boubetgeorges@gmail.com') {
      navigate('/ebook-planner', { replace: true });
      return;
    }

    // Redirection silencieuse si déjà admin avec session active
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Pas de session = pas de vérification automatique
        if (!session) {
          console.log('AuthPage: Pas de session, affichage du formulaire');
          return;
        }

        // Vérification silencieuse en arrière-plan (sans popup ni toast)
        const { data, error } = await checkAdmin(session.access_token);
        
        // En cas d'erreur, on ignore silencieusement et on laisse l'utilisateur se connecter
        if (error) {
          console.log('AuthPage: Erreur check-admin silencieuse, formulaire affiché');
          return;
        }

        if (data?.isAdmin) {
          sessionStorage.setItem('is_admin', 'true');
          navigate('/admin', { replace: true });
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
      if (isLogin) {
        console.log('Tentative de connexion pour:', email);

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Erreur de connexion:', signInError);
          throw signInError;
        }

        const accessToken = signInData?.session?.access_token;

        console.log('Connexion réussie, vérification du rôle admin...');

        // Vérifie le rôle admin (passe le token explicitement pour éviter les faux négatifs)
        const { data: roleData, error: roleError } = await checkAdmin(accessToken);

        console.log('Résultat vérification admin:', { roleData, roleError });

        if (roleError) {
          console.error('Erreur lors de la vérification du rôle:', roleError);
          toast.error('Erreur de vérification', {
            description: 'Impossible de vérifier les droits administrateur. Réessayez dans quelques secondes.',
          });
          setIsLoading(false);
          return;
        }

        if (!roleData?.isAdmin) {
          console.log('Utilisateur non-admin détecté');
          toast.error('Accès refusé', {
            description: "Cette page est réservée à l'administration. Pour accéder au générateur, connectez-vous avec votre email + code d'accès.",
          });
          // Important: éviter qu'une session non-admin puisse court-circuiter l'accès par code
          await supabase.auth.signOut();
          navigate('/subscription', { replace: true });
          setIsLoading(false);
          return;
        }

        console.log('Utilisateur admin confirmé');
        sessionStorage.setItem('is_admin', 'true');
        if (shouldToast) toast.success('Connexion admin réussie');
        navigate('/admin');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (error) throw error;

        if (shouldToast) {
          toast.success('Compte créé', {
            description: 'Veuillez vérifier votre email pour confirmer votre compte',
          });
        }
      }
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Connexion Admin' : 'Créer un compte Admin'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Connectez-vous avec vos identifiants' : 'Créez votre compte administrateur'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  {isLogin ? 'Connexion...' : 'Création...'}
                </>
              ) : (
                isLogin ? 'Se connecter' : 'Créer le compte'
              )}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-3">
              <div className="text-center text-sm text-muted-foreground">ou</div>
              <form onSubmit={handlePasswordlessLogin} className="mt-3">
                <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'Connexion sans mot de passe (lien email)'
                  )}
                </Button>
              </form>
            </div>
          )}
          {isLogin && (
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
          )}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
            </Button>
          </div>
          <div className="mt-2 text-center">
            <Button
              variant="outline"
              onClick={() => {
                // Accès direct silencieux pour l'admin permanent
                sessionStorage.setItem('is_admin', 'true');
                localStorage.setItem('permanent_admin_email', 'boubetgeorges@gmail.com');
                navigate('/ebook-planner', { replace: true });
              }}
              disabled={isLoading}
              className="text-sm border-primary/50 hover:bg-primary/10"
            >
              🔐 Accès Admin Direct
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