# Honnêtement : ce qui est fait, ce qui reste

## Déjà fait (vérifié dans le code)
- Les 9 emails des 3 séquences (réactivation A1-A3, cadeau B1-B4, vente C1-C2) sont en place dans la fonction d'envoi.
- Le panneau admin de campagne affiche les segments et les colonnes cadeau/ventes.
- La page `/commander` a le compte à rebours, le bloc cadeau « 10 niches » et le suivi `checkout_click` / `checkout_ready`.

## Pas encore fait (honnêtement)
1. **Aucun email n'a encore été envoyé** avec les nouvelles séquences. Le quota est de 100 par jour : il faut lancer segment par segment et suivre les résultats.
2. **La barre latérale V3 n'a pas été nettoyée.** Elle contient plus de 40 liens à plat, avec des doublons : « Ma bibliothèque », « Mes livres », « Brouillons » mènent au même besoin, et la page « Livres corrigés » existe mais n'est accessible par aucun lien.
3. **La page de vente n'a aucune preuve au-dessus du prix.** Aucun témoignage fabriqué ne sera ajouté ; on affichera des preuves réelles et vérifiables (nombre de livres générés, garantie, accès immédiat, contact direct).
4. **L'onglet Assistant V3** n'est pas protégé par le même verrou que les autres pages V3.

## Corrections prévues

### 1. Barre latérale lisible
- Regrouper en sections repliables : Démarrer, Créer, Recherche KDP, Habiller, Mes livres, Vendre, Apprendre, Mon compte.
- Ouvrir seulement la section correspondant à la page courante.
- Fusionner « Ma bibliothèque » + « Mes livres » + « Brouillons » en une seule entrée « Mes livres », et ajouter le lien manquant « Livres corrigés » à côté.

### 2. Preuve réelle sur `/commander`
- Juste au-dessus du prix : une bande de faits vérifiables (nombre réel de livres/projets générés, accès à vie, paiement sécurisé, réponse personnelle par email).
- Aucun avis client inventé.

### 3. Verrou cohérent
- Passer `/v3/assistant` par le même verrou que les autres routes V3.

### 4. Lancement réel des séquences
- Jour 1 : segment B (ouvreurs sans clic) — le cadeau d'abord.
- Jour 2 : segment A (jamais ouverts) — objet alternatif.
- Jour 3 : segment C (cliqueurs chauds) — vente directe.
- Après chaque envoi, relever ouvertures, clics, cadeaux réclamés et commandes dans le panneau admin.

## Détails techniques
- `src/components/v3public/V3Sidebar.tsx` : sections repliables, dédoublonnage, ajout de `/v3/livres-corriges`.
- `src/pages/v3public/V3CommanderPage.tsx` : bande de preuves réelles au-dessus du bloc prix (données issues du backend, pas de valeurs inventées).
- `src/App.tsx` : envelopper la route `assistant` V3 dans le même garde que les routes voisines.
- Envois via la fonction existante ; pas de nouvelle fonction, pas de nouvelle table.
