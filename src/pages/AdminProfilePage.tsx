import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, User, Lock } from 'lucide-react';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

export const AdminProfilePage = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          toast.error("Non connecté", {
            description: "Veuillez vous connecter pour accéder à cette page"
          });
          navigate('/auth');
          return;
        }

        // Vérifie le rôle admin
        const { data: roleData, error: roleError } = await supabase.functions.invoke('check-admin');
        
        if (roleError || !roleData?.isAdmin) {
          toast.error("Accès refusé", {
            description: "Cette page est réservée aux administrateurs"
          });
          navigate('/');
          return;
        }

        setEmail(session.user.email || '');
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        toast.error("Erreur", {
          description: "Impossible de charger votre profil"
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 6 caractères"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Réauthentification avec le mot de passe actuel
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Erreur", {
          description: "Mot de passe actuel incorrect"
        });
        return;
      }

      // Mise à jour du mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success("Mot de passe modifié", {
        description: "Votre mot de passe a été mis à jour avec succès"
      });

      // Réinitialise les champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error("Erreur", {
        description: error.message || "Impossible de modifier le mot de passe"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <AdminPanelNav />

        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Informations du compte</CardTitle>
            </div>
            <CardDescription>
              Détails de votre compte administrateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                L'adresse email ne peut pas être modifiée
              </p>
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Input
                value="Administrateur"
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Modifier le mot de passe</CardTitle>
            </div>
            <CardDescription>
              Changez votre mot de passe de connexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification en cours...
                  </>
                ) : (
                  'Modifier le mot de passe'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfilePage;
