# Audit supervisé V3 — schéma complet et corrections

Audit réalisé sur le code réel, la base de données et la page V3 chargée en direct. Voici l'état exact et ce qui reste à corriger.

## 1. Ce qui est vérifié bon (aucune action)

- **Routes** : `/`, `/dashboard` (→ V2 `/ebook-planner`), `/espace`, `/tableau-de-bord`, `/v3` et les 40+ sous-routes `/v3/*` sont toutes déclarées, aucun doublon, aucun composant manquant.
- **Liens de navigation** : sidebar V3, menu principal (Plan / Écrire / Habiller / Publier / Vendre / Livres spéciaux / Forfaits) et les 12 tuiles Fonctionnalités — 100 % des cibles existent. Zéro lien mort.
- **Ordre de la page /v3** : Hero → Moteurs IA → Encart de démarrage → Migration V2 → Clé Gemini → KDP Pilot (compact) → Formulaire de création → Récap → Capacités → Marché / Avant-Après / Audience / Garantie / Licence → Blog → Outils → Auteur → CTA final.
- **Base de données** : RLS activé sur les 49 tables publiques, droits `authenticated` présents partout, linter Supabase sans erreur.
- **Compilation** : zéro erreur TypeScript.
- **Page /v3 chargée en direct** : zéro erreur console, titre SEO correct.

## 2. Schéma des problèmes restants

```text
+---------------------------------------------------------------+
| A. VERSION PUBLIEE OBSOLETE          [BLOQUANT POUR TON TEST]  |
|   Les erreurs enregistrees (homeHero, KdpPilotPromoBanner,     |
|   chunks introuvables sur ebookstudio.fr) ne sont PLUS dans    |
|   le code actuel -> c'est l'ancien build en ligne qui casse.   |
|   => Republier + purger le cache au 1er chargement.            |
+---------------------------------------------------------------+
| B. "Mon abonnement" = cul-de-sac          [GENE UTILISATEUR]   |
|   Sidebar -> /subscription -> redirige vers l'ecran de         |
|   connexion, meme deja connecte.                               |
|   => Pointer vers /v3/compte (ou /v3/forfaits si non abonne).  |
+---------------------------------------------------------------+
| C. Droits manquants sur les commandes    [DONNEES INVISIBLES]  |
|   v3_installment_orders et v3_gift_cards : politiques admin    |
|   uniquement -> un client ne voit jamais sa propre commande    |
|   (0 ligne, sans erreur).                                      |
|   => Ajouter une lecture "je vois mes propres commandes".      |
+---------------------------------------------------------------+
| D. Politiques incoherentes                     [PROPRETE]      |
|   v3_workflow_projects / workflow_results ciblent le role      |
|   'public' au lieu de 'authenticated' (protegees quand meme).  |
|   => Aligner sur la convention du reste du schema.             |
+---------------------------------------------------------------+
| E. Fonctions declarees mais absentes         [DEPLOIEMENT]     |
|   config.toml declare process-promo-nurture,                   |
|   send-juanito-payment-check, send-offre-47-serie : les        |
|   dossiers n'existent plus -> risque d'echec de deploiement.   |
|   => Nettoyer ces 3 entrees.                                   |
+---------------------------------------------------------------+
| F. Config absente pour 13 fonctions V3        [FIABILITE]      |
|   complete-book-workflow, strict-proofread, book-chapter-write,|
|   book-memory-extract, book-bible-generate, book-positioning,  |
|   agent-illustrator, agent-kids-*, agent-universe-volumes,     |
|   agent-ams-keywords, agent-category-finder,                   |
|   agent-competitor-spy : aucune entree explicite.              |
|   => Declarer verify_jwt pour chacune (auth previsible).       |
+---------------------------------------------------------------+
| G. Non verifiable ici                            [A SUIVRE]    |
|   Les logs serveur des fonctions ne sont pas accessibles dans  |
|   l'audit -> les erreurs de generation (P1..P15) ne peuvent    |
|   etre confirmees qu'en lancant un vrai livre de bout en bout. |
+---------------------------------------------------------------+
```

## 3. Ce que je corrige (ordre d'exécution)

1. **A — Fraîcheur de la version** : purge unique du cache navigateur + désinscription du service worker au premier chargement après connexion, puis republication.
2. **B — Sidebar** : « Mon abonnement » pointe vers la page compte réelle.
3. **C + D — Migration base** : politique de lecture « mes propres commandes / cartes cadeaux » pour les abonnés, et alignement des politiques `v3_workflow_projects` / `workflow_results` sur `authenticated`.
4. **E + F — Configuration des fonctions** : suppression des 3 entrées orphelines, ajout des entrées explicites pour les 13 fonctions V3.
5. **G — Test de bout en bout** : lancement réel d'un livre court (3 chapitres) via le workflow, puis correction stricte et export, pour vérifier la chaîne complète et relever les erreurs serveur réelles.

## 4. Détails techniques

- Cache : `caches.keys()` + `navigator.serviceWorker.getRegistrations()` nettoyés une seule fois, drapeau stocké dans `localStorage` pour éviter toute boucle.
- Migration SQL : `CREATE POLICY ... FOR SELECT TO authenticated USING (auth.uid() = user_id)` sur les deux tables commandes, `DROP`/`CREATE` pour requalifier les politiques `public` → `authenticated`. Grants déjà en place, rien à changer.
- `supabase/config.toml` : suppression des 3 blocs orphelins, ajout de `[functions.<nom>] verify_jwt = true` pour les fonctions appelées avec session, `false` pour celles appelées sans session.
- Aucun changement de tarif, de contenu marketing ou de mise en page dans ce lot.
