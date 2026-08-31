# Audit complet V3 avant lancement + repérage des nouveautés

Objectif : passer la V3 au crible aujourd'hui pour que vos tests ne tombent pas
sur des bugs, puis rendre les nouveautés visibles et l'orientation évidente pour
les abonnés.

## 1. Audit automatisé des routes et des liens

- Extraire la liste réelle des routes `/v3/*` déclarées dans `src/App.tsx`
  (63 pages V3 recensées) et la comparer à **tous** les liens présents dans
  le menu d'en-tête, la barre latérale, les cartes d'accueil, les upsells et
  les boutons d'action après génération.
- Sortie : un tableau « lien → route existante ? → page qui s'affiche »,
  avec la liste des liens morts (404 ou redirection vers `/v3`).
- Test navigateur automatisé : ouverture successive de chaque route V3 en
  session admin, capture des erreurs console et des pages vides.
- Correction des liens cassés et des routes manquantes trouvées.

## 2. Audit des accès (le point le plus sensible)

- Vérifier pour chaque route V3 le comportement dans 4 situations :
  visiteur non connecté, essai gratuit, abonné Plume, abonné Édition, admin.
- Contrôler qu'aucun gate ne redirige sur un statut « inconnu »
  (cause des éjections vers la page de vente).
- Vérifier que le verrou de lancement (`V3_LAUNCH_UNLOCKED = false`) laisse
  bien passer l'admin partout et n'enferme pas un acheteur payant.

## 3. Audit fonctionnel des modules

Test réel, un par un, des chaînes qui consomment l'IA ou l'export :
Sommaire IA / Génie, Studio Pro, rédaction chapitre, correction,
traduction, humaniseur, couverture (Kindle + broché), ContentStudio,
audiolivre, exports DOCX/EPUB/PDF/ZIP KDP.

Pour chacun : succès, message d'erreur clair si clé manquante ou crédits
épuisés (jamais « Edge Function returned a non-2xx »), et journalisation.

## 4. Audit paiements

- Un seul tarif à vie 47 € en paiement unique, Stripe carte + PayPal.
- Les 18 upsells : chaque bouton mène au bon produit au bon prix.
- Vérifier qu'aucun ancien palier (9,99 / 29 / 59 / 197 / 347 / 547) ne
  subsiste dans les pages ni dans les données de prix.

## 5. Marquage des nouveautés

- Une source unique de vérité pour les nouveautés (liste datée), au lieu des
  badges « Nouveau » saisis à la main un peu partout : un badge apparaît et
  disparaît automatiquement après 30 jours.
- Badge visible aux 3 endroits : menu d'en-tête, barre latérale, tuiles
  d'accueil — même style, même libellé.
- Une page **« Quoi de neuf »** listant les nouveautés par date avec le
  bouton qui ouvre directement l'outil concerné.
- Un point rouge sur l'entrée « Quoi de neuf » tant que l'abonné n'a pas
  ouvert la page, puis il disparaît.

## 6. Orientation des abonnés

- Bandeau d'accueil V3 « Par où commencer » en 3 chemins : *je pars d'une
  idée*, *j'ai déjà un manuscrit*, *je veux vendre plus*.
- Barre latérale : regroupement clair Plan / Écrire / Habiller / Publier /
  Vendre, avec l'outil recommandé mis en avant dans chaque groupe.
- Après génération d'un livre, la barre d'actions doit toujours proposer :
  Sauvegarder, Corriger, Voir mon livre, Données KDP, Exporter.

## Livrable

Un rapport d'audit dans le chat : ce qui fonctionne, ce qui est cassé, ce qui
a été corrigé — et la liste des points qui demandent votre décision (tarif,
libellé, ordre des onglets).

## Détails techniques

- Script d'audit exécuté en local (Playwright + parcours des routes déclarées)
  pour produire la matrice route × rôle ; aucune donnée de production modifiée.
- Nouveau fichier de données `v3Nouveautes.ts` (clé, libellé, route, date) ;
  les badges des menus lisent cette source au lieu de valeurs figées.
- Page « Quoi de neuf » sous `/v3/nouveautes`, ajoutée au menu et à la barre
  latérale ; état « vu » conservé côté navigateur.
- Vérification des gates : `V3Gate`, `V3LockedGate`, `TrialGate`,
  `V3PublicLayout` — règle commune « statut inconnu = on patiente ».
- Contrôle des fonctions serveur V3 : clé abonné (Gemini / OpenRouter) prise
  en compte partout, repli serveur, et message d'erreur lisible.
