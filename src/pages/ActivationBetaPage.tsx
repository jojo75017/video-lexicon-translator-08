import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, KeyRound, Loader2, CheckCircle2, ArrowRight, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Page d'activation pour les bêta-testeurs.
 * Accessible via /activer-beta. L'utilisateur saisit son email + code BETA-EBOOK-XXXX
 * pour débloquer un accès gratuit à vie à EbookStudio Pro V2.
 */
const ActivationBetaPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Merci de saisir un email valide');
      return;
    }
    if (!cleanCode) {
      toast.error('Merci de saisir votre code promo');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-beta-code', {
        body: { email: cleanEmail, code: cleanCode },
      });

      if (error) throw error;

      if (data?.success) {
        setAccessCode(data.access_code || '');
        setSuccess(true);
        toast.success('Accès activé !');
      } else {
        toast.error(data?.error || 'Code invalide. Vérifiez votre code et réessayez.');
      }
    } catch (err: any) {
      console.error('Erreur activation bêta:', err);
      toast.error("Une erreur est survenue. Réessayez dans un instant.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <CardTitle>Bienvenue dans la communauté ! 🎉</CardTitle>
            <CardDescription>
              Félicitations ! Votre accès gratuit à vie à EbookStudio Pro V2 est activé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-primary/40 bg-muted/40 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Votre code de connexion</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold tracking-widest text-primary font-mono">
                  {accessCode}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(accessCode);
                    toast.success('Code copié');
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Connectez-vous avec <strong>{email.trim().toLowerCase()}</strong> et ce code.
                Il vous a aussi été envoyé par email.
              </p>
            </div>
            <Button className="w-full" onClick={() => navigate('/subscription')}>
              Me connecter maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Activer mon accès bêta</CardTitle>
          <CardDescription>
            Saisissez votre code <strong>BETA-EBOOK-XXXX</strong> pour débloquer votre accès gratuit à vie à EbookStudio Pro V2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code promo</Label>
              <Input
                id="code"
                type="text"
                placeholder="BETA-EBOOK-1234"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                className="font-mono tracking-wide"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Activer mon accès
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivationBetaPage;
