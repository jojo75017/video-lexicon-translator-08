import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Headphones, Check, KeyRound, ExternalLink, Gift } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { AUDIO_SINGLE_PRICE_ID } from '@/data/v3Pricing';

const STEPS = [
  {
    t: 'Créer un compte Azure gratuit',
    d: 'Rendez-vous sur azure.microsoft.com/fr-fr/free et créez un compte Microsoft (une carte est demandée pour vérifier l’identité, rien n’est prélevé tant que vous restez dans l’offre gratuite).',
    href: 'https://azure.microsoft.com/fr-fr/free/',
  },
  {
    t: 'Créer la ressource « Speech »',
    d: 'Dans le portail Azure, cliquez sur « Créer une ressource », cherchez « Speech » (Services Speech), puis « Créer ».',
    href: 'https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices',
  },
  {
    t: 'Choisir la région et l’offre',
    d: 'Région : « France Central » ou « West Europe ». Niveau tarifaire : « Free F0 » pour commencer (500 000 caractères gratuits par mois), ou « Standard S0 » pour un livre entier.',
  },
  {
    t: 'Copier la clé et la région',
    d: 'Une fois la ressource créée, ouvrez « Clés et point de terminaison ». Copiez la « Clé 1 » et le nom de la région (ex. francecentral).',
  },
  {
    t: 'Coller dans EbookStudio',
    d: 'Ouvrez « Choisir mon IA · Clés API », collez la clé Azure Speech et la région, puis enregistrez. Votre clé reste privée.',
    to: '/v3/fonctionnalites/cles',
  },
];

export default function V3VersionAudioPage() {
  const [params] = useSearchParams();
  const paid = params.get('paye') === '1';
  const [checkout, setCheckout] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/v3" />

        <header className="v3-card p-6 mb-6 bg-gradient-to-br from-[#FFF6E8] to-[#FFE9C7] border border-[color:var(--v3-orange)]/25">
          <span className="v3-chip v3-chip-orange text-xs">
            <Gift className="w-3.5 h-3.5" /> Prix de lancement offert aux abonnés
          </span>
          <h1 className="v3-serif text-3xl font-bold mt-3 text-[var(--v3-ink)] flex items-center gap-3">
            <Headphones className="w-8 h-8 text-[var(--v3-orange-600)]" /> Version audio de votre livre
          </h1>
          <p className="text-[var(--v3-muted)] mt-2">
            Transformez votre livre en livre audio avec des voix françaises naturelles, prêt à écouter
            ou à proposer à vos lecteurs.
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
            {[
              'Paiement unique de 9,99 €, sans abonnement',
              'Voix neuronales françaises (Azure Speech)',
              'MP3 unique ou un fichier par chapitre',
              'Votre livre repris directement depuis « Mes livres »',
            ].map((t) => (
              <li key={t} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-[var(--v3-orange-600)] shrink-0" />{t}</li>
            ))}
          </ul>

          {paid ? (
            <div className="mt-5 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
              Merci ! Votre paiement est enregistré. Ajoutez votre clé Azure (guide ci-dessous), puis
              ouvrez le studio audio.
              <div className="mt-3">
                <Link to="/v3/outils/audiobook" className="v3-btn v3-btn-primary">
                  <Headphones className="w-4 h-4" /> Ouvrir le studio audio
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => setCheckout(true)} className="v3-btn v3-btn-primary">
                <Headphones className="w-4 h-4" /> Payer 9,99 € et activer
              </button>
              <a href="#cle-azure" className="v3-btn v3-btn-outline">
                <KeyRound className="w-4 h-4" /> Comment obtenir ma clé Azure
              </a>
            </div>
          )}
        </header>

        <section id="cle-azure" className="v3-card p-6 mb-6 scroll-mt-24">
          <h2 className="v3-serif text-2xl font-bold text-[var(--v3-ink)] flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-[var(--v3-orange-600)]" /> Obtenir ma clé Azure Speech
          </h2>
          <p className="text-sm text-[var(--v3-muted)] mt-1">Environ 10 minutes, une seule fois.</p>
          <ol className="mt-5 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--v3-orange)] text-white font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <div className="font-semibold text-[var(--v3-ink)]">{s.t}</div>
                  <p className="text-sm text-[var(--v3-muted)] mt-0.5">{s.d}</p>
                  {s.href && (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[var(--v3-orange-600)] inline-flex items-center gap-1 mt-1">
                      Ouvrir <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {s.to && (
                    <Link to={s.to} className="text-sm underline text-[var(--v3-orange-600)] mt-1 inline-block">Ouvrir mes clés API</Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Coût Azure à votre charge : gratuit jusqu'à 500 000 caractères par mois, puis environ 3 à 5 €
            pour un livre de 40 000 mots. Facturé directement par Microsoft.
          </div>
        </section>
      </div>

      {checkout && (
        <V3SubscribeCheckout
          priceId={AUDIO_SINGLE_PRICE_ID}
          planName="Version audio d'un livre — 9,99 €"
          onClose={() => setCheckout(false)}
          returnUrl={`${window.location.origin}/v3/version-audio?paye=1&session_id={CHECKOUT_SESSION_ID}`}
        />
      )}
    </div>
  );
}
