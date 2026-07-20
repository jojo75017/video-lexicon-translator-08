# 🎬 Script vidéo — Ebookstudio V3 « Publication Assistée Pro »
### Formation complète de A à Z : clés API, nouvel environnement, modules, plans & tarifs

> Vidéo face caméra, ton chaleureux et pédagogique, persona Georges Boubet.
> Durée cible : 25 à 35 minutes (formation).
> Prompteur prêt à lire — les indications techniques sont en italique.

---

## 1. Accroche & promesse (0:00 – 1:30)

Bonjour à tous, c'est Georges.

Aujourd'hui, je ne vais pas vous vendre quelque chose. Je vais vous **former**.

À la fin de cette vidéo, vous saurez exactement :
- comment configurer vos **clés API** en 3 minutes (c'est ce qui coince 90 % des gens),
- comment **naviguer dans le nouvel environnement Ebookstudio V3**,
- à quoi sert **chacun des modules** de la plateforme,
- et surtout **quel plan choisir** en fonction de votre projet — sans vous ruiner.

On va aller de A à Z, tranquillement, et vous pourrez repasser la vidéo aux moments qui vous concernent. Installez-vous, prenez de quoi noter.

---

## 2. Ce qui change avec la V3 (1:30 – 4:00)

Ebookstudio V3 s'appelle **Publication Assistée Pro**. Ce n'est plus un simple générateur de texte. C'est un **studio éditorial complet** qui vous accompagne de l'idée jusqu'à la publication Amazon KDP.

Concrètement, trois choses ont changé :

**1. Un moteur à 30 agents IA spécialisés.**
Avant, une seule IA écrivait votre livre. Maintenant, 30 agents interviennent chacun sur leur métier : architecte du livre, chercheur de niche, plumes narratives, éditeur, correcteur, directeur artistique de couverture, spécialiste SEO Amazon, expert catégorisation KDP, générateur d'audio, community manager… Chacun fait UNE chose, et il la fait bien.

**2. Un environnement public unifié.**
Tout se passe sur **ebookstudio.fr/v3**. Vous n'avez plus à jongler entre un dashboard admin et un site public. La bibliothèque, la création, les outils, les guides, les offres — tout est au même endroit, avec une barre latérale claire.

**3. Le principe « Bring Your Own Key » (BYOK).**
Vous branchez **vos propres clés API IA** (Gemini gratuit ou OpenRouter). Vous ne payez donc **pas** un abonnement gonflé qui absorbe une marge sur les jetons IA. Vous payez la plateforme, l'IA vous appartient. C'est plus honnête et beaucoup moins cher sur le long terme.

---

## 3. Étape 1 — Créer vos clés API (4:00 – 9:00)

*[À l'écran : capture de https://aistudio.google.com/apikey]*

C'est l'étape que tout le monde redoute. Elle prend 3 minutes. Suivez-moi.

### 3.1 Clé Gemini (Google) — recommandée, gratuite

Gemini, c'est l'IA de Google. Elle est puissante, rapide, et **gratuite** dans une limite très large qui suffit pour écrire plusieurs livres par mois.

1. Ouvrez **aistudio.google.com/apikey** dans votre navigateur.
2. Connectez-vous avec un compte Google (le vôtre suffit).
3. Cliquez sur **« Create API key »**.
4. Copiez la clé — elle commence par **`AIza…`**.
5. Retour sur Ebookstudio → **Paramètres → Clés API → Gemini**. Collez, enregistrez. C'est fait.

*[À l'écran : Ebookstudio → /v3/parametres]*

### 3.2 Clé OpenRouter — pour les modèles avancés (optionnelle)

OpenRouter, c'est un « supermarché » qui vous donne accès à Claude, GPT-4, DeepSeek, Mistral et Gemini via **une seule clé**. Utile quand vous voulez un style d'écriture particulier.

1. Ouvrez **openrouter.ai/keys**.
2. Créez un compte, générez une clé — elle commence par **`sk-or-…`**.
3. Rechargez 5 ou 10 dollars la première fois (c'est du pay-as-you-go).
4. Ebookstudio → **Paramètres → Clés API → OpenRouter**. Collez, enregistrez.

### 3.3 Clé OpenAI — pour les couvertures haut de gamme (optionnelle)

Si vous voulez générer des couvertures avec le nouveau modèle **gpt-image-2** (le meilleur du marché), il vous faut une clé OpenAI (`sk-…`) sur **platform.openai.com/api-keys**. Sinon, Ebookstudio bascule automatiquement sur son moteur d'images inclus.

### 3.4 Règle d'or

Ces clés sont **à vous**. Elles restent dans **votre** navigateur, jamais partagées avec d'autres utilisateurs. Si vous les perdez, vous en régénérez. Simple.

---

## 4. Étape 2 — Le nouvel environnement V3 (9:00 – 13:00)

*[À l'écran : ebookstudio.fr/v3]*

Ouvrez **ebookstudio.fr/v3**. Vous arrivez sur la nouvelle page d'accueil. Regardez le haut : deux zones.

### 4.1 Le header
- **Ma bibliothèque** — tous vos livres sauvegardés.
- **Nouveau livre** — le wizard de création en 4 étapes.
- **Ambiances** & **Couverture** — outils visuels.
- **Se connecter** — un compte suffit pour tout retrouver.

### 4.2 La barre latérale (Sidebar)
14 catégories de **Livres spéciaux** : Roman, Cuisine, Voyage, Coloriage, BD, Poésie, Développement personnel, Business, Enfants, Fantasy, Thriller, Biographie, Guide pratique, Manuel scolaire. Chaque catégorie déclenche un workflow adapté (nombre de chapitres, ton, structure, style d'image).

### 4.3 Le Hub V3 — /v3/hub
C'est votre **tableau de bord de professionnel**. Onglets principaux :
- **Parcours** — les 30 agents à la chaîne.
- **Outils V3** — les 27 outils spécialisés hérités de la V2, réorganisés.
- **Documentation Studio** — l'atelier de packaging (fiches, guides, dossiers de presse).
- **Guides** — la formation textuelle.
- **Script vidéo** — vous y êtes.
- **Offres & Tarifs** — souscription et upsells.

### 4.4 La bibliothèque — /v3/ln
Chaque livre est une carte avec :
- couverture (générée à la demande),
- statut (Brouillon, En cours, Terminé),
- boutons **Audio 9,99 €**, **Supprimer**, et un mode **Nettoyer les doublons**.

---

## 5. Étape 3 — Créer son premier livre (13:00 – 18:00)

*[À l'écran : /v3/create]*

Le wizard compte 4 étapes claires :

**Étape 1 — Le concept.** Titre + description de 150 mots (l'IA vous aide à formuler si vous manquez d'idées).

**Étape 2 — Le format.** Nombre de chapitres (jusqu'à 60), mots par chapitre (par défaut 3500, jusqu'à 6000 sur le plan Pro), catégorie KDP, ton (chaleureux, académique, thriller, humoristique…), personnages optionnels.

**Étape 3 — Le sommaire.** L'IA propose une **table des matières éditable**. Vous modifiez chaque titre et chaque objectif. C'est ce qui garantit un livre cohérent — plus jamais de « chapitre 3 » vide.

**Étape 4 — Génération.** Vous appuyez sur **« Générer le livre »**. Les 30 agents entrent en scène. Vous suivez la progression, chapitre par chapitre. Tout est **sauvegardé automatiquement dans le cloud**.

À la fin, vous pouvez :
- éditer chapitre par chapitre,
- générer la couverture (front + tranche + 4ᵉ),
- exporter en DOCX, PDF, EPUB, KDP-ready,
- lancer la conversion audio (option 9,99 €).

---

## 6. Étape 4 — Les modules détaillés (18:00 – 23:00)

Petit tour du propriétaire, module par module.

### 6.1 Modules éditoriaux (inclus dans tous les plans)
- **Architecte du livre** — structure et sommaire.
- **Plume narrative multi-styles** — écriture des chapitres.
- **Éditeur & correcteur IA** — passes de révision.
- **Cover Studio** — couverture front + dos + tranche calibrée KDP.
- **Ambiances** — banque d'images narratives.
- **Import manuscrit** — DOCX / MD / TXT avec découpage automatique.
- **Export KDP** — fichiers prêts pour Amazon (dimensions, marges, ISBN).

### 6.2 Modules Growth (plan Expert & Auteur)
- **Amazon Spy Niche** — analyse concurrentielle réelle via Firecrawl : ventes estimées, mots-clés, catégories rentables.
- **KDP Keywords & Categories** — SEO Amazon optimisé.
- **Sélection éditeurs** — moteur de recherche des maisons d'édition susceptibles de vous publier (inspiré de publiersonlivre.fr, base élargie).
- **Landing page auteur** — page publique de votre profil (`/v3/auteur/...`).
- **Documentation Studio** — dossiers de presse, kits médias, argumentaires.

### 6.3 Modules Premium (plan Auteur)
- **Livre audio complet** — narration IA (voix multiples, chapitres audio prêts pour ACX/Audible ou WooCommerce).
- **Cover Studio Pro** — direction artistique IA + variations, moteur **gpt-image-2**.
- **BD & Coloriage** — 14 workflows spéciaux (Roman jeunesse, Coloriage adulte, BD…).
- **Multilingue** — traduction et adaptation FR ↔ EN ↔ ES.
- **Assistant conversationnel** — un copilote posé sur votre livre pour re-générer, résumer, corriger à la voix.

---

## 7. Étape 5 — Plans et tarifs (23:00 – 28:00)

Ebookstudio V3 lance le **1er octobre 2026** avec 3 abonnements mensuels. Voici la vérité, sans marketing.

### 7.1 Plan Débutant — **6,99 €/mois**
- **5 livres par mois** générés (jusqu'à 20 chapitres).
- Éditeur, correcteur, export DOCX/PDF/EPUB.
- 1 couverture par livre (moteur standard).
- Support communauté.

*Pour qui ?* Vous testez. Vous écrivez un livre de temps en temps. Vous voulez comprendre le workflow avant d'investir.

### 7.2 Plan Expert — **9,99 €/mois** ⭐ *le plus populaire*
- **10 livres par mois**, jusqu'à 40 chapitres, 6000 mots/chapitre.
- **30 agents** activés au complet.
- Amazon Spy Niche + KDP Keywords.
- Cover Studio + Ambiances illimitées.
- Sélection éditeurs.
- Import manuscrit + retouche par chapitre.
- Support prioritaire.

*Pour qui ?* Vous publiez régulièrement sur Amazon KDP. Vous voulez de la constance, du SEO, et un vrai atelier éditorial.

### 7.3 Plan Auteur — **59 €/mois**
- **Livres illimités** jusqu'à 60 chapitres.
- Tout ce qui précède + **Cover Studio Pro (gpt-image-2)**.
- **Livre audio inclus** (2 par mois offerts, ensuite 9,99 € l'unité).
- Documentation Studio (dossiers de presse, kits médias).
- Multilingue FR/EN/ES.
- Landing page auteur personnalisée.
- **🎁 Licence commerciale étendue OFFERTE** (revente illimitée sur Amazon KDP, Kobo, Apple Books — normalement 29 €).
- Onboarding 1-à-1 (30 min).

*Pour qui ?* Vous vivez ou voulez vivre de vos livres. Vous produisez en volume, en plusieurs langues, avec un vrai catalogue.

### 7.4 Ce qui n'est PAS dans les abonnements
- Le **livre audio à l'unité** — 9,99 € par livre (pour Débutant et Expert).
- Les **crédits IA** — vous utilisez **vos** clés API. Zéro marge cachée.
- La **couverture premium à la demande** avec gpt-image-2 — comprise dans le plan Auteur, sinon payée au coût OpenAI direct via votre clé.
- La **Licence commerciale étendue** — **OFFERTE** avec le plan Auteur, sinon **29 € une fois pour toutes** (paiement unique, à vie) pour les plans Débutant et Expert. Obligatoire dès que vous vendez vos livres.

### 7.5 Offres de lancement (jusqu'au 31 octobre 2026)
- **-20 %** sur les 3 premiers mois de tout abonnement annuel.
- **Pack Auteur annuel** : 12 mois payés 10 → 2 mois offerts.

---

## 8. Récap et passage à l'action (28:00 – 32:00)

On récapitule ce qu'on a vu ensemble.

1. **Créez vos clés** — Gemini (gratuit) minimum, OpenRouter et OpenAI si vous voulez plus.
2. **Explorez /v3** — la nouvelle maison Ebookstudio, tout est réuni.
3. **Testez le wizard /v3/create** — un premier livre en 4 étapes.
4. **Choisissez votre plan** — commencez à 6,99 € pour tester, montez en gamme quand vous êtes prêt.
5. **Publiez** — les exports KDP sont prêts, la couverture est calibrée, l'audio est disponible.

Mon conseil personnel : **prenez le plan Expert à 9,99 €** dès le départ. C'est le meilleur rapport qualité/prix, et c'est celui qui vous fait vraiment goûter aux 30 agents.

*[À l'écran : bouton /v3/offres]*

Rendez-vous sur **ebookstudio.fr/v3/offres** pour souscrire. Si vous avez la moindre question, répondez à mon dernier email — je lis tout, personnellement.

Merci d'être là depuis le début. On se retrouve dans le studio.

— Georges

---

### 📌 Annexes prompteur

- **Rythme** : 1 slide/écran toutes les 45–60 secondes.
- **Coupures suggérées** : après §3 (clés), §5 (premier livre), §7 (tarifs).
- **Call-to-action final** : lien épinglé + carte cliquable Offres.
- **Sous-titres** : générés à l'export, revus avec la correction de style Ebookstudio.
