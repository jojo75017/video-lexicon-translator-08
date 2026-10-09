# Nouvelles offres pour les nouveaux clients (à partir du 16 octobre)

## Mon avis
Votre raisonnement tient la route. 47 € à vie ne rembourse pas 2 500 € d'investissement. Pour rentrer dans vos frais, il faut environ **26 ventes à 97 €** ou **11 ventes à 247 €** sur l'année. C'est atteignable avec votre liste actuelle (plus de 1 200 contacts). Ces prix restent aussi sous Publisher Rocket (199 $) et Designrr (297 à 497 $ par an).

Les anciens clients gardent tout ce qu'ils ont (accès à 47 €, V2, abonnements, achats). Rien ne change pour eux.

## Les deux offres

### Offre 1 — « EbookStudio Auteur » : 97 € par an
- Paiement en 1 fois (97 €) ou en 3 fois (3 × 32,33 €).
- Renouvellement automatique chaque année, résiliable à tout moment.
- Modules inclus :
  - Les quatre parcours : Écrire un livre, Je raconte un livre, Je raconte ma vie, J'ai déjà mon sommaire
  - Rédaction chapitre par chapitre avec les robots
  - Correction éditoriale et HumanizeAI
  - Exports PDF, DOCX et EPUB, mise en page Kindle et broché
  - Studio de couverture V4 standard : illustration IA, cinq modèles, PDF KDP 300 DPI
  - Outils KDP de base : mots-clés, description, catégories
  - Rédaction en 10 langues
  - 10 livres par mois, 40 chapitres maximum (30 conseillés)
- Options payantes en plus : Cover Studio Pro 67 €, Studio Jeunesse 47 €, Version audio 9,99 €, Micro-Séries 67 €.

### Offre 2 — « EbookStudio Édition à vie » : 247 €
- Paiement en 1 fois, en 3 fois (3 × 82,33 €) ou en 6 fois (6 × 41,17 €).
- Aucun renouvellement : accès à vie.
- Modules inclus :
  - Tout le contenu de l'offre Auteur
  - Pack Édition Pro inclus : Cover Studio Pro, BD Studio Pro, recherche approfondie, Amazon Spy et outils KDP avancés
  - 20 livres par mois, 60 chapitres maximum
  - Mises à jour de la V3 incluses
- Restent payants : Studio Jeunesse, Version audio, Micro-Séries V4 (précommande), services avec accompagnement personnel.

### Après l'achat (OTO)
- Après l'offre Auteur à 97 € : proposition de passer à l'offre à vie avec 50 € de réduction (197 €). Si refus, Cover Studio Pro à 67 €.
- Après l'offre à vie à 247 € : Studio Jeunesse à 47 € (une seule proposition).
- Le Pack Édition Pro à 97 € ne sera plus proposé aux nouveaux clients, puisqu'il est inclus dans l'offre à vie. Les anciens clients pourront toujours l'acheter.

## Ce qui change dans le site
- Page des offres, accueil visiteur, tunnel `/commander` : deux cartes, 97 € par an et 247 € à vie, avec la liste des modules ci-dessus et un choix 1×/3×/6×.
- Les mentions « 47 € à vie » disparaissent pour les nouveaux clients. Elles restent visibles dans « Mon compte » pour les clients qui l'ont acheté.
- L'offre fondateur à 47 € ferme définitivement le 15 octobre à 23 h 59, comme prévu.
- Un nouveau brief pour Landaa, avec les deux prix et les mêmes couleurs, remplace le brief précédent à 47 €.
- Les droits ne sont accordés qu'après la confirmation réelle de chaque paiement. En cas d'échéance impayée, l'accès est suspendu, puis réactivé une fois la situation régularisée (mécanisme déjà existant).

## À valider avant de construire
1. Quotas de l'offre à vie : 20 livres par mois et 60 chapitres, ou les mêmes quotas que l'offre Auteur ?
2. Faut-il afficher une remise de 20 % aux anciens clients V2 qui veulent passer à l'offre à vie à 247 € ?
3. Le Boost à 17 € reste-t-il sur le bon de commande ?

## Détails techniques
- Nouveaux prix de paiement avec des identifiants stables : `v3_auteur_yearly` (97 €/an, récurrent), `v3_auteur_yearly_3x` (échéancier sur 3 mois puis renouvellement annuel), `v3_edition_lifetime_247` (1×), `v3_edition_lifetime_247_3x` et `v3_edition_lifetime_247_6x` (abonnements à durée limitée).
- `V3_LIFETIME_OFFERS` est remplacé côté affichage par `V3_NEW_OFFERS` dans `src/data/v3Pricing.ts`. `V3_PLANS` et l'offre 47 € restent en données historiques.
- Liste des modules ajoutée à `v3ModuleAccess.ts` pour les nouveaux droits `v3_auteur` et `v3_edition_lifetime_247`. Le droit `edition_pro` s'applique automatiquement à l'offre à vie.
- Fonctions de paiement : liste blanche des nouveaux prix, attribution des droits par le webhook, échéancier réutilisant la logique d'échelonnement existante.
- Tests sur les prix (97, 247, montants des échéances) et les quotas dans `v3Pricing.test.ts`.
- Aucun email ni aucune publication sans votre autorisation.
