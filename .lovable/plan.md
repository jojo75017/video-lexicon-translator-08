# Plan — Les 3 encarts d'offres, enrichis, avec la V2 conservée

## Ce qui change en une phrase
Les trois encarts (Déjà abonné, Plume 27 €, Édition 47 €) affichent nettement plus de fonctionnalités, l'ancien abonné n'est jamais lésé, et la V2 reste accessible dans les trois offres jusqu'à sa fermeture le 31 décembre 2026.

## 1. Encart « Déjà abonné » (aucun nouvel achat)
Message : « Vous ne perdez rien, vous gagnez la V3 essentielle. »
- Votre V2 reste à vie, jusqu'à la fermeture du 31 décembre 2026.
- 40 chapitres · 5 000 mots par chapitre (même confort d'écriture que Plume).
- Génie + sommaire IA, travail à partir de votre propre sommaire.
- Rédaction chapitre par chapitre, correcteur du livre.
- Exports PDF, DOCX, EPUB.
- Discussion libre avec l'IA (votre propre clé).
- Kit de démarrage, recherche d'idées, recherche avancée.
- Couverture simple (qualité V2) + bibliothèque de vos couvertures.
- 2 livres par mois.
Différence honnête affichée : pas de couverture Kindle/broché prête pour KDP, pas d'audiolivre, pas de traductions, pas de studios pro — disponibles en passant à Plume ou Édition.

## 2. Encart « Plume — 27 €/mois ou 270 €/an »
Ajouter la V2 et rendre la valeur plus visible :
- **Accès V2 inclus jusqu'au 31 décembre 2026** (vous avez les deux).
- 50 livres par mois · 40 chapitres · 5 000 mots · 8 personnages.
- Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre.
- Création guidée ou sommaire existant, rédaction chapitre par chapitre.
- 10 langues incluses.
- Import de manuscrit (DOCX, PDF, URL) et correction professionnelle.
- Mise en page + exports PDF / DOCX / EPUB / Kindle.
- Couverture standard Kindle et broché KDP.
- Audiolivre standard inclus.
- Mockups et visuels de présentation du livre.
- Calendrier de publication et fiche produit KDP (titre, description, mots-clés).
- Support email 24 h.
Bloc « Idéal pour » : auteurs qui publient régulièrement sans avoir besoin des studios professionnels.

## 3. Encart « Édition — 47 €/mois ou 470 €/an »
Renforcer les compléments inclus pour justifier l'écart :
- **Accès V2 inclus jusqu'au 31 décembre 2026.**
- Livres illimités · 60 chapitres · 8 000 mots · personnages illimités.
- Tout Plume, en version professionnelle.
- Mode Recherche approfondie et séries multi-tomes (Bible d'univers + mémoire).
- Cover Studio Pro : Kindle, broché et couverture rigide, 300 DPI, gabarits KDP.
- BD Studio Pro + Studio Jeunesse (coloriages, activités, histoires par âge).
- Amazon Spy, audit ASIN, mots-clés avancés, niches.
- Pack KDP prêt à publier (ZIP) + checklist.
- Inclus : Pack Traductions relues 10 langues.
- Inclus : Audiolivre Premium (voix premium, chapitrage, master).
- Inclus : Sélection de maisons d'édition + lettre d'accompagnement.
- Inclus : BookPerfect AI — direction éditoriale approfondie.
- Inclus : Pack Sérénité (audit + support prioritaire).
- Priorité sur les nouveautés V4 dès leur sortie.
Restent à la carte : conversion audio d'un livre à l'unité et accompagnement individuel sur mesure.

## Fermeture de la V2 — 31 décembre 2026
- Une seule phrase claire dans les trois encarts : « Accès V2 conservé jusqu'au 31 décembre 2026, en attendant la V4. »
- Ajouter cette date dans la page Calendrier, à côté de l'ouverture V3 du 1er octobre.
- Aucun accès V2 n'est coupé maintenant : c'est une date annoncée, pas un verrou immédiat.

## Aucun prix modifié
27 €, 270 €, 47 €, 470 € restent affichés seuls. Aucune remise visible, aucun prix barré, aucun changement de paiement Stripe ou PayPal.

## Détails techniques
- Source unique : `src/data/v3Pricing.ts` (features Plume/Édition, mention V2, date de fermeture exportée comme constante) et `src/data/v2LegacyAccess.ts` (droits ancien abonné, déjà à 40 chapitres / 5 000 mots).
- Encarts : `src/components/v3public/V3PricingOverview.tsx` (3 cartes de l'accueil) et `src/pages/v3public/V3ForfaitsPage.tsx` (cartes détaillées + tableau comparatif, ligne « Accès V2 » ajoutée).
- Calendrier : `src/data/v3LaunchCalendar.ts` — ajout de la date de fermeture V2.
- Non touchés : verrous d'accès (`V3LockedGate`), `useV3Entitlement`, edge functions de paiement, webhooks, calculs KDP, crédits IA, base de données, sécurité.

## Vérifications
- Les trois encarts sur ordinateur et téléphone, sans chevauchement.
- Aucun prix remisé visible nulle part.
- Contrôle TypeScript et tests existants.
