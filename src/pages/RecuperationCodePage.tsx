import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Page autonome pour récupérer son code d'accès EBK-XXXXXX par email.
 * Accessible via /mon-code (lien depuis la page de connexion).
 */
const RecuperationCodePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Merci d\'entrer votre email');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('resend-access-code', {
        body: { email: email.trim().toLowerCase() },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setSent(true);
      toast.success('Email envoyé ! Vérifiez votre boîte de réception.');
    } catch (err: any) {
      console.error('Erreur récupération code:', err);
      toast.error(err.message || 'Impossible d\'envoyer l\'email. Réessayez plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Récupérer mon code d'accès</CardTitle>
          <CardDescription>
            Entrez l'email de votre abonnement, nous vous renverrons votre code <strong>EBK-XXXXXX</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium">Email envoyé !</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Si <strong>{email}</strong> est enregistré, vous recevrez votre code dans quelques instants.
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Pensez à vérifier vos spams.
                </p>
              </div>
              <Button onClick={() => navigate('/subscription')} className="w-full">
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email d'abonnement</Label>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Recevoir mon code par email
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/subscription')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperationCodePage;
