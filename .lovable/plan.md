# Page 2 de l'onglet KDP — « ebookstudio_lancement » (Plan de lancement 30 jours)

Deuxième page de l'espace KDP, dans la même veine que la Fiche Audit : on décrit son livre (ou on colle simplement un ASIN pour préremplir), et on obtient un plan de lancement structuré sur les 30 premiers jours. Mise en page maison (ivoire, encre, émeraude, or), rédaction et logique propres — aucune reprise d'un outil existant.

## Page — `/v3/kdp/lancement`

1. **Deux façons de démarrer, en haut de page**
   - « J'ai un ASIN » : champ ASIN + marché (fr, com, co.uk, de, es, it) → le formulaire se remplit tout seul (titre, sous-titre, auteur, catégories, prix, note, avis) à partir des données réelles du livre.
   - « Je décris mon livre » : formulaire vide à remplir à la main.
   Dans les deux cas, tous les champs restent modifiables avant génération.

2. **Formulaire du livre**
   - Titre (obligatoire), sous-titre, type de livre (liste : roman, non-fiction / guide pratique, jeunesse, BD, cahier / carnet, autre), sujet principal / genre (obligatoire), résumé du livre (500 caractères max, compteur), date de sortie prévue, prix, format (Kindle, broché, relié), audience visée, lien de vente si déjà publié.
   - Aide courte sous chaque champ, jamais de valeur inventée : si l'ASIN ne donne pas une donnée, la case reste vide avec la mention « non disponible ».

3. **Bouton « Créer mon plan de lancement »**
   - Barre d'état indiquant l'étape (lecture de la fiche Amazon, puis rédaction du plan).

4. **Le plan affiché, en 4 semaines**
   - Semaine 1 « Préparer » (J1–J7), Semaine 2 « Faire parler » (J8–J14), Semaine 3 « Vendre » (J15–J21), Semaine 4 « Installer la durée » (J22–J30).
   - Chaque jour : une action concrète, le canal (email, réseau social, Amazon, avis lecteurs, communauté), le temps estimé, et un texte prêt à publier ou à envoyer quand c'est pertinent.
   - Case à cocher par jour pour suivre son avancement, plus un compteur « X / 30 jours faits ».
   - Bloc « Objectifs à surveiller » : avis à obtenir, classement visé, mots-clés à suivre — exprimés comme repères, pas comme promesses.

5. **Tout est modifiable** : chaque action et chaque texte peut être corrigé dans la page, bouton Copier par jour, par semaine, et « Tout copier ».

6. **Export** : bouton « Tout exporter » qui télécharge un fichier texte en local (aucun envoi serveur).

7. **Historique local** des 5 derniers plans créés, rechargeables en un clic. Les cases cochées sont conservées dans le navigateur.

## Comportement

- Textes 100 % en français courant : aucun latin, mot inventé ni anglicisme décoratif.
- ASIN introuvable ou mauvais marché : message clair, possibilité de continuer à la main.
- Boutons à fort contraste (émeraude/papier/encre) et lisibles, comme sur la Fiche Audit.
- Bouton de retour visible en haut de page.

## Accès

La page suit exactement les règles actuelles de la V3 (mode contemplation avant le 1er octobre, verrous et tarifs inchangés).

## Détails techniques

- Nouvelle entrée dans `src/data/kdpTabPages.ts` (label « Plan de lancement — vos 30 premiers jours », badge « Nouveau ») ; la page apparaît alors automatiquement dans le hub KDP. Lien ajouté dans la section KDP du menu d'en-tête (`src/data/v3HeaderMenu.ts`) et route paresseuse dans `src/App.tsx`.
- Nouveau fichier `src/pages/v3public/kdp/V3KdpLancementPage.tsx` + petits composants de semaine/jour, et `src/data/kdpLaunchPlan.ts` pour les libellés de semaines, canaux et types de livre.
- Préremplissage ASIN : réutilise `fetchAmazonBook` (via `kdp-asin-scraper`, mode `asin`) sans le modifier.
- Rédaction du plan : même voie que la Fiche Audit — clé IA de l'abonné (BYOK Gemini / OpenRouter) via `callAIWriting`, avec `isAIConfigured()` et lien correct vers la page des clés si aucune clé valide. Une seule réponse JSON attendue : `{ semaines: [{ titre, jours: [{ jour, action, canal, duree, texte }] }], objectifs: [] }`, avec repli lisible si la réponse est mal formée.
- Suivi et historique : `localStorage` uniquement, aucune table, aucune fonction serveur nouvelle.
- Intouchés : base de données, sécurité, paiements, crédits, calculs KDP, Fiche Audit, Cover Studio, V4.

## Vérification

Créer un plan à partir d'un ASIN réel d'amazon.fr, contrôler que les champs préremplis correspondent à la fiche Amazon, que les 30 jours sont bien présents et numérotés, que les cases cochées survivent à un rechargement, que chaque bouton Copier fonctionne, que l'export texte contient les 4 semaines, et que tous les libellés de boutons sont lisibles.
