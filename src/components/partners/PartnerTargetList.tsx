import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, ExternalLink, Mail, Plus, Send } from 'lucide-react';
import {
  PARTNER_EXCLUDED_TARGETS,
  PARTNER_TARGETS,
  PARTNER_TARGETS_RULE,
  targetContactUrl,
  type PartnerTarget,
} from '@/data/partnerOutreachTargets';
import { PARTNER_PLATFORMS } from '@/data/partnerProgram';

const platformLabel = (v: string) =>
  PARTNER_PLATFORMS.find((p) => p.value === v)?.label ?? v;

/**
 * Liste de cibles prête à travailler : chaque ligne indique l'endroit de contact
 * le plus probable et peut être ajoutée en un clic au suivi des contacts.
 * Lecture seule côté données métier — seule la table de suivi est alimentée.
 */
export default function PartnerTargetList() {
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState<string | null>(null);

  const loadExisting = async () => {
    const { data } = await supabase
      .from('ambassador_outreach')
      .select('handle, email, status');
    if (!data) return;
    setExisting(new Set(data.map((r) => (r.handle ?? '').trim())));
    const known: Record<string, string> = {};
    const done = new Set<string>();
    data.forEach((r) => {
      const h = (r.handle ?? '').trim();
      if (r.email) known[h] = r.email;
      if (r.status && r.status !== 'a_contacter') done.add(h);
    });
    setEmails((prev) => ({ ...known, ...prev }));
    setSent(done);
  };

  useEffect(() => {
    loadExisting();
  }, []);

  const addRows = async (targets: PartnerTarget[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Connectez-vous pour utiliser le suivi.');
      return 0;
    }
    const toAdd = targets.filter((t) => !existing.has(t.name));
    if (toAdd.length === 0) {
      toast.info('Déjà dans le suivi.');
      return 0;
    }
    const { error } = await supabase.from('ambassador_outreach').insert(
      toAdd.map((t) => ({
        owner_id: user.id,
        handle: t.name,
        platform: t.platform,
        niche: t.niche,
        status: 'a_contacter',
        source: 'manual',
        notes: `${t.contact} — ${t.where}${t.verified ? '' : ' (à vérifier avant envoi)'}`,
      })),
    );
    if (error) {
      toast.error(error.message);
      return 0;
    }
    setExisting((prev) => {
      const next = new Set(prev);
      toAdd.forEach((t) => next.add(t.name));
      return next;
    });
    return toAdd.length;
  };

  const addOne = async (t: PartnerTarget) => {
    setBusy(t.name);
    const n = await addRows([t]);
    setBusy(null);
    if (n > 0) toast.success(`${t.name} ajouté au suivi`);
  };

  const addAll = async () => {
    setBulk(true);
    const n = await addRows(PARTNER_TARGETS);
    setBulk(false);
    if (n > 0) toast.success(`${n} cible(s) ajoutée(s) au suivi`);
  };

  /**
   * Envoi du premier message à une cible dont l'adresse a été trouvée.
   * L'adresse est saisie à la main : rien n'est deviné, aucun envoi de masse.
   */
  const sendTo = async (t: PartnerTarget) => {
    const to = (emails[t.name] ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
      toast.error('Collez d’abord une adresse e-mail valide.');
      return;
    }
    setSending(t.name);
    try {
      const { data, error } = await supabase.functions.invoke('send-partner-outreach', {
        body: { to, name: t.name, niche: t.niche },
      });
      if (error) throw error;
      if (!data?.success) {
        toast.error(data?.error ?? "L'envoi n'a pas abouti.");
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const patch = {
          email: to,
          status: 'message1',
          last_contact_at: new Date().toISOString(),
          follow_up_at: new Date(Date.now() + 5 * 86_400_000).toISOString(),
        };
        if (existing.has(t.name)) {
          await supabase.from('ambassador_outreach').update(patch).eq('handle', t.name);
        } else {
          await supabase.from('ambassador_outreach').insert({
            owner_id: user.id,
            handle: t.name,
            platform: t.platform,
            niche: t.niche,
            source: 'manual',
            ...patch,
          });
          setExisting((prev) => new Set(prev).add(t.name));
        }
      }
      setSent((prev) => new Set(prev).add(t.name));
      toast.success(`Message envoyé à ${t.name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "L'envoi a échoué.");
    } finally {
      setSending(null);
    }
  };

  const remaining = useMemo(
    () => PARTNER_TARGETS.filter((t) => !existing.has(t.name)).length,
    [existing],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-[#232F3E]/80">
        <strong>La règle :</strong> {PARTNER_TARGETS_RULE}
      </div>

      <div className="rounded-xl border border-[#232F3E]/10 bg-white p-4 text-sm text-[#232F3E]/75">
        <strong>Écartés volontairement</strong> (ils vendent déjà un outil du même genre) :
        <ul className="mt-2 space-y-1">
          {PARTNER_EXCLUDED_TARGETS.map((e) => (
            <li key={e.name}>
              • <span className="font-semibold">{e.name}</span> — {e.reason}
            </li>
          ))}
        </ul>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[#232F3E]/70">
          {PARTNER_TARGETS.length} cibles · {remaining} pas encore dans le suivi
        </p>
        <Button
          onClick={addAll}
          disabled={bulk || remaining === 0}
          style={{ background: '#FF9E2D', color: '#232F3E' }}
          className="font-semibold"
        >
          <Plus className="mr-1 h-4 w-4" /> Tout ajouter au suivi
        </Button>
      </div>

      <div className="space-y-2">
        {PARTNER_TARGETS.map((t) => {
          const added = existing.has(t.name);
          return (
            <div
              key={t.name}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[#232F3E]/10 bg-white p-4"
            >
              <div className="min-w-[220px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#232F3E]">{t.name}</span>
                  <span className="rounded-full bg-[#232F3E]/5 px-2 py-0.5 text-xs text-[#232F3E]/60">
                    {platformLabel(t.platform)}
                  </span>
                  {!t.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      <AlertTriangle className="h-3 w-3" /> à vérifier
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[#232F3E]/75">
                  <Mail className="mr-1 inline h-3.5 w-3.5 text-[#008296]" />
                  <span className="font-semibold">{t.contact}</span> — {t.where}
                </p>
                <p className="text-xs text-[#232F3E]/50">Niche : {t.niche}</p>
              </div>
              {added ? (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Dans le suivi
                </span>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => addOne(t)}
                  disabled={busy === t.name}
                  className="border-[#008296] text-[#008296]"
                >
                  <Plus className="mr-1 h-4 w-4" /> Ajouter au suivi
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
