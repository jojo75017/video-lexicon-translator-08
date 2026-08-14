# Correction « maison d'édition » + onglet Avis clients

Deux chantiers : rendre la correction du livre vraiment professionnelle, et ajouter un onglet dédié « Avis clients » avec la marche à suivre pas à pas.

## 1. Correction professionnelle du livre (`/v3/corriger`)

Aujourd'hui la correction fait une passe unique par bloc (orthographe, grammaire, ponctuation, latin, fin de chapitre). Résultat : propre en surface, mais pas au niveau d'une maison d'édition.

Nouveau parcours en 4 passes successives sur chaque chapitre, dans cet ordre :

```text
Passe 1  Correction          orthographe, grammaire, accords, conjugaison, ponctuation
Passe 2  Typographie FR      espaces insécables, guillemets « », tirets cadratins de dialogue,
                             apostrophes typographiques, majuscules, chiffres et nombres
Passe 3  Édition             répétitions, lourdeurs, adverbes inutiles, passif, temps narratifs,
                             transitions entre paragraphes, latin / mots inventés
Passe 4  Contrôle final      relecture de vérification : fin de chapitre terminée par une phrase
                             complète avec point, aucun mot orphelin, aucun artefact JSON/markdown,
                             cohérence des noms propres du livre
```

Points clés :
- **Cohérence sur tout le livre** : avant la première passe, un relevé est constitué (noms de personnages, lieux, orthographes retenues, temps narratif dominant, niveau de langue). Ce relevé est transmis à chaque chapitre pour éviter qu'un même nom soit écrit de deux façons différentes d'un chapitre à l'autre.
- **Typographie française appliquée localement** (sans IA, donc sans coût) : guillemets français, espaces insécables avant `: ; ! ?`, tirets cadratins de dialogue, apostrophes courbes, points de suspension, ligatures.
- **Fin de chapitre garantie** : la passe 4 refuse un chapitre qui se termine par un mot isolé, une virgule ou une phrase sans point, et complète la clôture.
- **Rapport d'éditeur** en fin de correction : nombre de corrections par catégorie et par chapitre, chapitres à revoir, incohérences de noms détectées, score de propreté du manuscrit.
- **Rien n'écrase l'original** sans validation : avant / après par chapitre, acceptation globale ou chapitre par chapitre (comportement actuel conservé).
- **Aucun crédit gaspillé** : les passes utilisent la clé de l'abonné (BYOK) comme aujourd'hui, avec arrêt net si la clé est absente, et pas de repli automatique.
- **Reprise** : chaque passe est reprenable, un échec sur un chapitre ne perd pas le travail déjà validé.

## 2. Nouvel onglet « Avis clients » (barre latérale)

Nouvelle page `/v3/avis` ajoutée dans la barre latérale (section Fonctionnalités), badge « Nouveau ».

Contenu — la marche à suivre, en étapes claires :

1. **Ce qu'Amazon autorise vraiment** : demande honnête permise, avis achetés / échangés / incités interdits, pas de sollicitation via la messagerie Amazon. Règles rappelées en clair.
2. **Préparer le livre** : page de remerciement en fin de livre avec l'invitation à laisser un avis, lien court vers la fiche produit, QR code pour la version papier.
3. **Les 5 premiers avis** : lecteurs bêta, entourage lecteur réel, groupes de lecture, service Amazon Vine si éligible, liste email personnelle.
4. **La séquence d'emails** : 4 emails prêts à l'emploi (remerciement J+2, prise de nouvelles J+7, demande d'avis J+10, relance douce J+15), générés pour le livre de l'abonné et copiables ou exportables.
5. **Suivi** : tableau simple pour noter les avis obtenus par livre et relancer.
6. **Ce qu'il ne faut jamais faire** : liste des pratiques qui font suspendre un compte KDP.

Le générateur de séquence réutilise le module d'emails d'avis déjà en place côté admin, remis en page pour l'abonné, avec bouton copier et lien vers les intégrations email (Brevo / Systeme.io) déjà configurées dans le hub.

## Détails techniques

- `src/lib/correcteur/proofreadBook.ts` : passage à un pipeline de passes (`correction` → `typographie` → `edition` → `controle`), avec un contexte livre (`bookContext`) construit avant la boucle et injecté dans chaque appel.
- `supabase/functions/strict-proofread/index.ts` : ajout des modes `typo`, `edition`, `final-check`, chacun avec son jeu de règles ; les modes existants (`strict`, `polish`, `latin-fix`, `ending-fix`) restent en place.
- Nouveau `src/utils/frenchTypography.ts` (extension) pour la passe typographique locale et `src/lib/correcteur/bookContext.ts` pour le relevé de cohérence.
- `src/pages/v3public/V3CorrecteurPage.tsx` : progression par passe, rapport d'éditeur, chapitres à revoir.
- Nouvelle page `src/pages/v3public/V3AvisClientsPage.tsx`, route `/v3/avis` dans `src/App.tsx`, entrée dans `V3Sidebar.tsx` et dans `v3ToolPlans.ts` (inclus dans Plume et Édition).
- Génération des emails via `callAIWriting` (clé de l'abonné), aucun contenu simulé.

## Hors périmètre

Pas de collecte d'avis automatisée ni de scraping des avis Amazon : l'onglet est un guide opérationnel plus un générateur de séquence.
