# Sortir de l'impasse acquisition : un moteur de trafic, pas des emails

## Le diagnostic (chiffres réels, 30 derniers jours)

- **1 157 visiteurs, mais trompeurs** : la source #1 est « Direct » (677), le pays #1 est les États-Unis (496) puis la Chine (bots `m.baidu.com`). **La France, votre cible, ne représente que 132 visites sur 30 jours**, dont une part est encore du trafic direct/bot.
- **Le trafic s'est effondré** : pic à 108 visiteurs le 25 août, puis chute à 7–12 visiteurs/jour début septembre. Aucune source de trafic régulière n'existe.
- **31 prospects capturés depuis mai** (4 mois), **1 seule commande** (non payée), 21 comptes dont 2 ce mois-ci.
- Vos séquences email tournent mais nourrissent presque personne.

**Conclusion : le blocage n'est pas l'email ni le produit. C'est l'absence d'une source de trafic français régulière et ciblée.** On ne peut pas « emailer » pour créer des abonnés ; on ne peut pas non plus décoller avec 50 €/mois de pub. Le seul levier cohérent avec votre profil (discret, petit budget) est un **moteur de trafic gratuit, durable et sans apparaître** : Pinterest faceless + contenu SEO.

## La stratégie en une ligne

Remplacer « envoyer des emails à 31 personnes » par « faire arriver 30 visiteurs français ciblés chaque jour grâce à du contenu qui pointe vers vos aimants à prospects » — puis laisser les séquences existantes faire leur travail.

## Ce que je fais dans l'app (concret, sans nouvelle fonctionnalité lourde)

### 1. Moteur Pinterest faceless (priorité 1 — plus gros impact, gratuit)
Pinterest est la plateforme idéale pour les niches KDP/ebooks, fonctionne sans montrer son visage, et amène du trafic durable (un pin continue de ramener des clics pendant des mois).
- Étendre l'outil existant `PinterestAutoPins` (aujourd'hui : génère juste des idées de titres) en un **plan de contenu mensuel** : 20 à 30 pins par mois, répartis entre 4 angles (niches rentables, erreur à éviter, « avant/après », témoignage/BSR), chacun pointant vers un aimant à prospect (`/10-niches-offertes`, `/cadeau`) ou un article du blog.
- Rendre les liens de pins tracés (déjà possible via `utm` existants) pour mesurer les clics réels.
- Aucune publication automatique sur Pinterest : je prépare les pins (titre, description, hashtags, idée visuelle, lien de destination). **Vous les publiez vous-même** (Pinterest interdit l'auto-post et c'est vous qui restez maître du compte).

### 2. Contenu SEO ciblé français (priorité 2 — gratuit, durable)
Le blog existe déjà (`src/data/blogArticles.ts`, ~14 articles, page `/blog`). Je l'utilise tel quel et j'ajoute un lot d'articles répondant aux questions que tapent vos prospects (« comment publier sur Amazon KDP en France », « niche ebook rentable 2026 », « être payé KDP depuis l'étranger », etc.), chacun renvoyant vers un aimant à prospect. Objectif : capter des recherches Google durables plutôt que du trafic jetable.

### 3. Serrer la conversion du tunnel existant (priorité 3 — sans toucher aux prix/paiements)
31 prospects → 1 vente : la fuite est aussi dans la conversion.
- Réaligner les séquences email existantes sur **l'ouverture V3 du 1er octobre** avec une deadline claire, au lieu de rester génériques. (Les séquences sont déjà segmentées et fonctionnelles ; je ne crée pas de nouveau moteur.)
- Ajouter une **page « liste d'attente V3 »** simple qui capture l'email avec la promesse « soyez prévenu à l'ouverture + un bonus de lancement », branchée sur `funnel_leads` existant.

## Ce que vous faites de votre côté (indispensable — je ne peux pas le faire à votre place)

- Créer un compte Pinterest (ou utiliser l'existant) et **publier les pins que je prépare** (1 à 2 par jour). C'est 5 minutes/jour.
- Partager occasionnellement un article du blog sur vos réseaux.
- Plus tard seulement, quand le trafic organique sera installé : réinjecter le budget sur un petit test Meta (50 €/mois), pas avant.

## Ce que je ne touche pas

Aucune modification des tarifs, du tunnel de paiement, du schéma de base, de la sécurité, des calculs KDP, ni des modules produits existants. Phase de stabilisation respectée : on utilise l'infra marketing déjà en place, on ne crée pas de nouveau moteur technique.

## Premier livrable dès approbation

Le plan Pinterest faceless du mois 1 (30 pins prêts à publier : titre, description, hashtags, idée visuelle, lien de destination pointant vers vos aimants à prospects), puis le premier lot d'articles SEO. Conversion et page d'attente juste après.
