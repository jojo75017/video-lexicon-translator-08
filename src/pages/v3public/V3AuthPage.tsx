import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Feather, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearAdminCache } from '@/lib/adminAccess';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';
import { useAdminAccess } from '@/contexts/AdminAccessContext';

export default function V3AuthPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { isAdmin, isChecking: isAdminChecking, refresh: refreshAdminAccess } = useAdminAccess();

  useEffect(() => {
    let cancelled = false;

    const redirectExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const destination = isAdmin ? ADMIN_HOME_PATH : SUBSCRIBER_HOME_PATH;
        if (!cancelled) nav(destination, { replace: true });
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    };

    void redirectExistingSession();
    return () => { cancelled = true; };
  }, [isAdmin, isAdminChecking, nav]);

  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/v3/library` },
        });
        if (error) throw error;
        toast.success('Compte créé ✓ Consulte tes emails pour confirmer.');
        nav('/v3/library');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        clearAdminCache();
        const adminResult = await refreshAdminAccess();
        const destination = adminResult === true ? ADMIN_HOME_PATH : SUBSCRIBER_HOME_PATH;
        toast.success('Connexion réussie ✓');
        nav(destination, { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error(msg.includes('Invalid login') ? 'Email ou mot de passe incorrect' : msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-[calc(100vh-4rem)] grid place-items-center" aria-busy="true">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" />
      </main>
    );
  }

  return (
    <section className="v3-halo min-h-[calc(100vh-4rem)] grid place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--v3-orange)] grid place-items-center mx-auto text-white">
            <Feather className="w-6 h-6" />
          </div>
          <h1 className="v3-serif text-3xl font-bold mt-4">
            {mode === 'signup' ? 'Rejoins l\'atelier' : 'Ravi de te revoir'}
          </h1>
          <p className="text-sm text-[var(--v3-muted)] mt-1">
            {mode === 'signup' ? 'Crée ton compte et écris ton premier livre.' : 'Reprends là où tu t\'es arrêté.'}
          </p>
        </div>

        <form onSubmit={submit} className="v3-card space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--v3-orange)]"
              placeholder="tu@exemple.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">Mot de passe</label>
            <input
              type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full h-11 rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--v3-orange)]"
              placeholder="••••••••"
            />
            {mode === 'signup' && password && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className={`h-1 flex-1 rounded ${n <= strength ? 'bg-[var(--v3-orange)]' : 'bg-black/10'}`} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="v3-btn v3-btn-primary w-full justify-center">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-[var(--v3-muted)]">
          {mode === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            className="text-[var(--v3-orange)] font-semibold"
          >
            {mode === 'signup' ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </div>

        <div className="text-center mt-3">
          <Link to="/v3" className="text-xs text-[var(--v3-muted)] hover:underline">← Retour à l'accueil</Link>
        </div>
      </div>
    </section>
  );
}
