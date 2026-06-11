import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';

interface Props {
  /** Lien perso de l'ambassadeur (déjà construit avec le code). */
  shareLink: string;
  /** Lien du kit / page influenceurs. */
  kitUrl: string;
}

interface Script {
  key: string;
  label: string;
  hint: string;
  build: (firstName: string, niche: string, link: string, kit: string) => string;
}

const SCRIPTS: Script[] = [
  {
    key: 'a1',
    label: '1️⃣ Approche — compliment + mot-clé',
    hint: 'Premier message, AUCUN lien (sinon Instagram le cache dans les demandes).',
    build: (f, n) =>
      `Hello ${f || '[prénom]'} 👋 j'adore ton contenu sur ${n || '[ta niche]'} !
Je développe un outil qui génère un livre Amazon complet (plan, chapitres, couverture KDP) en 30 min avec l'IA, et je cherche 2-3 ambassadeurs (30% de commission par vente).
Ça t'intéresse d'en savoir plus ? Réponds-moi juste « LIVRE » et je t'envoie tout 📚`,
  },
  {
    key: 'a2',
    label: '2️⃣ Approche — question directe',
    hint: 'Variante plus courte, toujours sans lien.',
    build: (f, n) =>
      `Salut ${f || '[prénom]'} ! Tu monétises déjà ton audience ${n || '[ta niche]'} ?
J'ai un programme ambassadeur qui pourrait bien coller (30% par vente, paiement auto, zéro avance).
Je t'envoie le détail si tu réponds « OUI » 🚀`,
  },
  {
    key: 'm2',
    label: '✅ Message 2 — réponse avec le lien',
    hint: 'À envoyer SEULEMENT après leur réponse : la conversation est acceptée, le lien passe.',
    build: (f, _n, link, kit) =>
      `Super ${f || ''} ! Voilà tout 👇
• Le kit (scripts + visuels) : ${kit}
• Ton lien perso de suivi : ${link}

30% à vie sur chaque vente, paiement automatique, aucune avance à faire.
Dis-moi si tu veux que je t'aide à publier ton premier post ✨`,
  },
  {
    key: 'r3',
    label: '🔁 Relance J+3 — sans réponse',
    hint: 'Beaucoup de messages tombent dans « Demandes ». Cette relance douce les récupère.',
    build: (f) =>
      `Je remonte mon message au cas où il serait passé dans tes demandes 🙂
${f || ''} toujours partant pour en parler ? Ça prend 2 min et ça peut vraiment te rapporter.`,
  },
];

const AmbassadorScripts: React.FC<Props> = ({ shareLink, kitUrl }) => {
  const [firstName, setFirstName] = useState('');
  const [niche, setNiche] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const link = shareLink || `${kitUrl}?ref=TONCODE`;

  const scripts = useMemo(
    () => SCRIPTS.map((s) => ({ ...s, body: s.build(firstName, niche, link, kitUrl) })),
    [firstName, niche, link, kitUrl],
  );

  const copy = async (value: string, k: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(k);
    toast.success('Copié !');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white border border-[#232F3E]/10 rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
          <MessageCircle className="w-6 h-6 text-[#008296]" /> Scripts DM en 2 temps
        </h2>
        <p className="text-sm text-[#232F3E]/65 mt-1">
          La règle d'or : <strong>pas de lien dans le 1er message</strong>. Tu demandes une
          réaction (« LIVRE » / « OUI »), puis tu envoies le lien une fois qu'ils répondent.
          C'est ce qui sort tes messages des « demandes » et déclenche les réponses.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Prénom de la personne</label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="ex : Sarah" />
        </div>
        <div>
          <label className="text-xs text-[#232F3E]/60 mb-1 block">Sa niche / thème</label>
          <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="ex : développement perso" />
        </div>
      </div>

      <div className="space-y-3">
        {scripts.map((s) => (
          <div key={s.key} className="bg-[#FAFAFA] border border-[#232F3E]/10 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <h3 className="font-bold text-[#008296]">{s.label}</h3>
                <p className="text-xs text-[#232F3E]/55">{s.hint}</p>
              </div>
              <button
                onClick={() => copy(s.body, s.key)}
                className="shrink-0 text-[#008296] hover:text-[#FF9E2D] flex items-center gap-1 text-sm"
              >
                {copied === s.key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copier
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-[#232F3E]/80 font-sans mt-2">{s.body}</pre>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#232F3E]/50 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#FF9E2D]" />
        Astuce : envoie max 15-20 DM/jour par compte pour éviter les blocages Instagram.
      </p>
    </div>
  );
};

export default AmbassadorScripts;
