# Page de vente « système » façon bonus.kdptools.fr — adaptée EbookStudio 47 €

## Le modèle qui convertit (analyse de leurs 2 pages)

Leur page à 4,99 € vend parce qu'elle fait tout l'inverse d'une page marketing classique :

- **Un seul bouton orange**, répété 3 fois maximum (haut, bloc prix, fin) — toujours le même.
- **Ton honnête** : « ce que ce guide te promet — et ne promet pas ». Ça désarme le scepticisme.
- **Une histoire personnelle** avec avatar (crédibilité : « j'ai publié, certains livres ont vendu, d'autres non »).
- **Le contenu listé concrètement** (14 chapitres numérotés en grille).
- **Deux profils de lecteurs** (« pas encore de livre » / « publié mais peu de ventes ») pour que chacun se reconnaisse.
- Fond bleu nuit + accent doré/orange, aucun lien concurrent, aucune distraction.

## Ce qu'on construit : refonte complète de `/methode`

La page `/methode` existe déjà (thème crème). Elle est reconstruite **dans le style exact du modèle** (bleu nuit + doré), avec le vrai contenu EbookStudio et le prix 47 €. C'est cette page qu'on enverra aux vrais clients.

### Structure de la page (dans l'ordre)

1. **Hero** : badge « EbookStudio V3 — Publication assistée 2026 », titre avec mots en surbrillance dorée (« Votre livre publié sur Amazon — le système complet pour écrire, habiller et vendre »), sous-titre honnête, **bouton unique « Obtenir l'accès — 47 € »**, ligne de réassurance (paiement unique · garantie 30 jours · accès immédiat), mockup couverture à droite.
2. **Histoire personnelle** : Georges, photo/avatar, « j'ai vu des auteurs publier… et ne rien vendre. Le problème n'est pas le talent, c'est l'absence de système ».
3. **Pourquoi la plupart des auteurs KDP n'y arrivent pas** : 2-3 paragraphes + encadré chiffre (44 % des auteurs gagnent moins de 100 €/mois — problème de méthode, pas de talent).
4. **Ce que contient l'atelier** : grille numérotée en 2 colonnes (les étapes réelles : sommaire guidé, rédaction chapitre par chapitre, correction 4 passes, couverture dos calculé, fiche KDP complète, audio, traductions 10 langues, données KDP…).
5. **Deux façons d'utiliser EbookStudio** : « Pas encore de livre publié » / « Déjà publié, peu de ventes » — deux cartes avec la marche à suivre pour chacun.
6. **Ce qu'EbookStudio vous promet — et ne promet pas** : honnêteté frontale (pas de « 1 000 €/mois garantis » ; un livre propre, publiable, en jours au lieu de mois).
7. **Bloc prix** : 47 € (59 € barré), checklist des livrables, **même bouton**, garantie 30 jours.
8. **FAQ** : reprise de la FAQ existante de /commander (PayPal, 2x/3x, clés API, droits, remboursement).
9. **Conclusion** : « Vous n'avez plus besoin de chercher. Vous avez besoin d'un système. » + **même bouton**.

### Règles strictes

- **Un seul appel à l'action** : « Obtenir l'accès — 47 € » → `/commander`. Répété 3 fois, jamais autre chose.
- **Aucun autre lien** dans la page (pas de cadeau, pas d'audio, pas d'essai). Footer réduit aux mentions légales.
- **Pas de popup, pas de sticky bar** sur cette page : ajout de `/methode` aux exclusions marketing centralisées.
- Pas de verrou email (ReadingGate) : le modèle qui vend lit librement — le bouton encaisse.

### Suivi

- Événements `view` et `click` enregistrés (surface `methode`) pour mesurer enfin : visiteurs → clics bouton → commandes, dans le panneau admin.
- Migration toute petite pour autoriser la surface `methode` dans les stats.

## Après validation

- Envoi d'un email test de la séquence pointant vers la nouvelle page pour vérification, puis publication.

## Détails techniques

- `src/pages/launch/MethodePage.tsx` : réécriture complète (nouveau thème nuit/doré, sections ci-dessus).
- `src/components/launch/methode/` : les sous-composants existants (Probleme, AvantApres, Valeur, Faq) adaptés ou remplacés.
- `src/lib/marketingExclusions.ts` : ajout de `/methode`.
- `src/lib/captureTracking.ts` + migration SQL : surface `methode` autorisée dans `capture_events`.
- Boutons → `/commander?src=methode` (checkout Stripe existant, inchangé).
