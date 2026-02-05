import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, Unlock, HelpCircle, Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubscriptionAuthProps {
  onAuthenticated: (email: string, subscriber: any) => void;
}

export const SubscriptionAuth = ({ onAuthenticated }: SubscriptionAuthProps) => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasAdminSession(true);
      }
    };
    checkAdminSession();
  }, []);

  const handleAdminAccess = async () => {
    setIsCheckingAdmin(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Aucune session admin active', {
          description: 'Veuillez vous connecter via "Connexion Admin"'
        });
        navigate('/auth');
        return;
      }

      await supabase.functions.invoke('bootstrap-admin');
      const { data } = await supabase.functions.invoke('check-admin');
      
      if (data?.isAdmin) {
        toast.success('Accès admin confirmé');
        navigate('/admin');
      } else {
        toast.error('Accès refusé', {
          description: 'Votre compte n\'a pas les droits administrateur'
        });
      }
    } catch (error) {
      console.error('Admin access error:', error);
      toast.error('Erreur lors de la vérification');
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = accessCode.trim().toUpperCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    if (!normalizedCode) {
      toast.error('Veuillez entrer votre code d\'accès');
      return;
    }

    // IMPORTANT: éviter toute confusion (ex: "4242") en imposant le format officiel.
    // Format attendu : EBK-XXXXXX (6 caractères alphanumériques)
    if (!/^EBK-[A-Z0-9]{6}$/.test(normalizedCode)) {
      toast.error('Code invalide', {
        description: 'Le code doit être au format EBK-XXXXXX (ex: EBK-1A2B3C).',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-subscription', {
        body: { 
          email: normalizedEmail,
          access_code: normalizedCode 
        }
      });

      if (error) throw error;

      if (data.valid) {
        localStorage.setItem('subscriber_email', normalizedEmail);
        localStorage.setItem('subscriber_data', JSON.stringify(data.subscriber));
        toast.success(`Bienvenue ! Plan ${data.subscriber.plan_type}`);
        onAuthenticated(normalizedEmail, data.subscriber);
        navigate('/ebook-planner');
      } else {
        toast.error(data.message || 'Abonnement non trouvé');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = recoveryEmail.trim().toLowerCase();
    
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsRecovering(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resend-access-code', {
        body: { email: normalizedEmail }
      });

      if (error) throw error;

      if (data.rateLimitExceeded) {
        toast.error(data.error || 'Trop de tentatives');
      } else if (data.success) {
        toast.success('Email envoyé !', {
          description: data.message
        });
        setIsRecoveryOpen(false);
        setRecoveryEmail('');
      } else {
        toast.error(data.error || 'Erreur lors de la récupération');
      }
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsRecovering(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          {hasAdminSession && (
            <div className="flex flex-col items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Badge className="bg-green-500">Session admin active</Badge>
              <Button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/ebook-planner')}
              >
                Accéder au Planner (Admin)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                Panel Admin
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    setHasAdminSession(false);
                    toast.success('Session admin déconnectée');
                  } catch {
                    toast.error('Impossible de déconnecter la session admin');
                  }
                }}
              >
                Se déconnecter (admin)
              </Button>
            </div>
          )}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Générateur d'Ebook</h1>
          <p className="text-muted-foreground">
            Connectez-vous avec l'email de votre abonnement
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Code d'accès</label>
              <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    variant="link" 
                    size="sm" 
                    className="text-xs h-auto p-0"
                  >
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Code perdu ?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Récupérer votre code d'accès</DialogTitle>
                    <DialogDescription>
                      Entrez votre email et nous vous enverrons votre code d'accès.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRecoverCode} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="recovery-email">Email</Label>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        disabled={isRecovering}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isRecovering}
                    >
                      {isRecovering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Recevoir mon code'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="EBK-XXXXXX"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="pl-10 pr-10 font-mono"
                disabled={isLoading}
                maxLength={10}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Format : EBK-XXXXXX (6 caractères)
            </p>
          </div>

          <Button
            type="submit" 
            className="w-full"
            disabled={isLoading || !email || !accessCode}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Accéder au générateur
              </>
            )}
          </Button>
        </form>


        <div className="text-center text-sm text-muted-foreground space-y-3">
          <div>
            <p>Pas encore abonné ?</p>
            <a 
              href="/offres" 
              className="text-primary hover:underline font-medium"
            >
              Souscrire maintenant
            </a>
          </div>
          
          <div className="pt-3 border-t">
            <p className="mb-2">Administrateur ?</p>
            <div className="flex flex-col gap-2">
              {hasAdminSession && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleAdminAccess}
                  disabled={isCheckingAdmin}
                >
                  {isCheckingAdmin ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Accès Admin direct
                    </>
                  )}
                </Button>
              )}
              <Link 
                to="/auth"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline font-medium"
              >
                <Lock className="w-4 h-4" />
                Connexion Admin
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};