/**
 * OPÉRATION FONDATEUR — 15 jours ou 15 places à 47 €.
 *
 * Tout dernier contingent d'accès à vie avant le passage définitif aux
 * abonnements V3 (Plume 27 €/mois, Édition 47 €/mois, Maison 97 €/mois).
 *
 * Deux conditions de clôture, la première atteinte ferme l'offre :
 *  - la date limite (15 jours) ;
 *  - le quota de 15 places payées.
 *
 * Les options restent payantes à part pour tout le monde :
 * Cover Studio Pro 67 € et Studio Jeunesse 47 €.
 */

/** Début de l'opération : seules les commandes payées après cette date comptent. */
export const FONDATEUR_START_ISO = "2026-09-30T00:00:00Z";

/** Fin de l'opération : 15 octobre 2026, 23 h 59 (heure de Paris). */
export const FONDATEUR_END_ISO = "2026-10-15T21:59:59Z";
export const FONDATEUR_END_LABEL = "15 octobre 2026";
export const FONDATEUR_END_SHORT = "15 octobre";

/** Nombre total de places de l'opération. */
export const FONDATEUR_SEATS = 15;

/** Prix unique de l'accès à vie pendant l'opération. */
export const FONDATEUR_PRICE = 47;

/** Formule d'accès utilisée par le paiement (inchangée). */
export const FONDATEUR_PLAN = "v2_1x" as const;

export interface FondateurStatus {
  /** Places déjà réglées depuis le début de l'opération. */
  sold: number;
  /** Places encore disponibles (jamais négatif). */
  remaining: number;
  /** Quota total. */
  seats: number;
  /** L'offre est-elle fermée (quota atteint ou date dépassée) ? */
  closed: boolean;
  /** Raison de la fermeture, si fermée. */
  reason: "open" | "sold_out" | "expired";
}

/** Statut de repli quand le serveur ne répond pas : l'offre reste ouverte. */
export const FONDATEUR_FALLBACK: FondateurStatus = {
  sold: 0,
  remaining: FONDATEUR_SEATS,
  seats: FONDATEUR_SEATS,
  closed: false,
  reason: "open",
};

/** Phrase de rareté affichée sur la page, adaptée au nombre de places restantes. */
export function fondateurScarcityLabel(status: FondateurStatus): string {
  if (status.reason === "sold_out") {
    return `Les ${FONDATEUR_SEATS} places à ${FONDATEUR_PRICE} € sont toutes prises — l'accès à vie est fermé.`;
  }
  if (status.reason === "expired") {
    return `L'opération des ${FONDATEUR_SEATS} derniers accès à vie est terminée.`;
  }
  if (status.remaining === 1) {
    return `Dernière place disponible sur les ${FONDATEUR_SEATS} accès à vie à ${FONDATEUR_PRICE} €.`;
  }
  return `Plus que ${status.remaining} places sur les ${FONDATEUR_SEATS} derniers accès à vie à ${FONDATEUR_PRICE} €.`;
}
