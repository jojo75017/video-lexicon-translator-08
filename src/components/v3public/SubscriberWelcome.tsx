import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import AgentPortrait from './AgentPortrait';
import { shouldShowWelcome, welcomeStorageKey, WELCOME_CHOICES } from '@/lib/subscriberWelcome';
import './SubscriberWelcome.css';

export default function SubscriberWelcome({ userId }: { userId: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setVisible(false);
    let completed = false;
    try { completed = localStorage.getItem(welcomeStorageKey(userId)) === 'done'; } catch { /* Storage may be unavailable. */ }
    if (completed) return;
    void supabase.from('subscribers').select('created_at,status,plan_type').eq('user_id', userId).maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error) setVisible(shouldShowWelcome(data, completed));
      });
    return () => { cancelled = true; };
  }, [userId]);
  const complete = () => {
    try { localStorage.setItem(welcomeStorageKey(userId), 'done'); } catch { /* Dismiss for this session. */ }
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <section aria-label="Vos premiers pas" className="subscriber-welcome">
      <div className="v3-shell py-6 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">Votre premier projet</h2>
          <Button size="icon" variant="ghost" onClick={complete} aria-label="Fermer l’accueil de bienvenue" title="Fermer l’accueil de bienvenue"><X className="h-4 w-4" /></Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm">Avant de commencer, ajoutez votre clé Gemini gratuite ou celle que vous utilisez déjà. Les éventuels frais de votre fournisseur restent distincts de votre abonnement.</p>
          <Button asChild className="welcome-key"><Link to="/v3/fonctionnalites/cles"><KeyRound className="mr-2 h-4 w-4" />Configurer ma clé</Link></Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {WELCOME_CHOICES.map(choice => <Button key={choice.to} asChild variant="outline" className="welcome-choice h-auto min-h-28 justify-start whitespace-normal rounded-lg p-4">
            <Link to={choice.to} onClick={complete}>
              <div className="mr-3 h-16 w-16 shrink-0 overflow-hidden rounded-lg"><AgentPortrait id={choice.agent} name={choice.name} /></div>
              <span className="text-left text-base font-semibold">{choice.title}</span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
            </Link>
          </Button>)}
        </div>
        <Button variant="ghost" onClick={complete} className="mt-4">Plus tard, accéder à mon espace</Button>
      </div>
    </section>
  );
}