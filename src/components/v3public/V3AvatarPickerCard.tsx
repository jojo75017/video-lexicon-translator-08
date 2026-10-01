import { useMemo, useState } from 'react';
import { Check, Target, Users } from 'lucide-react';
import {
  NIVEAU_LABELS,
  V3_BOOK_AVATARS,
  findAvatarCategory,
  type BookAvatar,
} from '@/data/v3BookAvatars';

export type AvatarSelection = {
  avatarId?: string;
  cibleProfil?: string;
  cibleNiveau?: string;
  cibleBesoins?: string;
  cibleFrustrations?: string;
  avatarConsigne?: string;
};

type Props = {
  /** Catégorie choisie pour le livre : pré-sélectionne le bon univers. */
  category?: string;
  value: AvatarSelection;
  onChange: (patch: AvatarSelection) => void;
};

const NIVEAUX: Array<BookAvatar['niveau']> = ['debutant', 'intermediaire', 'avance', 'tous'];

const inputClass = 'w-full rounded-2xl border px-4 py-3 text-sm outline-none';
const inputStyle = {
  borderColor: 'var(--v3-border)',
  color: 'var(--v3-ink)',
  background: 'var(--v3-paper)',
} as const;

/**
 * Encart « Mon avatar lecteur » : l'auteur choisit en un clic le lecteur type de
 * son univers, ou décrit le sien. Le profil retenu est transmis aux agents
 * (sommaire, chapitres, relecture) via les champs Cible & Promesse de la fiche.
 */
export const PERSONAL_CATEGORIES = [
  'Récit de ma vie (livre familial)',
  'Arbre généalogique / Histoire de famille',
  'Souvenirs pour mes enfants et petits-enfants',
];

export default function V3AvatarPickerCard({ category, value, onChange, personal }: Props & { personal?: boolean }) {
  const suggested = useMemo(() => findAvatarCategory(category), [category]);
  const [groupId, setGroupId] = useState(() => suggested?.id || V3_BOOK_AVATARS[0].id);
  const [custom, setCustom] = useState(() => Boolean(value.cibleProfil && !value.avatarId));

  const group = V3_BOOK_AVATARS.find((g) => g.id === groupId) || V3_BOOK_AVATARS[0];
  // Choix affiché immédiatement, même si la fiche du livre met un instant à se
  // synchroniser : l'auteur doit voir tout de suite que son lecteur est pris en compte.
  const [pickedId, setPickedId] = useState<string | undefined>(value.avatarId);
  const activeId = pickedId || value.avatarId;
  const selectedAvatar = useMemo(
    () =>
      activeId
        ? V3_BOOK_AVATARS.flatMap((g) => g.avatars).find((a) => a.id === activeId)
        : undefined,
    [activeId],
  );

  const applyAvatar = (avatar: BookAvatar) => {
    setCustom(false);
    setPickedId(avatar.id);
    onChange({
      avatarId: avatar.id,
      cibleProfil: avatar.profil,
      cibleNiveau: avatar.niveau,
      cibleBesoins: avatar.besoins,
      cibleFrustrations: avatar.frustrations,
      avatarConsigne: avatar.consigne,
    });
  };

  if (personal || PERSONAL_CATEGORIES.includes(category || '')) {
    return (
      <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}>
        <p className="font-semibold">🔒 Livre personnel — aucun avatar lecteur</p>
        <p className="mt-1" style={{ color: 'var(--v3-muted)' }}>
          Ce récit est écrit pour vous et vos proches. Aucun profil commercial n'est appliqué : vos mots et vos souvenirs sont conservés tels quels.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[28px] border p-5"
      style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: 'var(--v3-paper)' }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="v3-chip v3-chip-orange">
          <Target className="h-3.5 w-3.5" /> Mon avatar lecteur
        </span>
        {activeId && (
          <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--v3-orange-600)' }}>
            <Check className="h-3.5 w-3.5" /> Profil appliqué
          </span>
        )}
      </div>
      <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
        Choisissez à qui s’adresse votre livre. Les agents adapteront le vocabulaire, le rythme et
        l’émotion de chaque chapitre à ce lecteur précis.
      </p>

      <div className="mt-4 space-y-2">
        <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Univers du livre</span>
        <select
          value={group.id}
          onChange={(event) => setGroupId(event.target.value)}
          className={inputClass}
          style={inputStyle}
        >
          {V3_BOOK_AVATARS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
              {suggested?.id === item.id ? ' — conseillé' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {group.avatars.map((avatar) => {
          const active = activeId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => applyAvatar(avatar)}
              className="rounded-2xl border p-4 text-left transition"
              style={{
                borderColor: active ? 'var(--v3-orange-600)' : 'var(--v3-border)',
                background: active ? 'var(--v3-orange-50)' : 'var(--v3-paper)',
              }}
            >
              <span className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
                <Users className="h-4 w-4" /> {avatar.name}
              </span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--v3-orange-600)' }}>
                {avatar.badge} · {NIVEAU_LABELS[avatar.niveau]}
              </span>
              <span className="mt-2 block text-xs" style={{ color: 'var(--v3-muted)' }}>{avatar.profil}</span>
              <span className="mt-2 block text-xs" style={{ color: 'var(--v3-muted)' }}>
                <strong style={{ color: 'var(--v3-ink)' }}>Attend :</strong> {avatar.besoins}
              </span>
            </button>
          );
        })}
      </div>

      {selectedAvatar && (
        <div
          className="mt-4 rounded-2xl border-2 p-4"
          style={{ borderColor: '#1a7f4b', background: 'rgba(26,127,75,0.08)' }}
        >
          <p className="flex items-center gap-2 text-sm font-extrabold" style={{ color: '#1a7f4b' }}>
            <Check className="h-4 w-4" /> Profil « {selectedAvatar.name} » activé pour votre livre
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-ink)' }}>
            Vos agents écriront désormais pour ce lecteur : {selectedAvatar.profil}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-ink)' }}>
            <strong>Ton retenu :</strong> {selectedAvatar.ton}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>
            <strong style={{ color: 'var(--v3-ink)' }}>À éviter :</strong> {selectedAvatar.frustrations}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => { setCustom((v) => !v); }}
        className="v3-btn v3-btn-ghost mt-3 text-xs"
      >
        {custom ? 'Masquer les détails' : 'Voir et modifier les détails de mon lecteur'}
      </button>


      {custom && (
        <div className="mt-3 space-y-3 rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)' }}>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={{ color: 'var(--v3-ink)' }}>À qui s’adresse ce livre ?</span>
            <textarea
              value={value.cibleProfil || ''}
              rows={2}
              onChange={(event) => onChange({ ...value, cibleProfil: event.target.value })}
              placeholder="Ex : femmes actives de 30 à 45 ans qui ont très peu de temps"
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={{ color: 'var(--v3-ink)' }}>Que vient-il chercher ?</span>
            <textarea
              value={value.cibleBesoins || ''}
              rows={2}
              onChange={(event) => onChange({ ...value, cibleBesoins: event.target.value })}
              placeholder="Ex : une méthode simple à appliquer en 15 minutes par jour"
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={{ color: 'var(--v3-ink)' }}>Qu’est-ce qui le fait abandonner un livre ?</span>
            <textarea
              value={value.cibleFrustrations || ''}
              rows={2}
              onChange={(event) => onChange({ ...value, cibleFrustrations: event.target.value })}
              placeholder="Ex : les longues théories, le jargon, les promesses sans mode d’emploi"
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={{ color: 'var(--v3-ink)' }}>Niveau de lecture</span>
            <select
              value={value.cibleNiveau || 'tous'}
              onChange={(event) => onChange({ ...value, cibleNiveau: event.target.value })}
              className={inputClass}
              style={inputStyle}
            >
              {NIVEAUX.map((n) => (
                <option key={n} value={n}>{NIVEAU_LABELS[n]}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold" style={{ color: 'var(--v3-ink)' }}>Consigne transmise aux agents</span>
            <textarea
              value={value.avatarConsigne || ''}
              rows={3}
              onChange={(event) => onChange({ ...value, avatarConsigne: event.target.value })}
              placeholder="Ex : ton complice, phrases courtes, un exercice concret par chapitre"
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </label>
        </div>
      )}
    </div>
  );
}
