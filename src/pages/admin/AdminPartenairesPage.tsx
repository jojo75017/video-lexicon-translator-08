import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Target, Users } from 'lucide-react';
import AmbassadorOutreachTracker from '@/components/ambassador/AmbassadorOutreachTracker';
import CopyBlockList from '@/components/partners/CopyBlockList';
import {
  BEST_COMMISSION,
  COMMISSION_FIRST_PAYMENT_RATE,
  PARTNER_ORIGIN,
  PARTNER_PAGE_PATH,
  PARTNER_PLATFORMS,
  PARTNER_TARGET_TYPES,
  buildOutreachMessages,
  formatEuro,
} from '@/data/partnerProgram';

/**
 * Espace de recrutement de partenaires (réservé à l'administration).
 * Réunit : le suivi des contacts, les messages de démarchage prêts à envoyer
 * et la liste des types de cibles à travailler.
 */
export default function AdminPartenairesPage() {
  const kitUrl = `${PARTNER_ORIGIN}${PARTNER_PAGE_PATH}`;
  const messages = useMemo(() => buildOutreachMessages(kitUrl), [kitUrl]);
  const ratePct = Math.round(COMMISSION_FIRST_PAYMENT_RATE * 100);

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 text-[#232F3E]">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#008296]">
            Acquisition
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold">
            <Users className="h-7 w-7 text-[#008296]" /> Recrutement de partenaires
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[#232F3E]/70">
            Le levier le plus rapide : emprunter l'audience de gens qui en ont déjà une. Vous
            contactez, ils recommandent, vous versez {ratePct} % du premier paiement — jusqu'à{' '}
            {formatEuro(BEST_COMMISSION)} par abonnement annuel.
          </p>
        </header>

        <div className="rounded-xl border border-[#232F3E]/10 bg-white p-5">
          <h2 className="text-sm font-bold">La page à envoyer</h2>
          <p className="mt-1 text-sm text-[#232F3E]/70">
            Tout est expliqué dessus : commissions, règles, candidature. Vos messages pointent déjà
            vers elle.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={kitUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-[240px] flex-1 rounded-lg border border-[#232F3E]/15 bg-[#FAFAFA] px-3 py-2 font-mono text-sm"
            />
            <Link
              to={PARTNER_PAGE_PATH}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#008296] px-4 py-2 text-sm font-semibold text-white"
            >
              <ExternalLink className="h-4 w-4" /> Ouvrir la page
            </Link>
          </div>
        </div>

        <Tabs defaultValue="messages">
          <TabsList>
            <TabsTrigger value="messages">Messages à envoyer</TabsTrigger>
            <TabsTrigger value="cibles">Qui contacter</TabsTrigger>
            <TabsTrigger value="suivi">Suivi des contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-5">
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-[#232F3E]/80">
              <strong>La règle qui change tout :</strong> un seul message, puis une seule relance à
              cinq jours. Ensuite on passe à la cible suivante. Cinq à dix contacts sérieux valent
              mieux que cent envois identiques.
            </div>
            <CopyBlockList blocks={messages} tone="admin" />
          </TabsContent>

          <TabsContent value="cibles" className="mt-5">
            <div className="space-y-3">
              {PARTNER_TARGET_TYPES.map((t) => (
                <div key={t.label} className="rounded-xl border border-[#232F3E]/10 bg-white p-5">
                  <h3 className="flex items-start gap-2 font-bold">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-[#008296]" />
                    {t.label}
                  </h3>
                  <p className="mt-2 text-sm text-[#232F3E]/75">
                    <span className="font-semibold">Où les trouver : </span>
                    {t.where}
                  </p>
                  <p className="mt-1 text-sm text-[#232F3E]/75">
                    <span className="font-semibold">Pourquoi eux : </span>
                    {t.why}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suivi" className="mt-5">
            <AmbassadorOutreachTracker
              platforms={PARTNER_PLATFORMS}
              addLabel="Ajouter une cible à contacter"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
