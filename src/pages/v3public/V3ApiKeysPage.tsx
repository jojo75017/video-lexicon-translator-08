import { Helmet } from 'react-helmet';
import { KeyRound, Lock } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';
import { EbookSettingsPanel } from '@/components/ebook/EbookSettingsPanel';

/** Paramétrage des clés IA (BYOK) en page plein écran. */
export default function V3ApiKeysPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Helmet>
        <title>Paramétrage des clés IA — Ebookstudio</title>
        <meta
          name="description"
          content="Enregistrez votre clé Gemini, OpenAI ou OpenRouter pour faire tourner l'écriture, la correction et l'humaniseur avec votre propre moteur."
        />
      </Helmet>

      <BackButton to="/v3/fonctionnalites" label="Retour aux fonctionnalités" />

      <header className="mb-6 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <KeyRound className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Paramétrage des clés
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Une seule clé suffit : Gemini fait tourner l'écriture, la correction et l'humaniseur.
          OpenAI et OpenRouter sont facultatifs. Sans clé, le moteur intégré prend le relais.
        </p>
        <p
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(6,78,59,0.08)', color: 'var(--v3-emerald)' }}
        >
          <Lock className="h-3.5 w-3.5" /> Vos clés restent dans votre navigateur : personne d'autre ne les voit.
        </p>
      </header>

      <EbookSettingsPanel />
    </div>
  );
}
