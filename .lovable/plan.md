# Essai sommaire + livre : ce que vous pouvez tester, et le seul défaut détecté

## État actuel (vérifié à l'instant)

- Aucune erreur d'exécution dans l'aperçu (console propre).
- Tests automatiques : 31 sur 32 passent. Un seul échec, et il ne casse rien pour vous : le test du bouton flottant V2/V3 attend l'ancienne adresse `/hub-v3` alors que le bouton envoie désormais vers `/v3`. C'est le test qui est périmé, pas l'application.

## Votre parcours d'essai recommandé (dans l'ordre)

1. **Sommaire IA seul** — `/v3/sommaire-ultime` : genre + thème, 20 chapitres, générez, modifiez 2 titres à la main, puis « Envoyer vers le workflow ».
2. **Livre complet** — `/v3/create` : le sommaire envoyé doit se retrouver pré-rempli. Lancez la génération sur **5 chapitres** d'abord (test rapide, peu de crédits), puis un vrai livre de 20 à 25 chapitres.
3. **Boutons sous le livre généré** — vérifiez les 6 actions : Sauvegarder, Corriger, Voir mon livre, Données KDP, Traduire, Audio.
4. **Export** — depuis « Mes livres », export Word puis PDF : le sommaire doit contenir exactement le nombre de chapitres demandé, avec les vrais titres (pas « Chapitre 2, 3… ») et aucun chapitre vide.
5. **Correction professionnelle** — `/v3/corriger` sur le livre généré : contrôlez qu'aucune expression latine ne subsiste et que chaque chapitre finit par une phrase complète avec un point.
6. **Thème clair/sombre** et **onglet Compléments** (`/v3/upsells`) : simple vérification visuelle.

## Points à surveiller pendant l'essai (les zones historiquement fragiles)

- Clé Gemini renseignée dans Fonctionnalités > Clés API, sinon P1 échoue.
- Au-delà de 30 chapitres : un avertissement s'affiche, plafond à 40.
- Export : nombre d'entrées du sommaire = nombre de chapitres demandé.
- Titres de chapitres réels conservés en base après sauvegarde.

## Ce que je corrige (petit, sans risque)

- Mise à jour du test obsolète `src/components/admin/V2V3FloatingSwitch.test.tsx` : attendre `/v3` au lieu de `/hub-v3`, pour retrouver une suite 100 % verte et ne plus masquer une vraie régression.

Aucune autre modification tant que vous n'avez pas fait l'essai : envoyez-moi les captures ou messages d'erreur rencontrés et je corrige ciblé.
