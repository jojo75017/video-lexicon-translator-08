import { Link } from 'react-router-dom';
import { ArrowLeft, Check, FolderOpen, LayoutTemplate, Wand2, Sparkles } from 'lucide-react';
import CoverStudioPro from '@/components/admin/CoverStudioPro';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import '@/styles/v3-public.css';

const INCLUDED = [
  'Couverture en 3 étapes (qualité V2)',
  'Éditeur broché : modèles, textes, dos et quatrième',
  'Import de votre propre image',
  'Luminosité, contraste, gras, justification',
  'Exports PDF KDP et PNG 300 DPI',
  'Mes couvertures : toutes vos couvertures enregistrées',
];

/** Page d'entrée « Ma couverture » : outils inclus pour tous, puis le Studio V4. */
export default function V3StudioV4Page() {
  const { hasAccess } = useCoverProAccess();
  const actions = [
    { to: '/v3/couverture-express', label: 'Créer en 3 étapes', icon: Wand2 },
    { to: '/v3/mes-couvertures', label: "Ouvrir l'éditeur broché", icon: LayoutTemplate },
    { to: '/v3/mes-couvertures', label: 'Mes couvertures', icon: FolderOpen },
  ];
  return (
    <main className="v3-theme-scope mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Link to="/v3" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Accueil
      </Link>

      <section className="rounded-2xl border bg-card p-6">
        <h1 className="v3-serif text-3xl font-semibold">Ma couverture</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ce qui est inclus dans votre formule, sans rien payer en plus :</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>
          ))}
          <li className="flex gap-2 text-sm">
            {hasAccess
              ? <><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Illustration IA (Cover Studio Pro) incluse</>
              : <><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span className="text-muted-foreground">Option : illustration IA, incluse dans Édition</span></>}
          </li>
        </ul>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {actions.map(({ to, label, icon: Icon }) => (
            <Link key={label} to={to} className="v3-btn v3-btn-primary justify-center py-4 text-base">
              <Icon className="h-5 w-5" /> {label}
            </Link>
          ))}
        </div>
      </section>

      {hasAccess && <CoverStudioPro />}
    </main>
  );
}
