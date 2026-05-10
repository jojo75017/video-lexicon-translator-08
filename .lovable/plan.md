## Renommer "Ebookie" → "EbookStudio" sur la page de vente

Tu as raison, deux noms = confusion. On uniformise sous **EbookStudio**.

### Où c'est affiché aujourd'hui

Sur `/offres`, dans le bloc copilote (`EbookieAssistant.tsx`) :
- Titre : "Rencontrez **Ebookie**"
- Sous-titre : "Bloqué sur une niche ? ... **Ebookie** répond"
- Bouton CTA : "Activer **Ebookie** — 67€ à vie"
- Avatar du chat : "**Ebookie**"
- Placeholder input : "Pose une question à **Ebookie**…"
- Étape Jour 1 (`JoyfulJourney.tsx`) : "Avec l'aide d'**Ebookie**, tu trouves une niche…"
- Bonus stack (`BonusStack.tsx`) : "Copilote **Ebookie** 24/7"

### Ce qu'on change

Remplacement texte uniquement, **aucune logique modifiée** :

| Avant | Après |
|---|---|
| "Rencontrez Ebookie" | "Rencontrez votre copilote EbookStudio" |
| "Ebookie répond" | "EbookStudio répond" |
| "Activer Ebookie — 67€ à vie" | "Activer EbookStudio — 67€ à vie" |
| Avatar chat "Ebookie" | "EbookStudio" |
| "Pose une question à Ebookie…" | "Pose ta question…" |
| "Avec l'aide d'Ebookie" | "Avec l'aide d'EbookStudio" |
| "Copilote Ebookie 24/7" | "Copilote EbookStudio 24/7" |

### Fichiers touchés

```
src/components/sales/EbookieAssistant.tsx   ← 5 occurrences textuelles
src/components/sales/joyful/JoyfulJourney.tsx ← 1 occurrence
src/components/sales/BonusStack.tsx          ← 1 occurrence
```

Le **nom de fichier** `EbookieAssistant.tsx` et la **fonction** `EbookieAssistant` restent inchangés (purement technique, pas vu par l'utilisateur). Pas de risque de casser les imports.

### Hors scope (à ne pas toucher)

- `EbookbotPage.tsx` ("Rencontre EBOOKBOT") → c'est un autre produit, page différente
- Toutes les occurrences "Rencontre" dans `bdTemplates.ts`, `ebookTemplates.ts` → c'est du contenu narratif d'ebooks, rien à voir
