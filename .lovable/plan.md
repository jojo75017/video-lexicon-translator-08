# Le Génie pose de vraies questions pendant le sommaire

## Ce qui se passe aujourd'hui

À l'étape ② « Mon sommaire », le Génie propose 3 chapitres à la fois et renvoie une seule
question de forme (« On garde ces chapitres ? »). Cette question n'est pas liée à ce que
l'auteur vient d'écrire, et il n'y a pas de vraie zone de réponse : juste un petit champ
« une précision pour les prochains chapitres (facultatif) ». Résultat : on a l'impression
que le Génie n'écoute pas le récit.

## Ce qu'on met en place

```text
② Mon sommaire
┌──────────────────────────────────────────────┐
│ 3 chapitres proposés (Garder / Reformuler /  │
│ Retirer)                                     │
├──────────────────────────────────────────────┤
│ Le Génie vous demande :                      │
│  1. « Vous parlez de la ferme de Saint-Léger │
│     en 1968 — c'était avant ou après le      │
│     départ de votre sœur ? »                 │
│  2. « Que devient Marie dans ce chapitre ? » │
│                                              │
│  [zone de réponse]                           │
│  [Répondre au Génie]  [Plus tard]            │
└──────────────────────────────────────────────┘
```

1. **Questions ancrées dans le texte.** Le Génie renvoie 1 à 2 questions maximum, et chacune
   doit citer littéralement un élément présent dans les passages de l'auteur (un prénom, un
   lieu, une date, une scène) ou un chapitre proposé. Interdiction des questions générales
   (« quel est votre public ? », « quel ton voulez-vous ? », « on garde ? ») quand un récit
   existe.
2. **On peut répondre.** Sous les questions, une zone de réponse et deux boutons :
   « Répondre au Génie » (la réponse est renvoyée avec la demande suivante et les chapitres
   déjà gardés, et les faits nouveaux — prénoms, dates, lieux — vont dans la mémoire des
   faits) et « Plus tard » (les questions se ferment, rien n'est perdu).
3. **Les réponses servent vraiment.** Chaque réponse est incluse dans la prochaine
   proposition de chapitres : les chapitres suivants doivent en tenir compte, sans jamais
   modifier ni renuméroter les chapitres déjà gardés.
4. **Questions visibles, jamais bloquantes.** Elles s'affichent au-dessus du champ de
   précision existant, en encart clair ; on peut valider le sommaire sans y répondre.

## Détails techniques

- `supabase/functions/v3-genie-brief/index.ts`, mode `outline-step` : remplacer le champ
  `question` (string) par `questions` (0 à 2 entrées), avec les mêmes règles d'ancrage que
  le mode brief (citer un élément réel des passages, interdiction des questions de cadrage
  marketing). On garde `question` en sortie pour compatibilité.
- `src/components/v3public/V3OutlineCoBuilder.tsx` : état `questions` + `answer`, encart de
  questions, boutons « Répondre au Génie » / « Plus tard ». La réponse est passée dans
  l'appel `propose(extra)` existant et ajoutée à `factMemory` via `writeBookBrief`.
- Aucun changement de base de données, de sécurité, de calculs KDP, de paiements, de tarifs
  ni de crédits. On réutilise l'appel `v3-genie-brief` déjà en place (pas d'appel IA
  supplémentaire : la réponse part avec la proposition suivante).
- Vérification : typecheck + un passage dans `/v3/create?sommaire=ia` pour voir les
  questions et la zone de réponse.
