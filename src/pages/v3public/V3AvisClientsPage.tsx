import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, ShieldCheck, Mail, QrCode, Users, CalendarClock, Copy, Check, PlayCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { readBookBrief } from '@/lib/v3/bookBrief';

/**
 * Avis clients Amazon — la marche à suivre, étape par étape, avec la vidéo
 * de méthode en tête de page. Page informative + générateurs de textes prêts
 * à copier (aucun appel IA, aucun crédit consommé).
 */

const VIDEO_ID = '1fvJbcmhM2I';

const VIDEO_POINTS = [
  'Une invitation à l’avis honnête en fin de livre, jamais au début.',
  'Vos premiers lecteurs viennent de votre liste email, pas d’Amazon.',
  'Un seul email le jour de la sortie, une seule relance 10 à 14 jours après.',
  'Le lien doit mener directement au formulaire d’avis, pas à la page produit.',
  'Aucun avis acheté, échangé ou offert : c’est la suspension du compte KDP.',
];


const RULES = [
  'Jamais d’avis en échange d’argent, d’un cadeau, d’un service ou d’un exemplaire gratuit conditionné : c’est interdit par Amazon et le livre peut être retiré.',
  'Jamais d’avis écrit par vous, votre famille ou une personne partageant votre adresse ou votre foyer.',
  'Jamais d’achat d’avis, ni d’échange entre auteurs (« je note ton livre, tu notes le mien »).',
  'Vous pouvez inviter à laisser un avis honnête, sans en exiger la note ni le contenu : c’est la seule voie autorisée.',
  'Un lecteur doit avoir dépensé au moins 50 € sur Amazon pour pouvoir publier un avis sur la plupart des boutiques.',
];

const STEPS: Array<{ title: string; icon: any; body: string[] }> = [
  {
    title: '1. Préparer le livre avant publication',
    icon: ShieldCheck,
    body: [
      'Ajoutez une page finale « Un mot de l’auteur » : remerciez le lecteur, puis invitez-le à laisser un avis honnête en une phrase.',
      'Placez cette invitation juste après le mot de fin, jamais au début : le lecteur doit d’abord avoir terminé le livre.',
      'Ajoutez le lien court de la page produit, et pour le broché un QR code qui mène directement à la fiche Amazon.',
      'Sur Kindle, activez la page « Avant de partir » d’Amazon : elle propose la notation automatiquement à la dernière page.',
    ],
  },
  {
    title: '2. Obtenir les 10 premiers avis',
    icon: Users,
    body: [
      'Prévenez votre liste d’emails 3 jours avant la sortie : les personnes qui vous suivent déjà sont vos premiers lecteurs.',
      'Le jour de la sortie, envoyez un email unique avec le lien du livre et l’invitation à un avis honnête après lecture.',
      'Publiez le lien sur vos réseaux avec un extrait du livre, pas seulement la couverture.',
      'Inscrivez le livre dans un groupe de lecteurs de votre thème (jamais un groupe d’échange d’avis entre auteurs).',
      'Objectif réaliste : 10 avis en 30 jours. Au-delà de 15 avis, la fiche devient nettement plus convaincante.',
    ],
  },
  {
    title: '3. Relancer sans harceler',
    icon: CalendarClock,
    body: [
      'Une seule relance, 10 à 14 jours après la sortie, adressée à ceux qui n’ont pas encore répondu.',
      'Rappelez la valeur reçue avant de demander : le lecteur doit sentir un remerciement, pas une facture.',
      'Donnez le lien direct vers le formulaire d’avis, pas seulement vers la page produit : chaque clic perdu coûte un avis.',
      'Arrêtez la séquence après la deuxième relance, quelle que soit la réponse.',
    ],
  },
  {
    title: '4. Faire durer les avis',
    icon: Star,
    body: [
      'Chaque nouveau livre ramène des lecteurs sur les précédents : la série est le meilleur générateur d’avis.',
      'Répondez publiquement aux avis critiques avec calme : les futurs acheteurs lisent aussi vos réponses.',
      'Signalez à Amazon les seuls avis qui violent les règles (insultes, spam, avis sans lien avec le livre).',
      'Surveillez la moyenne : au-dessous de 4,0 étoiles, retravaillez le livre plutôt que de chercher plus d’avis.',
    ],
  },
];

function buildEmails(bookTitle: string, authorName: string, link: string) {
  const t = bookTitle.trim() || 'mon livre';
  const a = authorName.trim() || 'votre auteur';
  const l = link.trim() || '[lien Amazon du livre]';
  return [
    {
      label: 'Email 1 — Annonce (3 jours avant)',
      subject: `${t} sort dans 3 jours`,
      body: `Bonjour,\n\nJe voulais vous prévenir avant tout le monde : « ${t} » sort dans trois jours.\n\nVous faites partie des personnes qui suivent mon travail depuis le début, alors vous serez les premiers à pouvoir le lire.\n\nJe vous envoie le lien dès l’ouverture.\n\nÀ très vite,\n${a}`,
    },
    {
      label: 'Email 2 — Jour de la sortie',
      subject: `« ${t} » est en ligne`,
      body: `Bonjour,\n\n« ${t} » est disponible dès maintenant sur Amazon :\n${l}\n\nSi le livre vous apporte quelque chose, un avis honnête sur la page du livre m’aiderait énormément : ce sont les avis des lecteurs qui décident si un livre est vu ou ignoré.\n\nMerci de votre lecture,\n${a}`,
    },
    {
      label: 'Email 3 — Relance douce (10 à 14 jours après)',
      subject: 'Une minute pour un avis ?',
      body: `Bonjour,\n\nJ’espère que « ${t} » vous a plu.\n\nSi vous l’avez terminé, prendriez-vous une minute pour laisser un avis honnête ? Quelques lignes suffisent, et votre avis sincère compte plus qu’une note parfaite.\n\nC’est ici :\n${l}\n\nMerci beaucoup,\n${a}`,
    },
  ];
}

export default function V3AvisClientsPage() {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const emails = useMemo(() => buildEmails(bookTitle, authorName, link), [bookTitle, authorName, link]);

  const backPage = useMemo(() => {
    const t = bookTitle.trim() || '[Titre du livre]';
    const a = authorName.trim() || '[Votre nom]';
    const l = link.trim() || '[lien Amazon du livre]';
    return `UN MOT DE L’AUTEUR\n\nVous venez de terminer « ${t} », et cela compte beaucoup pour moi.\n\nCe livre a été écrit pour vous être utile. Si c’est le cas, un avis honnête sur sa page Amazon aidera d’autres lecteurs à le découvrir — et m’aidera à écrire le suivant.\n\nQuelques lignes suffisent :\n${l}\n\nMerci pour votre lecture,\n${a}`;
  }, [bookTitle, authorName, link]);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      toast.success('Texte copié.');
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error('Copie impossible — sélectionnez le texte à la main.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="rounded-2xl border p-6" style={{ borderColor: 'var(--v3-line)', background: '#fbfbfa' }}>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" style={{ color: 'var(--v3-gold, #c9a227)' }} />
          <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--v3-emerald)' }}>
            Avis clients Amazon
          </p>
        </div>
        <h1 className="mt-2 text-2xl md:text-[28px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          Obtenir des avis clients : la marche à suivre
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          Les avis décident de la visibilité d’un livre sur Amazon. Voici la seule méthode conforme aux règles : préparer
          le livre, inviter vos lecteurs, relancer une fois, puis laisser la série travailler pour vous.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border p-6" style={{ borderColor: '#f0c98a', background: '#fdf7ec' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: '#92400e' }}>
          Les règles Amazon, à lire avant tout
        </h2>
        <ul className="mt-3 space-y-2">
          {RULES.map((r) => (
            <li key={r} className="text-[13px] leading-relaxed" style={{ color: '#92400e' }}>• {r}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {STEPS.map((s) => (
          <article key={s.title} className="rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: '#fff' }}>
            <div className="flex items-center gap-2">
              <s.icon className="w-4 h-4" style={{ color: 'var(--v3-emerald)' }} />
              <h2 className="text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{s.title}</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {s.body.map((b) => (
                <li key={b} className="text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>• {b}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border p-6" style={{ borderColor: 'var(--v3-line)', background: '#fff' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          Vos textes prêts à copier
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          Renseignez les trois champs : la page de fin et la séquence de 3 emails se personnalisent automatiquement.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Titre du livre"
            className="rounded-xl border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--v3-line)' }} />
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Votre nom d’auteur"
            className="rounded-xl border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--v3-line)' }} />
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien Amazon du livre"
            className="rounded-xl border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--v3-line)' }} />
        </div>

        <div className="mt-5 rounded-xl border p-4" style={{ borderColor: 'var(--v3-line)', background: '#fbfbfa' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" style={{ color: 'var(--v3-emerald)' }} />
              <h3 className="text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                Page de fin du livre
              </h3>
            </div>
            <button onClick={() => void copy('back', backPage)} className="v3-btn-outline inline-flex items-center gap-2 text-[12.5px]">
              {copied === 'back' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copier
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{backPage}</pre>
        </div>

        <div className="mt-4 space-y-4">
          {emails.map((e) => (
            <div key={e.label} className="rounded-xl border p-4" style={{ borderColor: 'var(--v3-line)', background: '#fbfbfa' }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: 'var(--v3-emerald)' }} />
                  <h3 className="text-[13.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{e.label}</h3>
                </div>
                <button
                  onClick={() => void copy(e.label, `Objet : ${e.subject}\n\n${e.body}`)}
                  className="v3-btn-outline inline-flex items-center gap-2 text-[12.5px]"
                >
                  {copied === e.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copier
                </button>
              </div>
              <p className="mt-2 text-[13px] font-medium" style={{ color: 'var(--v3-ink)' }}>Objet : {e.subject}</p>
              <pre className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{e.body}</pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
