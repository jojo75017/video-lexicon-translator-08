## Constats

1. **Contradiction sur le nombre de mots** : dans `V3Workflow30.tsx` le champ « Nombre de mots par chapitre » accepte jusqu'à 6000 mots (`Entre 300 et 6000`), et l'edge function `v3-autopilot-step` clampe le mode `core` sur la valeur du brief (jusqu'à 6000). Donc un client 197€ peut déjà écrire des chapitres de 6000 mots → l'argument « ~3500 (197€) vs ~5000 (347€) » est faux et non défendable.
2. **Le client ne voit pas la valeur** : l'encart actuel (`WritingEngineBadge`) est trop discret et pas assez "vendeur/informatif". Il ne montre pas noir sur blanc la comparaison 197€ vs 347€.

## Objectif
Rendre la différence **vraie** (plafonds réellement distincts) ET **visible/pédagogique** (comparatif clair côte à côte que le client comprend d'un coup d'œil).

## Correctifs

### 1. Plafonds réellement différenciés
- **Frontend `V3Workflow30.tsx`** : le champ mots/chapitre est plafonné selon le palier.
  - 197€ (core) : max **3500** mots. Si l'utilisateur saisit plus, on ramène à 3500 et un petit texte indique « Jusqu'à 3500 mots avec l'offre 197€ — passez au Pack Pro pour aller jusqu'à 6000 ».
  - 347€ (Pro) : jusqu'à **6000** mots.
  - Le texte d'aide sous le champ s'adapte au palier.
- **Edge `v3-autopilot-step/index.ts`** : clamp serveur cohérent — `core` plafonné à 3500 mots/chapitre, `pro` jusqu'à 6000 (et cible ~5000 par défaut en Pro). Empêche tout contournement côté client.

### 2. Comparatif clair et vendeur (remplace/enrichit `WritingEngineBadge.tsx`)
Transformer l'encart en **tableau comparatif à deux colonnes** « Essentiel 197€ » vs « Pack Pro 347€ », lisible et informatif, avec pour chaque ligne un ✓/✗ ou une valeur :

| Critère | Essentiel 197€ | Pack Pro 347€ |
|---|---|---|
| Longueur des chapitres | jusqu'à 3500 mots | jusqu'à ~5000-6000 mots |
| Passe éditoriale automatique (densification, fluidité) | ✗ | ✓ |
| Boucle qualité renforcée (score cible + tentatives) | standard | renforcée |
| Variantes A/B (titres, descriptions, emails, annonces) | ✗ | ✓ |
| Nombre d'agents du parcours | 22 (idée → publié) | 30 (+ lancement & ventes) |
| Choix du modèle IA (Claude, Gemini, ChatGPT, DeepSeek, Mistral) | ✓ | ✓ |

- Mise en avant visuelle de la colonne Pro (bordure/teal #008296), et pour un client 197€ un bouton clair « Passer au Pack Pro 347€ » qui ouvre le checkout existant (`setCheckoutOpen(true)`).
- Pour un client déjà Pro : bandeau « Moteur Pro activé » + rappel des gains obtenus.
- Le composant reçoit `isPro` (déjà le cas) + un callback `onUpgrade` pour ouvrir le checkout.

### 3. Placement plus visible
- Afficher le comparatif **en haut du parcours** (au-dessus ou juste sous le sélecteur de parcours), pas noyé en bas, pour que le client le voie immédiatement.
- Conserver le petit repère « Moteur Pro » sur l'étape d'écriture.

## Points techniques
- Le palier Pro n'affecte QUE longueur/qualité/passe éditoriale/variantes ; le choix du modèle IA reste libre partout.
- Aucun changement de schéma, RLS ou droits. `useV3Entitlement` reste la source des droits (admin = tout).
- Redéploiement de `v3-autopilot-step` + vérification TypeScript après modification.
</content>
<summary>Plafonner réellement le 197€ à 3500 mots (vs 6000 en Pro) et remplacer l'encart par un comparatif 197€/347€ clair et vendeur, placé en haut du parcours.</summary>
</invoke>
